import { Animal, Photo, User, Signal } from "./models"

import { connectDB } from "./utils"
import { unstable_noStore as noStore } from 'next/cache'
import mongoose, { ObjectId } from "mongoose"
import bcrypt from "bcryptjs"
import { IUser } from "@/types/models"

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
        const animals = await Animal.find();
        console.log(animals);
        
        return animals;
    } catch (e) {
        console.error(e);
        return [];
    }
};
export const getAllSignals = async () => {
    try {
        await connectDB();
        const signal = await Signal.find();
        return signal;
    } catch (e) {
        console.error(e);
        return [];
    }
};
export const filterAnimals = async (filters: { type?: string, city?: string, gender?: string } = {}) => {
    try {
        await connectDB();

        const query: { type?: string, city?: string, gender?: string } = {};

        if (filters.type) {
            query.type = filters.type;
        }

        if (filters.city) {
            query.city = filters.city;
        }

        if (filters.gender) {
            query.gender = filters.gender;
        }

        const animals = await Animal.find(query);
        return animals;
    } catch (e) {
        console.error(e);
        return [];
    }
};



export const getAnimalAd = async (id: string) => {
    try {
        connectDB()
        const animal = await Animal.findOne({ _id: id })

        return animal
    } catch (e) {
        console.error(e)
    }
};
export const getPhotos = async (id: string) => {
    try {
        connectDB()
        const photos = await Photo.find({ ownerID: id })
        return photos
    } catch (e) {
        console.error(e)
    }
};

export const getUser = async (email: string): Promise<IUser | null> => {
    noStore();
    try {
        connectDB()
        const user = await User.findOne({ email: email })
        return user
    } catch (e) {
        console.error(e)
        return null;
    }
};

export const getUserById = async (id: string | ObjectId): Promise<IUser | null> => {
    noStore();
    try {
        await connectDB();

        const user = await User.findById({ _id: id });
        return user ? user.toObject() : null;
    } catch (e) {
        console.error("Error fetching user by ID:", e);
        return null;
    }
};
export const getAllUsers = async () => {
    try {
        connectDB()
        const users = await User.find()
        return users
    } catch (e) {
        console.error(e)
    }
};
export const changeUser = async (id: string, updates: { password: string, name: string, email: string, img: string }) => {

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
            updates.password = await bcrypt.hash(updates.password, 10)

        }

        const allowedUpdates: (keyof typeof updates)[] = ['name', 'email', 'password', 'img'];
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
        connectDB();

        const animals = await Animal.find({ userID: userId });
        return animals;
    } catch (e) {
        console.error("Error fetching animals:", e);
        throw e;
    }
};
