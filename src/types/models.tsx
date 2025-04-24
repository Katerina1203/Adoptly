import { ObjectId } from "mongoose";

interface IUser {
    _id?: ObjectId;
    username: string;
    email: string;
    password?: string;
    img?: string;
    isAdmin?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IPhoto {
    _id?: ObjectId;
    title?: string;
    src: string;
    animalId?: ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

interface IAnimal {
    _id?: ObjectId;
    description: string;
    type: string;
    age: string;
    city: string;
    gender: string;
    userID: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ILocation {
    type: 'Point';
    coordinates: [number, number];
}

interface ISignal {
    _id?: ObjectId;
    senderId: ObjectId;
    name:string;
    description: string;
    location: ILocation;
    createdAt?: Date;
    updatedAt?: Date;
}

export type { IUser, IPhoto, IAnimal, ISignal };