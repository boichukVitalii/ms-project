import { Module } from '@nestjs/common';
import { SqsProviderProducer } from './sqs-provider.producer';
import { SqsModule } from '@ssut/nestjs-sqs';
import { config } from '@app/config';

@Module({
  imports: [
    SqsModule.register({
      producers: [
        {
          name: config.QUEUE_NAME,
          queueUrl: config.QUEUE_URL,
          region: config.AWS_REGION,
        },
      ],
    }),
  ],
  providers: [SqsProviderProducer],
  exports: [SqsProviderProducer],
})
export class SqsProviderModule {}
