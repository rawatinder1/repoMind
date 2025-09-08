'use server'
import { db } from '@/server/db';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import React from 'react';

type Props = {
  params: Promise<{ projectId: string }>;
};

const JoinHandler = async (props: Props) => {
  const { projectId } = await props.params;
  const { userId } = await auth();
  
  if (!userId) return redirect("/sign-in");

  const dbUser = await db.user.findUnique({
    where: {
      id: userId
    }
  });

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  
  if (!user) return redirect("/sign-in");

 

  const project = await db.project.findUnique({
    where: {
      id: projectId
    }
  });
  
  if (!project) return redirect("/dashboard");

  // Get the user record (either existing or newly created)
  const finalUser = dbUser || await db.user.findUnique({
    where: { clerkId: userId }
  });

  if (!finalUser) return redirect("/sign-in");

  try {
    await db.userToProject.create({
      data: {
        userId: finalUser.id,
        projectId
      }
    });
  } catch (err) {
    console.log("User already in project");
  }

  return redirect("/dashboard");
};

export default JoinHandler;