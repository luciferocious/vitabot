import {View, Text, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import {homeStyles} from '../Styles';
import IconDelete from 'react-native-vector-icons/AntDesign';
import IconCreate from 'react-native-vector-icons/Ionicons';
import useAuthStore from '../zustand/AuthStore';
import {useEffect, useState} from 'react';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  deleteDoc,
  doc,
  where,
  getDocs,
} from 'firebase/firestore';
import {FIRESTORE_DB} from '../FirebaseConfig';
import {ConversationInterface} from '../Types';

interface Prop {
  setConversationId: (conversationId: string) => void;
}

const DrawerContent: React.FC<Prop> = ({setConversationId}) => {
  const [conversations, setConversations] = useState<ConversationInterface[]>(
    [],
  );

  const user = useAuthStore(state => state.user);

  const startConversation = async () => {
    try {
      await addDoc(collection(FIRESTORE_DB, 'conversation'), {
        email: user,
        name: `Conversation ${Math.floor(Math.random() * 1000)}`,
        createdAt: serverTimestamp(),
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await deleteDoc(doc(FIRESTORE_DB, 'conversation', conversationId));
    } catch (error) {
      console.error('Error deleting conversation:', error);
    }
  };

  useEffect(() => {
    const collectionRef = collection(FIRESTORE_DB, 'conversation');

    const fetchData = async () => {
      const q = query(collectionRef, where('email', '==', user));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map(
        doc =>
          ({
            id: doc.id,
            ...doc.data(),
          } as ConversationInterface),
      );

      setConversations(data as ConversationInterface[]);
    };
    fetchData();
  }, []);

  console.log('conversation list', conversations);

  return (
    <View style={homeStyles.drawerContainer}>
      <TouchableOpacity
        style={homeStyles.drawerNewChatButton}
        onPress={startConversation}>
        <IconCreate name="create-outline" size={24} color="black" />
        <Text style={{color: 'black'}}>New Chat</Text>
      </TouchableOpacity>

      <ScrollView style={homeStyles.drawerHistoryContainer}>
        {conversations?.map(conversation => (
          <View
            key={conversation.id}
            style={homeStyles.conversationButtonContainer}>
            <TouchableOpacity
              style={homeStyles.conversationButton}
              onPress={() => setConversationId(conversation.id)}>
              <Text style={{textAlign: 'center', color: 'black'}}>
                {conversation.name}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={homeStyles.conversationDeleteButton}
              onPress={() => deleteConversation(conversation.id)}>
              <IconDelete name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default DrawerContent;
