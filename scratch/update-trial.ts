import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const trialExpiry = new Date();
  trialExpiry.setDate(trialExpiry.getDate() + 5);

  const updated = await prisma.shop.updateMany({
    data: {
      plan: "TRIAL",
      planExpiry: trialExpiry
    }
  });
  console.log(`Updated ${updated.count} shops to TRIAL.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
