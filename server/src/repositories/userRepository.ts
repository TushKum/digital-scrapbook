import { prisma } from '../db/prisma';

export const userRepository = {
  findByUsername(username: string) {
    return prisma.user.findUnique({ where: { username } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  touchLogin(id: string) {
    return prisma.user.update({ where: { id }, data: { lastLoginAt: new Date() } });
  },

  upsert(input: { username: string; passwordHash: string; displayName: string; role: string }) {
    return prisma.user.upsert({
      where: { username: input.username },
      create: input,
      update: { passwordHash: input.passwordHash, displayName: input.displayName, role: input.role },
    });
  },
};
