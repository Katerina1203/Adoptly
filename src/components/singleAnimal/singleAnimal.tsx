import Image from 'next/image';
import Link from 'next/link';
import { getAnimalAd, getUserById, getUser } from "@/lib/data";
import { takeAllPhotosForSingleAnimal, deleteAnimal } from "@/lib/actions";
import ImagesPreview from './imagesPreview';
import { auth } from "@/auth";
import DeleteAnimal from "@/components/deleteAnimal/DeleteAnimal";
import EditAnimalButton from "@/components/editAnimal/EditAnimalButton";
type Params = {
    id: string;
};

const SingleAnimal = async ({ id }: Params) => {
    const animal = await getAnimalAd(id);
    const photos = await takeAllPhotosForSingleAnimal(id);
    const session = await auth();

    if (!animal) {
        console.error("Animal not found", id);
        return <div>Animal not found.</div>;
    }

    const user = await getUserById(animal.userID);
    const currentUser = session?.user?.email ? await getUser(session.user.email) : null;
    const isOwner = currentUser?._id?.toString() === animal.userID.toString();

    const serializedUser = user
        ? {
              _id: user._id?.toString() || '',
              username: user.username,
              img: user.img || '/default-profile.png',
              phone: user.phone || '',
          }
        : null;

    if (!serializedUser || !serializedUser._id) {
        console.error("User not found or invalid user ID");
        return <div>User not found.</div>;
    }

    const serializedPhotos = (photos || []).map((photo) => ({
        _id: photo._id.toString?.() || '',
        src: photo.src.replace(/^.*[\\\/]uploads[\\\/]/, '/uploads/').replace(/\\/g, '/'),
    }));

    return (
        <div className="flex items-start gap-12 p-8 min-h-screen flex-col md:flex-row">
            <ImagesPreview photos={serializedPhotos} />

            <div className="flex-1 flex flex-col gap-4 p-4 rounded bg-popover-background shadow-md shadow-border min-w-full md:min-w-max">
                <div>
                    <div className="italic text-[1.2rem] mb-2 flex gap-8 font-bold">
                        <div>Информация</div>
                    </div>
                    <div className="italic text-[1.2rem] mb-2 flex flex-col">
                        <div>вид: {animal.type}</div>
                        <div>възраст: {animal.age}</div>
                        <div>пол: {animal.gender}</div>
                    </div>
                    <div className="italic text-[1.2rem] mb-2 flex gap-8">
                        <div>локация: {animal.city}</div>
                    </div>
                    <div>
                        {new Date(animal.createdAt).toLocaleString()}
                    </div>
                </div>

                <Link href={`/user/${serializedUser._id}`}>
                    <div className="flex items-center gap-4 cursor-pointer">
                        <Image
                            src={serializedUser.img}
                            alt={`${serializedUser.username}'s profile`}
                            className="rounded-full object-cover border-2 border-border"
                            width={60}
                            height={60}
                        />
                        <p>{serializedUser.username}</p>
                        <p>{serializedUser.phone}</p>
                    </div>
                </Link>

                <div className="mt-4 text-base leading-6">
                    <div className="font-bold text-lg mb-2">Допълнителна информация</div>
                    <div
                        className="whitespace-pre-wrap break-words max-h-40 overflow-y-auto p-2 border border-gray-300 rounded"
                        style={{ wordWrap: "break-word" }}
                    >
                        {animal.description}
                    </div>
                </div>

                {isOwner && (
                    <div className="flex gap-4 mt-6">

    <EditAnimalButton animal={{
      _id: animal._id.toString(),
      description: animal.description,
      type: animal.type,
      age: animal.age,
      city: animal.city,
      gender: animal.gender,
    }} />

                        <DeleteAnimal animalId={animal._id.toString()} deleteAction={deleteAnimal} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SingleAnimal;
