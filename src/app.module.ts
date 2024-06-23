import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma/prisma.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { PartidoModule } from './partido/partido.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule, AuthModule, PartidoModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {
  // code here
}
