import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FIREBASE_AUTH, FIRESTORE_DB} from '../FirebaseConfig';
import {signOut} from 'firebase/auth';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import useAuthStore from '../zustand/AuthStore';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {HomeStackProps, IUser} from '../Types';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';

const Navbar = () => {
  const [userData, setUserData] = useState<IUser>();
  const [modalVisible, setModalVisible] = useState(false);

  const auth = FIREBASE_AUTH;

  const user = useAuthStore(state => state.user);
  const clearUser = useAuthStore(state => state.clearUser);

  const navigation = useNavigation<HomeStackProps['navigation']>();

  const handleNavigateToProfile = () => {
    navigation.navigate('UserProfile');
  };

  const handleNavigateToAnalytics = () => {
    navigation.navigate('Insights');
  };

  const handleNavigateToAbout = () => {
    navigation.navigate('About');
  };

  useEffect(() => {
    const fetch = async () => {
      const q = query(
        collection(FIRESTORE_DB, 'users'),
        where('email', '==', user),
      );

      const querySnapshot = await getDocs(q);

      querySnapshot.forEach(doc => {
        const userData = {
          dateOfBirth: doc.data().dateOfBirth,
          email: doc.data().email,
          fullName: doc.data().fullName,
          gender: doc.data().gender,
          phoneNumber: doc.data().phoneNumber,
        };
        console.log('User Data:', userData);
        setUserData(userData);
      });
    };
    fetch();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: `Successfully signout.`,
        });
        clearUser();
      })
      .catch(error => {
        Toast.show({
          type: 'error',
          text1: error,
        });
      });
  };
  return (
    <View style={styles.navbar}>
      <View style={{width: '80%'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold', color: 'white'}}>
          Welcome,
        </Text>
        <Text
          style={{
            fontSize: 28,
            fontWeight: 'bold',
            width: '100%',
            flexWrap: 'wrap',
            color: 'white',
          }}>
          {userData?.fullName.split(' ')[0]}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.burgerMenu}
        onPress={() => setModalVisible(true)}>
        <Icon name="bars" size={24} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Menu</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNavigateToProfile}>
              <Text style={styles.textStyle}>Profile Menu</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNavigateToAnalytics}>
              <Text style={styles.textStyle}>Insights</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={handleNavigateToAbout}>
              <Text style={styles.textStyle}>About</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.textStyle}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navbar: {
    height: 90,
    width: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  title: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  burgerMenu: {
    padding: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent black background
  },
  modalView: {
    width: '80%',
    backgroundColor: 'rgba(0, 0, 0, 0.8)', // Transparent black background for modal
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    padding: 10,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 20,
    color: 'white',
  },
});
