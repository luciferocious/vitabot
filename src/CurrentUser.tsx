import {useState, useEffect} from 'react';
import useAuthStore from './zustand/AuthStore';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {IUser} from './Types';
import {FIRESTORE_DB} from './FirebaseConfig';

const useFetchUserData = () => {
  const [userData, setUserData] = useState<IUser>();
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    const fetchData = async () => {
      const q = query(
        collection(FIRESTORE_DB, 'users'),
        where('email', '==', user),
      );

      try {
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach(doc => {
          const userData = {
            dateOfBirth: doc.data().dateOfBirth,
            email: doc.data().email,
            fullName: doc.data().fullName,
            gender: doc.data().gender,
            phoneNumber: doc.data().phoneNumber,
          };
          setUserData(userData);
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();
  }, [user]);

  return userData;
};

export default useFetchUserData;
