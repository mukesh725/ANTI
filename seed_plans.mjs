import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const plans = [
    {
      name: 'AIRO ONE™ Select',
      description: '1 Member, ₹500 Welcome Coupons, Shopping Bag',
      price: 999,
      durationDays: 365,
      status: 'ACTIVE',
      features: JSON.stringify([
        '1 Member Covered',
        '2% Essentials Discount',
        '15% Pharmacy Discount',
        '2 Free Doctor Consultations/Yr',
        '4 Basic Health Screenings'
      ]),
      displayOrder: 1,
    },
    {
      name: 'AIRO ONE™ Preferred',
      description: 'Up to 3 Members, ₹1500 Welcome Coupons, Wellness Kit',
      price: 2999,
      durationDays: 365,
      status: 'ACTIVE',
      features: JSON.stringify([
        'Up to 3 Members Covered',
        '4% Essentials Discount',
        '18% Pharmacy Discount',
        '6 Free Doctor Consultations/Yr',
        '10 Basic Health Screenings'
      ]),
      displayOrder: 2,
    },
    {
      name: 'AIRO ONE™ Signature',
      description: 'Up to 5 Members, ₹2500 Welcome Coupons, Premium Wellness Kit',
      price: 4999,
      durationDays: 365,
      status: 'ACTIVE',
      features: JSON.stringify([
        'Up to 5 Members Covered',
        '6% Essentials Discount',
        '22% Pharmacy Discount',
        '10 Free Doctor Consultations/Yr',
        'Unlimited Basic Health Screenings',
        'VIP Priority Service'
      ]),
      displayOrder: 3,
    }
  ];

  for (const plan of plans) {
    // Upsert by name
    const existing = await prisma.membershipPlan.findFirst({
      where: { name: plan.name }
    });

    if (existing) {
      await prisma.membershipPlan.update({
        where: { id: existing.id },
        data: plan,
      });
      console.log(`Updated ${plan.name}`);
    } else {
      await prisma.membershipPlan.create({
        data: plan,
      });
      console.log(`Created ${plan.name}`);
    }
  }

  // Deactivate any old dummy plans if they exist
  await prisma.membershipPlan.updateMany({
    where: {
      name: {
        notIn: ['AIRO ONE™ Select', 'AIRO ONE™ Preferred', 'AIRO ONE™ Signature']
      }
    },
    data: { status: 'INACTIVE' }
  });

  console.log('Seed completed.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
