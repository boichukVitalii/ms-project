import { Controller, Post, Body } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthenticationController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('signup')
  async signUp(@Body() newUser: SignUpDto) {
    return await this.authService.signUp(newUser);
  }
}
