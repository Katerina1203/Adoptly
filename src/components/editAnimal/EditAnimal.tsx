"use server";

import { connectDB } from "@/lib/utils";
import { Animal, User } from "@/lib/models";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export const updateAnimal = async ({
	id,
	description,
	type,
	age,
	city,
	gender,
}: {
	id: string;
	description: string;
	type: string;
	age: string;
	city: string;
	gender: string;
}) => {
	try {
		await connectDB();

		const session = await auth();
		if (!session?.user?.email) {
			console.error("Unauthorized: No session email.");
			throw new Error("Unauthorized");
		}


		const user = await User.findOne({ email: session.user.email });
		if (!user) {
			console.error("User not found.");
			throw new Error("User not found");
		}


		const animal = await Animal.findById(id);
		if (!animal) {
			console.error("Animal not found with ID:", id);
			throw new Error("Animal not found");
		}

		if (animal.userID.toString() !== user._id.toString()) {
			console.error("User is not the owner of the animal.");
			throw new Error("Forbidden: You are not the owner of this ad.");
		}


		const updatedAnimal = await Animal.findByIdAndUpdate(
			id,
			{ description, type, age, city, gender },
			{ new: true }
		);

		if (!updatedAnimal) {
			console.error("Failed to update animal with ID:", id);
			throw new Error("Failed to update animal");
		}

		revalidatePath(`/animals/${id}`);
		return JSON.parse(JSON.stringify(updatedAnimal));
	} catch (error) {
		console.error("Error updating animal:", error);
		throw new Error("Internal server error");
	}
};
