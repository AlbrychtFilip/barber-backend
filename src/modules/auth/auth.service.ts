import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { authRepository } from './auth.repository';

export const authService = {
  async register(email: string, password: string) {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      throw { status: 409, message: 'Email already registered' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await authRepository.create(email, hashedPassword);

    return { id: user.id, email: user.email };
  },

  async login(email: string, password: string) {
    const user = await authRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    if (!user.isActive) {
      throw { status: 403, message: 'Account is deactivated' };
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      throw { status: 401, message: 'Invalid email or password' };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: '24h',
    });

    return { token, user: { id: user.id, email: user.email } };
  },
};
