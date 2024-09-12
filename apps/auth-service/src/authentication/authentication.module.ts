import { Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { SqsProviderModule } from '@app/sqs-provider';
import {
  makeHistogramProvider,
  PrometheusModule,
} from '@willsoto/nestjs-prometheus';

@Module({
  imports: [PrismaModule, SqsProviderModule, PrometheusModule.register()],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    makeHistogramProvider({
      name: 'signup_request_duration_seconds',
      help: 'Histogram of the signup request execution time',
      labelNames: ['method', 'status'],
      buckets: [0.1, 0.5, 1, 2.5, 5],
    }),
  ],
})
export class AuthenticationModule {}
