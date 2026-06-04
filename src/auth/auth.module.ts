import { Module } from '@nestjs/common';

import { JwtModule } from '@nestjs/jwt';

import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { User } from '../users/user.entity';

import { UsersModule } from '../users/users.module';

import { JwtStrategy } from './jwt.strategy';

import { AuditModule } from 'src/audit/audit.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),

    AuditModule,

    UsersModule,

    PassportModule,

    JwtModule.register({
      secret: process.env.JWT_SECRET || "super_secret_jwt_key",

      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController],

  providers: [
    AuthService,
    JwtStrategy,
  ],

  exports: [AuthService],
})
export class AuthModule {}