import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client.ts';
import dotenv from 'dotenv';
dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;
console.log("DB Connection String:", connectionString);
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });
export { prisma };
//# sourceMappingURL=prisma.js.map