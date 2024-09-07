import {
  View,
  Text,
  ImageBackground,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {StyleSheet} from 'react-native';
import Navbar from '../components/Navbar';
import {SafeAreaView} from 'react-native-safe-area-context';
import useFetchUserConversations from '../utilities/useFetchUserConversations';
import moment from 'moment';

export default function Insights() {
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const {
    conversations,
    messageCounts,
    totalMessages,
    userCreationDate,
    mostMessage,
    refresh,
  } = useFetchUserConversations();

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  console.log('conversations: ', conversations);
  console.log('message count:', messageCounts);
  console.log('most message:', mostMessage);

  return (
    <SafeAreaView style={styles.insightsContainer}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={{flex: 1}}>
        <Navbar />
        <ScrollView
          contentContainerStyle={styles.scrollViewContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          {conversations !== undefined && (
            <View style={styles.container}>
              <Text style={styles.insightsTitle}>User Insights</Text>
              <Text style={styles.insightsText}>
                <Text style={{fontWeight: 'bold'}}>Most Asked Questions: </Text>
                {mostMessage}
              </Text>
              <Text style={styles.insightsText}>
                <Text style={{fontWeight: 'bold'}}>
                  Count of Most asked Question:{' '}
                </Text>
                {Object.values(messageCounts)}
              </Text>

              <Text style={styles.insightsText}>
                <Text style={{fontWeight: 'bold'}}> Total Interactions: </Text>
                {totalMessages}
              </Text>
              <Text style={styles.insightsText}>
                <Text style={{fontWeight: 'bold'}}>Account Created On: </Text>
                {moment(userCreationDate).format('MMMM DD, yyyy HH:mm A')}
              </Text>
            </View>
          )}
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  insightsContainer: {
    flex: 1,
  },
  container: {
    padding: 30,
  },
  insightsTitle: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginBottom: 20,
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
  },
  insightsText: {
    color: 'white',
    textShadowColor: 'black',
    textShadowRadius: 1,
    textShadowOffset: {
      width: 2,
      height: 2,
    },
    fontSize: 18,
    marginBottom: 10,
  },
});
