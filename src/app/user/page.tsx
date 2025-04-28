import UserProfile from '@/components/userProfile/userProfile';
import { auth } from "@/auth"
import { getUser, getAnimalsByUserId } from "@/lib/data";
import {redirect} from 'next/navigation';
export default async function UserPage() {

	const session = await auth();
	const dbUser = await getUser(session?.user?.email!)
	const dbAnimals = await getAnimalsByUserId(String(dbUser?._id!))
	
	const user = {
		_id: String(dbUser?._id!),
		username: dbUser?.username!,
		email: dbUser?.email!,
		img: dbUser?.img!,
		isAdmin: dbUser?.isAdmin,
		createdAt: dbUser?.createdAt?.toDateString(),
		updatedAt: dbUser?.updatedAt?.toDateString(),
	}
	const animals = dbAnimals.map((animal) => {
		return {
			_id: String(animal._id),
			description: String(animal.description!),
			type: String(animal.type!),
			age: String(animal.age!),
			city: String(animal.city!),
			gender: String(animal.gender!),
			userID: String(animal.userID!),
			createdAt: String(animal.createdAt?.toDateString()!),
			updatedAt: String(animal.updatedAt?.toDateString()!),
		}
	})

	if (!dbUser) {
		redirect('/login')
	}
	if (dbUser !== null) {
		return <UserProfile user={user} animals={animals} />
	}
}
