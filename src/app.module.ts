import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientBrandingModule } from './client-branding/client-branding.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ClientBrandingModule, CommonModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
