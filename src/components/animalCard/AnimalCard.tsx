import styles from './animalCard.module.css'
import Image from 'next/image'
import Link from 'next/link'

import { takeAllPhotosForSingleAnimal } from '@/lib/actions'
import type { IAnimal } from "@/types/models"

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
}

const AnimalCard = async ({ animal }: Props) => {
    if (!animal._id) {
        throw new Error("Animal ID is undefined");
    }
    const photos = await takeAllPhotosForSingleAnimal(animal._id);

    const str = 'D:\\WorkSpace\\adoptly\\Adoptly\\public\\';
    console.log("photos", photos);
    
    if (photos && photos.length === 0) {
        return <div className={styles.noImage}>No image available</div>;
    }
    if (photos === undefined) {
        return <div className={styles.noImage}>No image available</div>;
    }
    const strippedPath = photos[0] !== undefined ? photos[0].src.replace(str, '').replace("\\", "/") : undefined
    
    // const str = 'D:\\WorkSpace\\diploma\\public\\';
    // const str2 = 'D:\\WorkSpace\\test\\diplomna2.0\\public\\'
    // const strippedPath = photos !== undefined ? photos[0].src.replace(str, '').replace(str2, '').replace("\\", "/") : undefined
    console.log("strippedPath",strippedPath);

    return (
        <div className={styles.container}>
            <div className={styles.rightSide}>
                <div className={styles.imgContainer}>
                    <Link className={styles.link} href={`/animals/${animal._id}`}>
                        <Image src={`/${strippedPath}`} className={styles.img} alt="" fill />
                    </Link>
                </div>
            </div>
            <div className={styles.bottomSide}>
                <p className={styles.type}> {animal.type}</p>
                <p className={styles.age}>{animal.age}</p>
                <div className={styles.charBox}>
                    <p className={styles.char}>{animal.city}</p>
                    <p className={styles.char}>{animal.gender}</p>
                </div>
            </div>
        </div>
    );
};
export default AnimalCard