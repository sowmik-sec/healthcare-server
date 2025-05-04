import { UserRole } from "../src/generated/prisma";
import prisma from "../src/shared/prisma";
import bcrypt from "bcrypt";

const seedSuperAdmin = async () => {
  try {
    const isSuperAdminExists = await prisma.user.findFirst({
      where: {
        role: UserRole.SUPER_ADMIN,
      },
    });
    if (isSuperAdminExists) {
      console.log("Super admin already exists");
      return;
    }
    const hashedPassword: string = await bcrypt.hash("1234", 12);

    const superAdminData = await prisma.user.create({
      data: {
        email: "super@admin.com",
        password: hashedPassword,
        role: "SUPER_ADMIN",
        admin: {
          create: {
            name: "Super Admin",
            contactNumber: "123456789",
          },
        },
      },
    });
    console.log("Super admin created successfully", superAdminData);
  } catch (error) {
    console.error("Error");
  } finally {
    await prisma.$disconnect();
  }
};

seedSuperAdmin();
