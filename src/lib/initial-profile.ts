import { currentUser, redirectToSignIn } from '@clerk/nextjs';
import { prisma } from './db/prisma';

export const initialProfile = async () => {
  const user = await currentUser();

  if (!user) {
    return redirectToSignIn();
  }

  const profile = await prisma.profile.findUnique({
    where: { userId: user.id },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await prisma.profile.create({
    data: {
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      imageUrl: user.imageUrl,
      name: `${user.firstName!} ${user.lastName}`,
    },
  });

  return newProfile;
};
