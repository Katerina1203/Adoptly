import AnimalCard from "@/components/animalCard/AnimalCard";
import { getAnimals } from "@/lib/data"

const Animals = async () => {
	const animals = await getAnimals();

	return (
		<div className="max-w-full min-h-[75vh]">
			<div className="grid sm:grid-cols-1 gap-5 max-w-full md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
				{animals.map((animal) => (
					<div className="bg-white rounded-[10px] p-[10px] text-center shadow-md max-w-xl" key={animal._id}>
						<AnimalCard animal={animal} />
					</div>
				))}
			</div>
		</div>
	);
};

export default Animals;
