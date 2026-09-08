import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
await prisma.project.upsert({ where:{psId:'SIH26103'}, update:{}, create:{ psId:'SIH26103', title:'SIH26103 Project', teamName:'Demo Team', institute:'Your Institute', teamLeader:'Team Leader' }});
await prisma.$disconnect();
