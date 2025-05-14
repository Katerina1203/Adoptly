import { ObjectId } from "mongoose";

interface IUser {
    _id: string; 
    username: string;
    email: string;
    password?: string;
    phone?: string;
    img?: string;
    isAdmin?: boolean;
    createdAt?: Date | string;
    updatedAt?: Date | string;
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

export type { IUser, IPhoto, IAnimal };