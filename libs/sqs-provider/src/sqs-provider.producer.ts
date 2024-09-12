import { Injectable, Logger } from '@nestjs/common';
import { SqsService } from '@ssut/nestjs-sqs';
import { randomUUID } from 'node:crypto';
import { config } from '@app/config';

@Injectable()
export class SqsProviderProducer {
  private readonly logger = new Logger(SqsProviderProducer.name);

  constructor(private readonly sqsService: SqsService) {}

  async sendEventMessage(event: string, delay: number) {
    try {
      await this.sqsService.send(config.QUEUE_NAME, {
        id: randomUUID(),
        body: JSON.stringify({
          EVENT: event,
          DELAY: delay,
        }),
      });
    } catch (error) {
      this.logger.log(error);
    }
  }
}
