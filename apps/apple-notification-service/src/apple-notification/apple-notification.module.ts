import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { config } from '@app/config';
import { AppleNotificationService } from './apple-notification.service';
import { ApnModule } from '../apn/apn.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    SqsModule.register({
      consumers: [
        {
          name: config.QUEUE_NAME,
          queueUrl: config.QUEUE_URL,
          region: config.AWS_REGION,
        },
      ],
    }),
    ApnModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [],
  providers: [AppleNotificationService],
})
export class AppleNotificationModule {}
