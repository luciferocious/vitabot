import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {collection, getDocs, query, where} from 'firebase/firestore';
import {FIREBASE_AUTH, FIRESTORE_DB} from '../FirebaseConfig';
import useAuthStore from '../zustand/AuthStore';
import {IUser} from '../Types';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Fontisto from 'react-native-vector-icons/Fontisto';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {updatePassword} from 'firebase/auth';
import Toast from 'react-native-toast-message';

const UserProfile = () => {
  const [userData, setUserData] = useState<IUser>();
  const [isModalVisible, setModalVisible] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const user = useAuthStore(state => state.user);

  const auth = FIREBASE_AUTH;

  const currentUser = auth.currentUser;

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleChangePassword = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("Password and confirm password doesn't match.");
    }

    try {
      if (currentUser) await updatePassword(currentUser, password);
      toggleModal();
      Toast.show({
        type: 'success',
        text1: `Successfully change password.`,
      });
    } catch (error) {
      console.log(error);
    }
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

  return (
    <SafeAreaView style={{flex: 1, height: '100%'}}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={require('../assets/logo.png')}
          style={{width: '100%', height: 100, resizeMode: 'cover'}}
        />
      </ImageBackground>
      <View style={styles.container}>
        <View style={{gap: 5}}>
          <Text style={{fontSize: 20, fontWeight: 'bold', color: 'black'}}>
            {userData?.fullName}
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <MaterialCommunityIcons name="email" size={24} color="black" />
            <Text style={{fontSize: 18, color: 'black'}}>
              {userData?.email}
            </Text>
          </View>
        </View>
        <View style={{gap: 15, marginTop: 12}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <MaterialCommunityIcons
              name={
                userData?.gender === 'Male' ? 'gender-male' : 'gender-female'
              }
              size={24}
              color="black"
            />
            <Text style={{fontSize: 18, color: 'black'}}>
              {userData?.gender}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <Fontisto name="date" size={24} color="black" />
            <Text style={{fontSize: 18, color: 'black'}}>
              {moment(userData?.dateOfBirth.toDate()).format('YYYY-MM-DD')}
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
            <AntDesign name="contacts" size={24} color="black" />
            <Text style={{fontSize: 18, color: 'black'}}>
              {userData?.phoneNumber}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={toggleModal}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={toggleModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Change Password</Text>
            <TextInput
              style={styles.input}
              placeholder="New Password"
              placeholderTextColor="black"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="black"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleChangePassword}>
              <Text style={styles.modalButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={toggleModal}>
              <Text style={styles.modalButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default UserProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    height: '60%',
    paddingTop: 30,
  },
  button: {
    marginTop: 60,
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: 'black',
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
