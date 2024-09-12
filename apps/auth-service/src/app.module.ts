import { Module } from '@nestjs/common';
import { AuthenticationModule } from './authentication/authentication.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [AuthenticationModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
