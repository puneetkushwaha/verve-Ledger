import { PrismaClient } from "@prisma/client";

// DO NOT USE globalThis caching temporarily to force re-initialization 
// of the new Prisma 6 client in the running process.
const prisma = new PrismaClient();

export default prisma;
