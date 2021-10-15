import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserJwtStrategy } from './user-jwt.strategy';
import { AdminJwtStrategy } from './admin-jwt.strategy';

@Module({
  providers: [AuthService, UserJwtStrategy,AdminJwtStrategy],
  controllers: [AuthController],
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: { expiresIn: '365d' }
    }),
    PrismaModule
  ]
})
export class AuthModule { }
