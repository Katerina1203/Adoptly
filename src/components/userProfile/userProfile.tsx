import styles from './userProfile.module.css';
import AnimalCard from '../animalCard/AnimalCard';
import CreateAnimalBtn from '../createAnimal/CreateAnimalBtn';
import DeleteUserBtn from '../deleteUser/deleteUserBtn';
import EditUserBtn from '../editUser/EditUserButton';

type UserProfileProps = {
    user: {
        _id: string;
        username: string;
        email: string;
        img?: string;
        isAdmin?: boolean;
        createdAt?: string;
        updatedAt?: string;
    };
    animals: Array<{
        _id: string;
        description: string;
        type: string;
        age: string;
        city: string;
        gender: string;
        userID: string;
        createdAt?: string;
        updatedAt?: string;
    }>;
};

export default function UserProfile(props: UserProfileProps) {
    const handleUserUpdated = (updatedUser: { username: string; email: string }) => {
        props.user.username = updatedUser.username;
        props.user.email = updatedUser.email;
    };

    return (
        <div className={`${styles.profileWrapper} fade-in`}>
            <h1 className={styles.title}>Профил на потребителя</h1>

            <div className={styles.card}>
                <div className={styles.avatar}>
                    {props.user.img ? (
                        <img
                            src={props.user.img}
                            alt="User Avatar"
                            className={styles.avatarImg}
                        />
                    ) : (
                        <div className={styles.defaultAvatar}>
                            <span>👤</span>
                        </div>
                    )}
                </div>

                <div className={styles.details}>
                    <p><strong>Име:</strong> {props.user.username}</p>
                    <p><strong>Имейл:</strong> {props.user.email}</p>
                    <p><strong>Присъединил се:</strong> {props.user.createdAt}</p>
                </div>

                <div className={styles.buttonGroup}>
                    <EditUserBtn
                        userId={props.user._id}
                        user={{
                            username: props.user.username,
                            email: props.user.email,
                        }}
                    />
                    <DeleteUserBtn
                        userId={props.user._id}
                        username={props.user.username}
                    />
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-4">Вашите обяви</h2>
            <div className="grid grid-cols-1 gap-5 max-w-screen-lg w-full md:grid-cols-2 lg:grid-cols-3">
                {props.animals.length === 0 ? (
                    <p className="text-lg">Нямате обяви.</p>
                ) : (
                    props.animals.map((animal) => (
                        <div
                            key={animal._id}
                            className="bg-card rounded-sm p-3 text-center shadow-md"
                        >
                            <AnimalCard animal={animal} />
                            <p className="text-lg mt-3">{animal.description}</p>
                        </div>
                    ))
                )}
            </div>

            <div className="mt-8">
                <CreateAnimalBtn />
            </div>
        </div>
    );
}
