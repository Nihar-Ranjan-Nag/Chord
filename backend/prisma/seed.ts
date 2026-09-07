import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin@123", 12);
  const demoPasswordHash = await bcrypt.hash("Password@123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@gmail.com" },
    update: { name: "Platform Admin", passwordHash: adminPasswordHash, role: Role.ADMIN, status: "ACTIVE" },
    create: {
      name: "Platform Admin",
      email: "admin@gmail.com",
      passwordHash: adminPasswordHash,
      role: Role.ADMIN
    }
  });

  const organizer = await prisma.user.upsert({
    where: { email: "organizer@demo.com" },
    update: {},
    create: {
      name: "Campus Innovation Club",
      email: "organizer@demo.com",
      passwordHash: demoPasswordHash,
      role: Role.ORGANIZER,
      phone: "+91 90000 00000"
    }
  });

  const student = await prisma.user.upsert({
    where: { email: "student@demo.com" },
    update: {},
    create: {
      name: "Rahul Sharma",
      email: "student@demo.com",
      passwordHash: demoPasswordHash,
      role: Role.USER,
      dateOfBirth: new Date("2004-06-15T00:00:00.000Z"),
      college: "Demo University",
      course: "Computer Science",
      yearOfStudy: 2,
      pointsBalance: 250
    }
  });

  const tech = await prisma.eventCategory.upsert({
    where: { slug: "technology" },
    update: {},
    create: { name: "Technology", slug: "technology" }
  });

  const social = await prisma.eventCategory.upsert({
    where: { slug: "social-impact" },
    update: {},
    create: { name: "Social Impact", slug: "social-impact" }
  });

  const merch = await prisma.rewardCategory.upsert({
    where: { slug: "merchandise" },
    update: {},
    create: { name: "Merchandise", slug: "merchandise" }
  });

  const vouchers = await prisma.rewardCategory.upsert({
    where: { slug: "vouchers" },
    update: {},
    create: { name: "Vouchers", slug: "vouchers" }
  });

  const now = Date.now();
  await prisma.event.upsert({
    where: { slug: "coding-challenge-2026" },
    update: {},
    create: {
      title: "Coding Challenge 2026",
      slug: "coding-challenge-2026",
      description: "Compete in a student coding challenge and solve practical programming problems.",
      shortDescription: "Build, solve and compete with other student developers.",
      categoryId: tech.id,
      organizer: "CampusSpark",
      isOnline: true,
      meetingUrl: "https://example.com/event",
      startAt: new Date(now + 14 * 24 * 60 * 60 * 1000),
      endAt: new Date(now + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
      registrationEndsAt: new Date(now + 12 * 24 * 60 * 60 * 1000),
      capacity: 250,
      participationPoints: 20,
      attendancePoints: 30,
      completionPoints: 50,
      status: "PUBLISHED",
      createdById: organizer.id
    }
  });

  await prisma.event.upsert({
    where: { slug: "tree-plantation-drive" },
    update: {},
    create: {
      title: "Tree Plantation Drive",
      slug: "tree-plantation-drive",
      description: "Join a community plantation drive and contribute to a greener campus.",
      shortDescription: "Make a real environmental impact with fellow students.",
      categoryId: social.id,
      organizer: "Campus Green Club",
      location: "City Central Park",
      isOnline: false,
      startAt: new Date(now + 20 * 24 * 60 * 60 * 1000),
      endAt: new Date(now + 20 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      registrationEndsAt: new Date(now + 18 * 24 * 60 * 60 * 1000),
      capacity: 100,
      participationPoints: 20,
      attendancePoints: 20,
      completionPoints: 30,
      status: "PUBLISHED",
      createdById: admin.id
    }
  });

  await prisma.reward.upsert({
    where: { slug: "campus-backpack" },
    update: {},
    create: {
      name: "Campus Backpack",
      slug: "campus-backpack",
      description: "Premium student backpack.",
      categoryId: merch.id,
      pointsCost: 800,
      stock: 25
    }
  });

  await prisma.reward.upsert({
    where: { slug: "shopping-voucher-500" },
    update: {},
    create: {
      name: "₹500 Shopping Voucher",
      slug: "shopping-voucher-500",
      description: "Digital shopping voucher worth ₹500.",
      categoryId: vouchers.id,
      pointsCost: 500,
      stock: 100
    }
  });

  const existingSeedPoints = await prisma.pointTransaction.findFirst({
    where: {
      userId: student.id,
      sourceType: "BONUS",
      sourceRef: "seed:welcome"
    }
  });

  if (!existingSeedPoints) {
    await prisma.pointTransaction.create({
      data: {
        userId: student.id,
        type: "CREDIT",
        points: 250,
        sourceType: "BONUS",
        sourceRef: "seed:welcome",
        description: "Welcome bonus",
        balanceAfter: 250
      }
    });
  }


  const sampleBook = await prisma.book.findFirst({ where: { title: "Clean Code", createdById: organizer.id } });
  if (!sampleBook) {
    await prisma.book.create({
      data: {
        title: "Clean Code",
        author: "Robert C. Martin",
        description: "A practical software craftsmanship book available through the CampusSpark borrowing service.",
        depositAmount: 500,
        stock: 3,
        status: "ACTIVE",
        createdById: organizer.id
      }
    });
  }

  console.log("Seed completed.");
  console.log("Admin: admin@gmail.com / Admin@123");
  console.log("User: student@demo.com / Password@123");
  console.log("Organizer: organizer@demo.com / Password@123");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
