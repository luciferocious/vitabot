import React, {useState, useRef} from 'react';
import {DrawerLayoutAndroid} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import DrawerContent from '../components/DrawerContent';
import ChatMessages from '../components/ChatMessages';

const Chat = () => {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [conversationId, setConversationId] = useState<string>('');

  const drawerRef = useRef<DrawerLayoutAndroid | null>(null);

  const openDrawer = () => {
    drawerRef.current?.openDrawer();
  };

  const closeDrawer = () => {
    drawerRef.current?.closeDrawer();
  };
  return (
    <SafeAreaView style={{flex: 1}}>
      <DrawerLayoutAndroid
        ref={drawerRef}
        drawerWidth={300}
        drawerPosition={'left'}
        renderNavigationView={() => (
          <DrawerContent setConversationId={setConversationId} />
        )}>
        <ChatMessages openDrawer={openDrawer} conversationId={conversationId} />
      </DrawerLayoutAndroid>
    </SafeAreaView>
  );
};

export default Chat;
