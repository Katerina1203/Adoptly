import mongoose from "mongoose"
import type  { IUser, IPhoto, IAnimal } from "@/types/models"
const userSchema = new mongoose.Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 4,
        max: 25,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        min: 8,
        max: 25,
    },
    phone: {
        type: String,
        size: 10,
        required: true,
        unique: true,
    },
    img: {
        type: String,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

const photoSchema = new mongoose.Schema<IPhoto>({
    title: {
        type: String,
    },
    src: {
        type: String,
        required: true,
    },
    animalId: {
        type: mongoose.Schema.ObjectId,
 
    }
},
    { timestamps: true }
);

const animalSchema = new mongoose.Schema<IAnimal>({
    description: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        required: true,
    },
    userID: {
        
        type: String,
        required: true,
        ref: 'User',
    },
},
    { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
export const Animal = mongoose.models.Animal || mongoose.model("Animal", animalSchema);
export const Photo = mongoose.models.Photo || mongoose.model("Photo", photoSchema);