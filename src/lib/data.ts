import mongoose, { ObjectId } from "mongoose";
import bcrypt from "bcryptjs";
import { connectDB } from "./utils";
import { Animal, Photo, User } from "./models";
import { unstable_noStore as noStore } from "next/cache";
import { IUser } from "@/types/models";

export const createAnimal = async (animalData: any, userId: string) => {
  try {
    const animal = new Animal({ ...animalData, userID: userId });
    await animal.save();
    return animal;
  } catch (error) {
    console.error("Error creating animal ad:", error);
  }
};

export const getAnimals = async () => {
  try {
    await connectDB();
    return await Animal.find();
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const filterAnimals = async (filters: { type?: string; city?: string; gender?: string } = {}) => {
  try {
    await connectDB();
    const query: { type?: string; city?: string; gender?: string } = {};
    if (filters.type) query.type = filters.type;
    if (filters.city) query.city = filters.city;
    if (filters.gender) query.gender = filters.gender;

    return await Animal.find(query);
  } catch (e) {
    console.error(e);
    return [];
  }
};

export const getAnimalAd = async (id: string) => {
  try {
    await connectDB();
    return await Animal.findOne({ _id: id });
  } catch (e) {
    console.error(e);
  }
};

export const getPhotos = async (id: string) => {
  try {
    await connectDB();
    return await Photo.find({ ownerID: id });
  } catch (e) {
    console.error(e);
  }
};

export const getUser = async (email: string): Promise<IUser | null> => {
  noStore();
  try {
    await connectDB();
    const user = await User.findOne({ email }).lean();
    return user as unknown as IUser;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const getUserById = async (id: string | ObjectId): Promise<IUser | null> => {
    noStore();
    try {
        await connectDB();
        const user = await User.findById(id).lean();
        return user as unknown as IUser;
    } catch (e) {
        console.error("Error fetching user by ID:", e);
        return null;
    }
};
export const getAllUsers = async () => {
    try {
        await connectDB();
        const users = await User.find().lean();
        
        return users;
    } catch (e) {
        console.error(e);
    }
};
export const changeUser = async (
    id: string,
    updates: { password?: string; username?: string; email?: string; img?: string; phone?: string }
) => {
    console.log("Updating user with ID:", id);
    try {
        await connectDB();

        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.error("Invalid ObjectId format:", id);
            return { success: false, message: "Invalid user ID format." };
        }

        const user = await User.findById({ _id: id });
        if (!user) {
            console.error("User not found");
            return { success: false, message: "User not found." };
        }

        if (updates.password) {
            if (updates.password.length < 8 || updates.password.length > 25) {
                return { success: false, message: "Password must be between 8 and 25 characters." };
            }
            updates.password = await bcrypt.hash(updates.password, 10);
        }

        const allowedUpdates: (keyof typeof updates)[] = ["username", "email", "password", "img", "phone"];
        const updatesToApply: Partial<typeof updates> = {};
        for (const key of allowedUpdates) {
            if (updates[key] !== undefined) {
                updatesToApply[key] = updates[key];
            }
        }

        const updatedUser = await User.findByIdAndUpdate(id, updatesToApply, { new: true });

        if (!updatedUser) {
            return { success: false, message: "Failed to update user." };
        }

        return { success: true, user: updatedUser };
    } catch (e) {
        console.error("Error updating user:", e);
        return { success: false, message: "An error occurred while updating the user." };
    }
};


export const getAnimalsByUserId = async (userId: string) => {
  try {
    await connectDB();
    return await Animal.find({ userID: userId });
  } catch (e) {
    console.error("Error fetching animals:", e);
    throw e;
  }
};
