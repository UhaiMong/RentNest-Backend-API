import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";
import { UpdateUserStatusInput } from "./admin.validation";

const getAllUsers = async () => {
  return prisma.user.findMany({
    where: { role: { not: "ADMIN" } }, // admins manage tenants/landlords, not each other here
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

// Update status
const updateUserStatus = async (
  userId: string,
  data: UpdateUserStatusInput,
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(404, "User not found");
  if (user.role === "ADMIN")
    throw new ApiError(400, "Cannot change status of an admin account");

  return prisma.user.update({
    where: { id: userId },
    data: { status: data.status },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

// get all properties
const getAllProperties = async () => {
  return prisma.property.findMany({
    include: {
      category: true,
      landlord: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
};

// get all rental requests
const getAllRentalRequests = async () => {
  return prisma.rentalRequest.findMany({
    include: {
      property: { select: { id: true, title: true, location: true } },
      tenant: { select: { id: true, name: true, email: true } },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const adminServices = {
  getAllUsers,
  updateUserStatus,
  getAllProperties,
  getAllRentalRequests,
};
