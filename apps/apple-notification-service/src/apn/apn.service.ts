import { Injectable } from '@nestjs/common';
import { Provider, Notification } from '@parse/node-apn';
import { config } from '@app/config';
import { setTimeout } from 'node:timers/promises';

interface INotificationParams {
  alert: string;
  topic: string;
}

interface IMockProvider {
  send: (notification: Notification, deviceTokens: string[]) => Promise<any[]>;
}

@Injectable()
export class ApnService {
  private readonly provider: Provider | IMockProvider;

  constructor() {
    this.provider =
      config.APN_MODE === 'test'
        ? {
            async send() {
              await setTimeout(100);
              console.log('Apple push notification was sent!');
              return [];
            },
          }
        : new Provider({
            token: {
              key: config.APN_KEY,
              keyId: config.APN_KEY_ID,
              teamId: config.APN_TEAM_ID,
            },
          });
  }

  async sendNotification(
    notificationParams: INotificationParams,
    deviceTokens: string[],
  ) {
    const notification = new Notification(notificationParams);
    return await this.provider.send(notification, deviceTokens);
  }
}
