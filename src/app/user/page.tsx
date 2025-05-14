import UserProfile from '@/components/userProfile/userProfile';
import { auth } from "@/auth";
import { getUser, getAnimalsByUserId } from "@/lib/data";
import { redirect } from 'next/navigation';

export default async function UserPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login");
  }

  const dbUser = await getUser(session.user.email);
  if (!dbUser) {
    redirect("/login");
  }

  const user = {
    _id: dbUser._id?.toString(),
    username: dbUser.username,
    email: dbUser.email,
    img: dbUser.img || "",
    isAdmin: dbUser.isAdmin || false,
    phone: dbUser.phone || "",
    createdAt: dbUser.createdAt?.toString() || "",
    updatedAt: dbUser.updatedAt?.toString() || "",
  };

  const dbAnimals = await getAnimalsByUserId(user._id!);
  const animals = dbAnimals.map((animal) => ({
    _id: animal._id?.toString() || "",
    description: animal.description,
    type: animal.type,
    age: animal.age,
    city: animal.city,
    gender: animal.gender,
    userID: animal.userID?.toString() || "",
    createdAt: animal.createdAt?.toString() || "",
    updatedAt: animal.updatedAt?.toString() || "",
  }));

  return <UserProfile user={user} animals={animals} />;
}
