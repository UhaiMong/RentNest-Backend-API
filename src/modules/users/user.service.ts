import { prisma } from "../../lib/prisma";
import { ApiError } from "../../utils/ApiError";

const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) throw new ApiError(404, "User Not found");
  const { password, ...safeUser } = user;
  return { user: safeUser };
};

export const userService = {
  getMe,
};
