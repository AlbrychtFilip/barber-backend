import db from '../../config/database';

export interface User {
  id: string;
  email: string;
  password: string;
  isActive: boolean;
  created_at: Date;
  updated_at: Date;
}

export const authRepository = {
  async findByEmail(email: string): Promise<User | undefined> {
    return db('users').where({ email }).first();
  },

  async create(email: string, hashedPassword: string): Promise<User> {
    const [user] = await db('users')
      .insert({ email, password: hashedPassword })
      .returning('*');
    return user;
  },
};
