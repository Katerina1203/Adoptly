import AnimalCard from "@/components/animalCard/AnimalCard";
import { getAnimals } from "@/lib/data";
import styles from './animals.module.css';

const Animals = async () => {
	const animals = await getAnimals();

	return (
		<div className={styles.page}>
			<div className={styles.grid}>
				{animals.map((animal) => (
					<div className={styles.card} key={animal._id}>
						<AnimalCard animal={animal} />
					</div>
				))}
			</div>
		</div>
	);
};

export default Animals;
