"use client"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { createAnimalPost } from "@/lib/actions";
import React, { useState } from 'react';
import AddAnimalForm from '../forms/AddAnimalForm';

const style = {
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'background.paper',
	border: '2px solid #000',
	boxShadow: 24,
	pt: 2,
	px: 4,
	pb: 3,
	borderRadius: '8px',
};

type Props = {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const NestedModal = ({ open, setOpen }: Props) => {
	const [age, setAge] = useState('');
	const [ageError, setAgeError] = useState('');

	const handleOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const validateAge = (age: number) => {
		if (age <= 0 || !Number.isInteger(Number(age))) {
			return 'Age must be a positive integer';
		}
		return '';
	};

	const handleAgeChange = (event: any) => {
		setAge(event.target.value);
		const errorMessage = validateAge(event.target.value);
		setAgeError(errorMessage);
	};

	const handleSubmit = async (event: any) => {
		event.preventDefault();
		const formData = new FormData(event.target);

		const errorMessage = validateAge(Number(age));
		if (errorMessage) {
			setAgeError(errorMessage);
			return;
		}
		console.log("form data", formData);
		
		await createAnimalPost(formData);
		handleClose();
	};
	return (
		<div>
			<Dialog
				open={open}
				onOpenChange={handleClose}
				aria-labelledby="parent-modal-title"
				aria-describedby="parent-modal-description"
			>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Информация за животинчето</DialogTitle>
						<DialogDescription>
							Попълнете данните за вашето животинче
						</DialogDescription>
					</DialogHeader>

					<AddAnimalForm close={handleClose}/>
				</DialogContent>
			</Dialog>
		</div>
	);
};

export default NestedModal;