import { Global, Module } from '@nestjs/common';
import { CommonProviders } from './services';
import { DatabaseProviders } from './database.provider';

@Global()
@Module({
    providers:[ ...CommonProviders, ...DatabaseProviders ],
    exports:[ ...CommonProviders, ...DatabaseProviders ],
})
export class CommonModule {}
