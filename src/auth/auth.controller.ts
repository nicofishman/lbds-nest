import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { ZodPipe } from 'src/filters/zod.pipe';
import { CreateUserDto } from 'src/user/dto/user.dto';
import { z } from 'zod';
import { UserService } from 'src/user/user.service';
import { LoginDto } from 'src/auth/dto/auth.dto';
import { AuthService } from 'src/auth/auth.service';
import { RefreshJwtGuard } from 'src/auth/guards/refresh.guard';
import { Request as ExpReq } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService, private authService: AuthService) { }

  @Post('register')
  async registerUser(@Body(new ZodPipe(CreateUserDto)) body: z.infer<typeof CreateUserDto>) {
    return await this.userService.create(body);
  }

  @Post('login')
  async loginUser(@Body(new ZodPipe(LoginDto)) body: z.infer<typeof LoginDto>) {
    return await this.authService.login(body);
  }

  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  async refreshToken(@Request() req: ExpReq) {
    return await this.authService.refreshToken((req as any)['user']);
  }
}
