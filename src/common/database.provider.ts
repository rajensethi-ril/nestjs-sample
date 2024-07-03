import { Logger } from '@nestjs/common';
import mongoose from 'mongoose';
import { defer, lastValueFrom, Observable } from 'rxjs';
import { delay, retry, scan } from 'rxjs/operators';
import {
  ConfigService,
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_USER,
  MONGO_OPTIONS,
  MONGO_URI_PREFIX,
} from './services/config/config.service';

export const MONGOOSE_CONNECTION = 'DATABASE_CONNECTION';

export const DatabaseProviders = [
  {
    provide: MONGOOSE_CONNECTION,
    useFactory: async (config: ConfigService): Promise<typeof mongoose> => {
      const mongoUriPrefix = config.get(MONGO_URI_PREFIX) || 'mongodb';
      const mongoOptions = config.get(MONGO_OPTIONS);
      mongoose.set('strictQuery', false);
      return await lastValueFrom(
        defer(() =>
          mongoose.connect(
            `${mongoUriPrefix}://${config.get(DB_USER)}:${config.get(
              DB_PASSWORD,
            )}@${config.get(DB_HOST).replace(/,\s*$/, '')}/${config.get(
              DB_NAME,
            )}?${mongoOptions}`,
          ),
        ).pipe(handleRetry()),
      );
    },
    inject: [ConfigService],
  },
];

export function handleRetry(
  retryAttempts = 9,
  retryDelay = 3000,
): <T>(source: Observable<T>) => Observable<T> {
  return <T>(source: Observable<T>) =>
    source.pipe(
      retry({
        delay: e =>
          e.pipe(
            scan((errorCount, error) => {
              Logger.error(
                `Unable to connect to the database. Retrying (${
                  errorCount + 1
                })...`,
                '',
                'DatabaseProvider',
              );
              if (errorCount + 1 >= retryAttempts) {
                throw error;
              }
              return errorCount + 1;
            }, 0),
            delay(retryDelay),
          ),
      }),
    );
}
