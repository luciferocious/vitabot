import {useState, useEffect, useCallback} from 'react';
import {collection, doc, getDoc, setDoc} from 'firebase/firestore';
import useAuthStore from '../zustand/AuthStore';
import {FIRESTORE_DB} from '../FirebaseConfig';

const useFetchConsent = () => {
  const [hasConsented, setHasConsented] = useState<boolean | undefined>(
    undefined,
  );
  const user = useAuthStore(state => state.user);

  const fetchConsent = useCallback(async () => {
    if (!user) return;

    const consentRef = doc(collection(FIRESTORE_DB, 'userConsents'), user);

    try {
      const docSnapshot = await getDoc(consentRef);
      if (docSnapshot.exists()) {
        setHasConsented(docSnapshot.data().hasConsented);
      } else {
        setHasConsented(false); // Default to false if no consent is found
      }
    } catch (error) {
      console.error('Error fetching consent data:', error);
    }
  }, [user]);

  const setConsent = useCallback(
    async (consent: boolean) => {
      if (!user) return;

      const consentRef = doc(collection(FIRESTORE_DB, 'userConsents'), user);

      try {
        await setDoc(consentRef, {hasConsented: consent});
        setHasConsented(consent);
      } catch (error) {
        console.error('Error setting consent data:', error);
      }
    },
    [user],
  );

  useEffect(() => {
    fetchConsent();
  }, [fetchConsent]);

  return {hasConsented, setConsent};
};

export default useFetchConsent;
