import SingleAnimal from "@/components/singleAnimal/singleAnimal";

interface AnimalPageProps {
    params: Promise<{ id: string }>
}

const AnimalPage = async ({ params }: AnimalPageProps) => {
    const { id } = await params;

    return (
        <>
            <SingleAnimal id={id} />
        </>
    );
};

export default AnimalPage;