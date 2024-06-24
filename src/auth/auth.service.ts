import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from 'src/auth/dto/auth.dto';
import { UserService } from 'src/user/user.service';
import { z } from 'zod';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';

type LoginPayload = {
  user: Omit<User, 'password'>;
  backendTokens: {
    accessToken: string;
    refreshToken: string;
  };
}

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwtService: JwtService) { }

  async login(dto: z.infer<typeof LoginDto>): Promise<LoginPayload> {
    const user = await this.validateUser(dto);
    const payload = {
      username: user.email,
      sub: {
        name: user.name
      }
    };

    return {
      user,
      backendTokens: {
        accessToken: await this.jwtService.signAsync(payload, {
          expiresIn: '20s',
          secret: process.env.JWT_SECRET,
        }),
        refreshToken: await this.jwtService.signAsync(payload, {
          expiresIn: '7d',
          secret: process.env.JWT_REFRESH,
        }),
      }
    };
  }

  async validateUser(dto: z.infer<typeof LoginDto>): Promise<Omit<User, 'password'>> {
    const user = await this.userService.findByEmail(dto.email);

    if (user && (await compare(dto.password, user.password))) {
      const { password, ...result } = user;
      return result;
    }

    throw new UnauthorizedException('Credenciales inválidas');
  }

  async refreshToken(pay: any): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const payload = {
      username: pay.username,
      sub: pay.sub
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        expiresIn: '1h',
        secret: process.env.JWT_SECRET,
      }),
      refreshToken: await this.jwtService.signAsync(payload, {
        expiresIn: '7d',
        secret: process.env.JWT_REFRESH,
      }),
    };
  }
}
