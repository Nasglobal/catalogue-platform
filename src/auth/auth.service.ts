import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { UsersService } from '../users/users.service';

import { AuditService } from 'src/audit/audit.service';

@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,

    private readonly jwtService: JwtService,

    private readonly auditService: AuditService,
  ) {}

  // =====================================
  // REGISTER
  // =====================================

  async register(data: any) {

    const existing =
      await this.usersService.findByEmail(
        data.email,
      );

    if (existing) {
      throw new UnauthorizedException(
        'Email already exists',
      );
    }

    const hashedPassword =
      await bcrypt.hash(
        data.password,
        10,
      );

    const user =
      await this.usersService.create({
        ...data,
        password: hashedPassword,
      });

    return user;
  }

  // =====================================
  // LOGIN
  // =====================================

  async login(
    email: string,
    password: string,
  ) {

    const user =
      await this.usersService.findByEmail(
        email,
      );

    if (!user) {

      await this.auditService.log({
        userId: 0,
        userEmail: email,
        action: 'FAILED_LOGIN',
      });

      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password,
      );

    if (!isMatch) {
      await this.auditService.log({
        userId: 0,
        userEmail: email,
        action: 'FAILED_LOGIN',
      });
      
      throw new UnauthorizedException(
        'Invalid credentials',
      );
    }

    await this.usersService.updateLastLogin(
      user.id,
    );

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken =
      this.jwtService.sign(
        payload,
        {
          expiresIn: '1d',
        },
      );

    const refreshToken =
      this.jwtService.sign(
        payload,
        {
          expiresIn: '30d',
        },
      );

    await this.usersService.updateRefreshToken(
      user.id,
      refreshToken,
    );

    await this.auditService.log({
        userId: user.id,
        userEmail: user.email,
        action: 'LOGIN',
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
      user,
    };
  }

  async refresh(
    refreshToken: string,
  ) {

    try {

      const payload =
        this.jwtService.verify(
          refreshToken,
        );

      const user =
        await this.usersService.findById(
          payload.sub,
        );

      if (
        !user ||
        user.refreshToken !== refreshToken
      ) {
        throw new UnauthorizedException(
          'Invalid refresh token',
        );
      }

      const newAccessToken =
        this.jwtService.sign({
          sub: user.id,
          email: user.email,
          role: user.role,
        });

      return {
        access_token:
          newAccessToken,
      };

    } catch {

      throw new UnauthorizedException(
        'Invalid refresh token',
      );
    }
  }


  async logout(
  userId: number,
  userEmail: string,
  ) {

    await this.usersService
      .updateRefreshToken(
        userId,
        '',
      );

      await this.auditService.log({
        userId,
        userEmail,
        action: 'LOGOUT',
      });

    return {
      success: true,
    };
  }
}