import { auth, clerkClient } from '@clerk/nextjs/server';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/server/db';

const SyncUser = async () => {
  const { userId } = await auth(); // Get user ID from Clerk

  if (!userId) {
    throw new Error('User not found');
  }
  const client =await clerkClient();
  // Get user object from Clerk
  const user = await client.users.getUser(userId);

  const email = user.emailAddresses?.[0]?.emailAddress;//optional chaining safely access nested values.

  if (!email) {
    return notFound();
  }// guard early
  // if user exists up data information if it doesnt exist create a new entry
  await db.user.upsert({
    where: {
      emailAddress: email ?? "", // double check
    },
    update: {
      imageUrl: user.imageUrl,
      firstName: user.firstName, // 
      lastName: user.lastName,  
    },
    create: {
      clerkId: userId,
      emailAddress: email ?? "",
      imageUrl: user.imageUrl,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });

  return redirect('/dashboard')
};

export default SyncUser;
