import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SignUpDto } from './dto/signup.dto';
import { SqsProviderProducer } from '@app/sqs-provider/sqs-provider.producer';
import { Histogram } from 'prom-client';
import { InjectMetric } from '@willsoto/nestjs-prometheus';
import { USER_CREATED_EVENT } from '@app/constants';
import * as crypto from 'node:crypto';
import { promisify } from 'node:util';

const pbkdf2 = promisify(crypto.pbkdf2);

@Injectable()
export class AuthenticationService {
  private readonly logger = new Logger(AuthenticationService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly sqsProviderProducer: SqsProviderProducer,
    @InjectMetric('signup_request_duration_seconds')
    private readonly metric: Histogram<string>,
  ) {}

  async signUp(newUser: SignUpDto) {
    const stop = this.metric.startTimer();

    try {
      const oldUser = await this.findByEmail(newUser.email);
      if (oldUser) {
        throw new ConflictException('User with such email already exists!');
      }

      const { password, ...otherData } = newUser;

      const passwordHash = await this.hashPassword(password);

      const user = await this.prisma.user.create({
        data: {
          ...otherData,
          passwordHash,
        },
      });

      const DELAY = this.getRandomValue(10, 1000);
      void this.sqsProviderProducer.sendEventMessage(USER_CREATED_EVENT, DELAY);
      this.logger.log(`${USER_CREATED_EVENT} event was sent!`);

      delete user.passwordHash;
      return user;
    } finally {
      stop();
    }
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  private async hashPassword(password: string) {
    const salt = crypto.randomBytes(32).toString('hex');
    const hash = (await pbkdf2(password, salt, 10000, 64, 'sha512')).toString(
      'hex',
    );
    return `${salt}:${hash}`;
  }

  private getRandomValue(min, max): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
