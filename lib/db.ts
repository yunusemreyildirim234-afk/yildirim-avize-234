import { PrismaClient } from "@prisma/client";

declare global {
  var prismaInstance: PrismaClient | undefined;
}

export const prisma = globalThis.prismaInstance ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaInstance = prisma;
}