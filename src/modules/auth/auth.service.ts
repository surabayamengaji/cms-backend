import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/common/services/prisma.service';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { responseSuccess } from 'src/utils/responses';

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({ where: { email } });
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      email: user.email,
      sub: user.id,
    };

    const payloadAccess: JwtPayload = {
      ...payload,
      type: 'access',
    };

    const payloadRefresh: JwtPayload = {
      ...payload,
      type: 'refresh',
    };

    const accessToken = this.jwtService.sign(payloadAccess);
    const refreshToken = this.jwtService.sign(payloadRefresh, {
      expiresIn: '2m',
    });

    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days expiry
      },
    });

    return responseSuccess(HttpStatus.OK, 'Login success', {
      accessToken,
      refreshToken,
    });
  }

  async refreshTokens(refreshToken: string) {
    const existingToken = await this.prismaService.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!existingToken || existingToken.expired_at < new Date()) {
      throw new UnauthorizedException('Refresh token expired or invalid');
    }

    const payload = {
      email: existingToken.user.email,
      sub: existingToken.user.id,
    };

    const payloadAccess: JwtPayload = {
      ...payload,
      type: 'access',
    };

    const payloadRefresh: JwtPayload = {
      ...payload,
      type: 'refresh',
    };

    const newAccessToken = this.jwtService.sign(payloadAccess);
    const newRefreshToken = this.jwtService.sign(payloadRefresh, {
      expiresIn: '3m',
    });

    await this.prismaService.refreshToken.update({
      where: { id: existingToken.id },
      data: {
        token: newRefreshToken,
        expired_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}
