import { Injectable, Logger } from '@nestjs/common';
import { SqsConsumerEventHandler, SqsMessageHandler } from '@ssut/nestjs-sqs';
import { Message } from '@aws-sdk/client-sqs';
import { config } from '@app/config';
import { USER_CREATED_EVENT } from '@app/constants';
import { ApnService } from '../apn/apn.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { randomUUID } from 'node:crypto';

interface IMsgBodyPayload {
  EVENT: string;
  DELAY: number;
}

@Injectable()
export class AppleNotificationService {
  private readonly logger = new Logger(AppleNotificationService.name);

  constructor(
    private readonly apnService: ApnService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  @SqsMessageHandler(config.QUEUE_NAME, false)
  async handleMessageEvent(message: Message) {
    try {
      const payload = JSON.parse(message.Body) as IMsgBodyPayload;
      if (payload.EVENT === USER_CREATED_EVENT) {
        this.logger.log(`Got the ${USER_CREATED_EVENT} event!`);

        const timeout = setTimeout(
          this.sendNotification.bind(this),
          payload.DELAY,
        );
        this.schedulerRegistry.addTimeout(randomUUID(), timeout);

        return;
      }
    } catch (error) {
      this.logger.error(error);
    }
  }

  @SqsConsumerEventHandler(config.QUEUE_NAME, 'processing_error')
  async onProcessingError(error: Error) {
    this.logger.error(error);
  }

  private sendNotification() {
    const alert = 'User has registered!';
    const topic = config.APN_APP_TOPIC;
    void this.apnService.sendNotification({ alert, topic }, []);
  }
}
