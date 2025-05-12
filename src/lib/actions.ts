"use server"
import { revalidatePath } from "next/cache"
import { User, Animal, Photo } from "./models"
import { connectDB } from "./utils"
import path from "path"
import { writeFile } from "fs/promises"
import { signIn, signOut, auth } from "@/auth"
import { ObjectId } from "mongodb";

export const createAnimalPost = async (formData: FormData) => {
	try {
		await connectDB();
		const session = await auth();
		const description = formData.get('description')
		const type = formData.get('type')
		const age = formData.get('age')
		const city = formData.get('city')
		const gender = formData.get('gender')
		const files = formData.getAll('file')
		if (!description || !type || !age || !city || !gender || !files || !Array.isArray(files)) {
			throw new Error("Invalid data provided");
		}
		const user = await User.findOne({ email: session?.user?.email });
		if (user == null) return
		const newAnimal = await Animal.create({
			description,
			type,
			age,
			city,
			gender,
			userID: user._id
		});
		const animal = await newAnimal.save();
		for (const file of files) {
			if (file instanceof File) {
				const filename = Date.now() + file?.name?.replaceAll(" ", "_");
				const newPath = path.join(process.cwd(), 'public', 'uploads', filename)
				const buffer = Buffer.from(await file.arrayBuffer());
				await writeFile(
					newPath,
					buffer
				);
				await Photo.create({
					title: filename,
					src: newPath,
					animalId: animal._id,
				});
			}
		}
	} catch (e) {
		console.log("Error occurred ", e)
	}

}
export const getAnimalById = async (id: string) => {
	await connectDB();
	const animal = await Animal.findOne({ _id: new ObjectId(id) });
	return {
	  ...animal,
	  _id: animal._id.toString(), // Convert ObjectId to string
	};
  };
export const takeAllPhotosForSingleAnimal = async (id: string) => {
	try {
		await connectDB();
		const photos = await Photo.find({ animalId: id });
		return photos

	} catch (error) {
		console.error("Error occurred: ", error)
	}
}
export const getCleanImagePath = async (fullPath: string): Promise<string> => {
	if (!fullPath) return '/placeholder.jpg';

	const cleanedPath = fullPath
		.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/')
		.replace(/\\/g, '/');

	return cleanedPath;
};

export const deleteAnimal = async (formData: FormData) => {
	const { id } = Object.fromEntries(formData);

	try {
		connectDB();

		await Animal.findByIdAndDelete(id);
		console.log("deleted from db");
		revalidatePath("/animals");

	} catch (e) {
		console.log(e);
		return { error: "Something went wrong!" };
	}
}
//users
export const handleGoogleLogin = async () => {
	"use server";
	await signIn("google", { redirectTo: "/" });
}

export const handleLogout = async () => {
	// "use server";
	await signOut({ redirectTo: "/" });
}
export async function getUserWithCredentialsFromForm(formData: FormData) {
	try {
		const response = await signIn("credentials", {

			email: formData.get("email"),
			password: formData.get("password"),
			redirect: false,
		});
		return response;
	} catch (e) {
		console.error(e)

	}
}

export async function getUserWithCredentials(values: { email: string, password: string }) {
	try {
		const response = await signIn("credentials", {
			email: values.email,
			password: values.password,
			redirect: false,
		});
		return response;
	} catch (e) {
		console.error(e)

	}
}
export async function createUser(user: { username: string, email: string, password: string, phone: string, isAdmin?: boolean }) {
	try {
		await connectDB();
		await User.create(user)
	} catch (e) {
		console.error(e)
	}
}
export const updateUser = async (formData: FormData) => {
    try {
        await connectDB();

        const id = formData.get("id") as string;
        const username = formData.get("username") as string;
        const email = formData.get("email") as string;

        if (!id || !username || !email) {
            throw new Error("Missing required fields");
        }

        const updatedUser = await User.findByIdAndUpdate(
            id,
            { username, email },
            { new: true } 
        );

        if (!updatedUser) {
            throw new Error("User not found");
        }

        return updatedUser; 
    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
};
export const deleteUser = async (formData: FormData) => {
	const { id } = Object.fromEntries(formData);

	try {
		connectDB();

		await Animal.deleteMany({ userID: id });
		await User.findByIdAndDelete(id);
		console.log("deleted data from the db");
		revalidatePath("/admin");
	} catch (err) {
		console.log(err);
		return { error: "Something went wrong!" };
	}
};


export const getSession = async () => {
	try {
		const session = await auth();
		return session;
	} catch (error) {
		console.error('Error fetching session:', error);
		return null;
	}
};
