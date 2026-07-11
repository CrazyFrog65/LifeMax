import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // 1. Create default user
  const passwordHash = await bcrypt.hash("password123", 12);
  const user = await prisma.user.upsert({
    where: { email: "alex@lifemax.app" },
    update: {},
    create: {
      email: "alex@lifemax.app",
      name: "Alex Rivera",
      passwordHash,
    },
  });
  console.log(`  ✔ User: ${user.name} (${user.email})`);

  // 2. Create default categories
  const categories = [
    { name: "Academic",          productive: true,  color: "#4A7AE0", icon: "school",            defaultUrgent: true,  defaultImportant: true },
    { name: "Work",              productive: true,  color: "#6C9EFF", icon: "work",              defaultUrgent: true,  defaultImportant: true },
    { name: "Creative",          productive: true,  color: "#58A6FF", icon: "brush",             defaultUrgent: false, defaultImportant: true },
    { name: "Gym",               productive: true,  color: "#3FB950", icon: "fitness_center",    defaultUrgent: false, defaultImportant: true },
    { name: "Daily Chores",      productive: true,  color: "#D29922", icon: "cleaning_services", defaultUrgent: true,  defaultImportant: false },
    { name: "Personal",          productive: true,  color: "#A78BFA", icon: "person",            defaultUrgent: false, defaultImportant: true },
    { name: "Food",              productive: false, color: "#F85149", icon: "restaurant",        defaultUrgent: false, defaultImportant: true },
    { name: "Sleep",             productive: false, color: "#A0B2C6", icon: "bedtime",           defaultUrgent: false, defaultImportant: false },
    { name: "Nothing Specific",  productive: false, color: "#8B949E", icon: "do_not_disturb",    defaultUrgent: false, defaultImportant: false },
    { name: "None",              productive: false, color: "#545D68", icon: "remove",            defaultUrgent: false, defaultImportant: false },
  ];

  for (const cat of categories) {
    const id = `seed-${cat.name.toLowerCase().replace(/\s+/g, "-")}`;
    await prisma.category.upsert({
      where: { id },
      update: {
        defaultUrgent: cat.defaultUrgent,
        defaultImportant: cat.defaultImportant,
        color: cat.color,
        productive: cat.productive,
        icon: cat.icon,
      },
      create: { id, ...cat, userId: user.id },
    });
    console.log(`  ✔ Category: ${cat.name} (seeded)`);
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
