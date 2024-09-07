import {useState, useEffect, useCallback} from 'react';
import {collection, getDocs, query, where} from 'firebase/firestore';
import useAuthStore from '../zustand/AuthStore';
import {FIRESTORE_DB} from '../FirebaseConfig';
import {ConversationInterface} from '../Types';
import {getAuth} from 'firebase/auth';

const useFetchUserConversations = () => {
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    [],
  );
  const [messageCounts, setMessageCounts] = useState<Record<string, number>>(
    {},
  );
  const [mostMessage, setMostMessage] = useState<string>('');
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [userCreationDate, setUserCreationDate] = useState<string | null>(null);

  const user = useAuthStore(state => state.user);

  const fetchUserCreationDate = useCallback(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserCreationDate(currentUser.metadata.creationTime || '');
    }
  }, []);

  const fetchConversations = useCallback(async () => {
    if (!user) return;

    fetchUserCreationDate();

    const q = query(
      collection(FIRESTORE_DB, 'conversation'),
      where('email', '==', user),
    );

    try {
      const querySnapshot = await getDocs(q);
      const fetchedConversations: ConversationInterface[] =
        querySnapshot.docs.map(doc => ({
          id: doc.id,
          email: doc.data().email,
          name: doc.data().name,
          createdAt: doc.data().createdAt,
        }));

      setConversations(fetchedConversations);

      const messagesCount: Record<string, number> = {};
      let totalCount = 0;

      await Promise.all(
        fetchedConversations.map(async conversation => {
          const messagesRef = collection(
            FIRESTORE_DB,
            `conversation/${conversation.id}/messages`,
          );
          const messagesSnapshot = await getDocs(messagesRef);

          const messageTexts = messagesSnapshot.docs.map(
            doc => doc.data().message as string,
          );

          totalCount += messageTexts.length;
          const count = countSimilarMessages(messageTexts);
          messagesCount[conversation.id] = count;
        }),
      );

      setMessageCounts(messagesCount);
      setTotalMessages(totalCount);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const countSimilarMessages = (messages: string[]): number => {
    const predefinedQuestions = [
      'Fever and/or flu like symptoms',
      'Pain or discomfort in specific area',
      'Respiratory issues (coughing, shortness of breath)',
      'Digestive issues (nausea, vomiting, diarrhea)',
    ];

    let count = 0;
    messages.forEach(message => {
      if (predefinedQuestions.includes(message)) {
        setMostMessage(message);
        count++;
      }
    });

    return count;
  };

  return {
    conversations,
    messageCounts,
    mostMessage,
    totalMessages,
    userCreationDate,
    refresh: fetchConversations,
  };
};

export default useFetchUserConversations;
