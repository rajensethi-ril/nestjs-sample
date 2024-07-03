import { Injectable, Logger } from '@nestjs/common';
import dotenv from 'dotenv';
import Joi from 'joi';

export interface EnvConfig {
  [prop: string]: string;
}

export const NODE_ENV = 'NODE_ENV';
export const SESSION_SECRET = 'SESSION_SECRET';
export const COOKIE_MAX_AGE = 'COOKIE_MAX_AGE';
export const SESSION_NAME = 'SESSION_NAME';
export const TOKEN_VALIDITY = 'TOKEN_VALIDITY';
export const DB_NAME = 'DB_NAME';
export const DB_HOST = 'DB_HOST';
export const DB_USER = 'DB_USER';
export const DB_PASSWORD = 'DB_PASSWORD';
export const EVENTS_PROTO = 'EVENTS_PROTO';
export const EVENTS_HOST = 'EVENTS_HOST';
export const EVENTS_PORT = 'EVENTS_PORT';
export const EVENTS_USER = 'EVENTS_USER';
export const EVENTS_CLIENT_ID = 'EVENTS_CLIENT_ID';
export const EVENTS_PASSWORD = 'EVENTS_PASSWORD';
export const MONGO_URI_PREFIX = 'MONGO_URI_PREFIX';
export const MONGO_OPTIONS = 'MONGO_OPTIONS';
export const ENABLE_RATE_LIMIT = 'ENABLE_RATE_LIMIT';
export const ENABLE_CRON = 'ENABLE_CRON';
export const LOG_LEVEL = 'LOG_LEVEL';

export enum EnableRateLimit {
  ON = '1',
  OFF = '0',
}
export enum EnableCron {
  ON = '1',
  OFF = '0',
}
export enum AllowedEventsProtocol {
  MQTT = 'mqtt',
  TCP = 'tcp',
}
export const MONGO_OPTIONS_DEFAULT = 'retryWrites=true';
export const LOG_LEVEL_DEFAULT = 'log';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const config = dotenv.config().parsed;
    this.envConfig = this.validateInput(config);
    // Logger.log('config set', config, this.envConfig);
  }

  /**
   * Ensures all needed variables are set, and returns the validated JavaScript object
   * including the applied default values.
   */
  private validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      [NODE_ENV]: Joi.string().default('development'),
      [SESSION_SECRET]: Joi.string().required(),
      [COOKIE_MAX_AGE]: Joi.number().required(),
      [SESSION_NAME]: Joi.string().required(),
      [TOKEN_VALIDITY]: Joi.string().required(),
      [DB_NAME]: Joi.string().required(),
      [DB_HOST]: Joi.string().required(),
      [DB_USER]: Joi.string().required(),
      [DB_PASSWORD]: Joi.string().required(),
      [EVENTS_PROTO]: Joi.string()
        .allow(AllowedEventsProtocol.TCP, AllowedEventsProtocol.MQTT)
        .optional(),
      [EVENTS_USER]: Joi.string().optional(),
      [EVENTS_CLIENT_ID]: Joi.string().optional().allow(null, ''),
      [EVENTS_PASSWORD]: Joi.string().optional(),
      [EVENTS_HOST]: Joi.string().optional(),
      [EVENTS_PORT]: Joi.string().optional(),
      [MONGO_URI_PREFIX]: Joi.string().optional(),
      [MONGO_OPTIONS]: Joi.string().optional().default(MONGO_OPTIONS_DEFAULT),
      [ENABLE_RATE_LIMIT]: Joi.string()
        .allow(EnableRateLimit.ON, EnableRateLimit.OFF)
        .default(EnableRateLimit.ON),
      [ENABLE_CRON]: Joi.string()
        .allow(EnableCron.ON, EnableCron.OFF)
        .default(EnableCron.ON),
      [LOG_LEVEL]: Joi.string().optional().default(LOG_LEVEL_DEFAULT),
    });

    const { error, value: validatedEnvConfig } =
      envVarsSchema.validate(envConfig);
    if (error) {
      Logger.error(error, error.stack, this.constructor.name);
      process.exit(1);
    }
    return validatedEnvConfig;
  }

  get(key: string): string {
    switch (key) {
      case DB_NAME:
        return process.env.NODE_ENV === 'test-e2e'
          ? `test_${this.envConfig[key]}`
          : this.envConfig[key];
      default:
        return this.envConfig[key];
    }
  }
}
