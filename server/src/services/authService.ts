import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { SignOptions } from 'jsonwebtoken';
import { userRepository } from '../repositories/userRepository';
import { AppError } from '../errors/AppError';
import { config } from '../config';
import type { LoginInput } from '../schemas';

export interface PublicUser {
  id: string;
  username: string;
  displayName: string;
  role: string;
}

export interface TokenPayload {
  sub: string;
  username: string;
  role: string;
}

function toPublicUser(u: { id: string; username: string; displayName: string; role: string }): PublicUser {
  return { id: u.id, username: u.username, displayName: u.displayName, role: u.role };
}

export const authService = {
  async hashPassword(plain: string): Promise<string> {
    return bcrypt.hash(plain, 10);
  },

  async login(input: LoginInput): Promise<{ token: string; user: PublicUser }> {
    const user = await userRepository.findByUsername(input.username);
    // Always run a compare to reduce username-enumeration timing leaks.
    const hash = user?.passwordHash ?? '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinv';
    const ok = await bcrypt.compare(input.password, hash);
    if (!user || !ok) {
      throw AppError.unauthorized('Invalid officer ID or password');
    }

    await userRepository.touchLogin(user.id).catch(() => undefined);

    const payload: TokenPayload = { sub: user.id, username: user.username, role: user.role };
    const token = jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as SignOptions['expiresIn'],
    });
    return { token, user: toPublicUser(user) };
  },

  verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as TokenPayload;
    } catch {
      throw AppError.unauthorized('Invalid or expired session');
    }
  },

  async getById(id: string): Promise<PublicUser> {
    const user = await userRepository.findById(id);
    if (!user) throw AppError.unauthorized('Session user no longer exists');
    return toPublicUser(user);
  },
};
