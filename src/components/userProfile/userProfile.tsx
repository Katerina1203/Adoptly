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
    phone?: string;
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

export default async function UserProfile(props: UserProfileProps) {
  console.log('User Profile Props:', props);
  const { user } = await props;
  console.log('User Profile Props:', user);
  const data = JSON.parse(JSON.stringify(user))
  
  return (
    <div className={`${styles.profileWrapper} fade-in`}>
      <h1 className={styles.title}>Профил на потребителя</h1>

      <div className={styles.card}>
        <div className={styles.avatar}>
          {props.user.img ? (
            <img src={props.user.img} alt="User Avatar" className={styles.avatarImg} />
          ) : (
            <div className={styles.defaultAvatar}>
              <span>👤</span>
            </div>
          )}
        </div>

        <div className={styles.details}>
          <p><strong>Име:</strong> {data.username}</p>
          <p><strong>Имейл:</strong> {data.email}</p>
          <p><strong>Телефонен номер:</strong> {data.phone}</p>
        </div>

        <div className={styles.buttonGroup}>
          <EditUserBtn
            userId={String(data._id)}
            user={{
              username: data.username,
              email: data.email,
              phone: data.phone || '',
            }}
          />
          <DeleteUserBtn
            userId={String(data._id)}
            username={data.username}
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
