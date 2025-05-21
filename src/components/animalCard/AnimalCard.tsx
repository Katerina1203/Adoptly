import styles from './animalCard.module.css';
import Image from 'next/image';
import Link from 'next/link';

import { takeAllPhotosForSingleAnimal } from '@/lib/actions';
import { getCleanImagePath } from '@/lib/actions';

type Props = {
	animal: {
		_id: string;
		description: string;
		type: string;
		age: string;
		city: string;
		gender: string;
		userID: string;
		createdAt?: string;
		updatedAt?: string;
	};
};

const AnimalCard = async ({ animal }: Props) => {
	if (!animal._id) {
		throw new Error("Animal ID is undefined");
	}

	const photos = await takeAllPhotosForSingleAnimal(animal._id);
	const firstPhoto = photos?.[0];
	const imagePath = firstPhoto ? await getCleanImagePath(firstPhoto.src) : null;

	return (
		<div className={styles.container}>
			<div className={styles.rightSide}>
				<div className={styles.imgContainer}>
					<Link className={styles.link} href={`/animals/${animal._id}`}>
						{imagePath ? (
							<Image
								src={imagePath}
								alt={`${animal.type} image`}
								className={styles.img}
								fill
							/>
						) : (
							<div className={styles.noImage}>No image available</div>
						)}
					</Link>
				</div>
			</div>

			<div className={styles.bottomSide}>
				<p className={styles.type}>{animal.type}</p>
				<p className={styles.age}>{animal.age}</p>
				<div className={styles.charBox}>
					<p className={styles.char}>{animal.city}</p>
					<p className={styles.char}>{animal.gender}</p>
				</div>
			</div>
		</div>
	);
};

export default AnimalCard;
