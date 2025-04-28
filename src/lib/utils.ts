import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

import mongoose from 'mongoose';

interface Connection {
	isConnected?: number;
}

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

let connection: Connection = {};

export const connectDB = async () => {
	if (connection.isConnected) {
		return;
	}

	try {
		const db = await mongoose.connect(process.env.MONGODB as string);
		connection.isConnected = db.connections[0].readyState;
		console.log('Connected to MongoDB');
	} catch (e) {
		console.error('Failed to connect to MongoDB', e);
	}
} 