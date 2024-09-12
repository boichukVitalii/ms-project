import { Module } from '@nestjs/common';
import { AppleNotificationModule } from './apple-notification/apple-notification.module';
import { ApnModule } from './apn/apn.module';

@Module({
  imports: [AppleNotificationModule, ApnModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
