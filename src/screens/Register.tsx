import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Image,
  Keyboard,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackNavigationType} from '../Types';
import Toast from 'react-native-toast-message';
import {registrationStyles} from '../Styles';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import {FIREBASE_AUTH, FIRESTORE_DB} from '../FirebaseConfig';
import DatePicker from 'react-native-date-picker';
import SelectDropdown from 'react-native-select-dropdown';
import {addDoc, collection} from 'firebase/firestore';
import moment from 'moment';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [dateModal, setDateModal] = useState(false);
  const [selectedGender, setSelectedGender] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');

  const gender = ['Male', 'Female'];

  const auth = FIREBASE_AUTH;

  const usersCollectionRef = collection(FIRESTORE_DB, 'users');

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackNavigationType>>();

  const handleRegistration = async () => {
    setLoading(true);
    try {
      if (password !== confirmPassword) {
        Toast.show({
          type: 'error',
          text1: `Password do not match.`,
        });
        return;
      }

      const userCredentials = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredentials.user;

      await sendEmailVerification(user);

      await addDoc(usersCollectionRef, {
        email: email,
        fullName: name,
        dateOfBirth: dateOfBirth,
        gender: selectedGender,
        phoneNumber: phoneNumber,
      });

      Toast.show({
        type: 'success',
        text1: `Please verify your account in your email.`,
      });
      setLoading(false);
      setTimeout(() => {
        navigation.navigate('Login');
      }, 2000);
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: `Email already in use`,
      });
    }
  };

  const handleGoBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={registrationStyles.registration}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={registrationStyles.backgroundImage}>
        <View
          style={[
            registrationStyles.container,
            {
              marginTop: 0,
            },
          ]}>
          <Image
            source={require('../assets/logo.png')}
            style={[
              registrationStyles.logo,
              ,
              {
                marginBottom: keyboardVisible ? 0 : 30,
                marginTop: keyboardVisible ? 0 : 0,
                width: keyboardVisible ? 0 : '100%',
                height: keyboardVisible ? 0 : 100,
                display: keyboardVisible ? 'none' : 'flex',
              },
            ]}
          />
          <View style={registrationStyles.input_container}>
            <Text style={registrationStyles.input_label}>Email:</Text>
            <TextInput
              style={registrationStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={registrationStyles.input_container}>
            <Text style={registrationStyles.input_label}>Full Name:</Text>
            <TextInput
              style={registrationStyles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={registrationStyles.input_container}>
            <Text style={registrationStyles.input_label}>Password:</Text>
            <TextInput
              style={registrationStyles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={registrationStyles.input_container}>
            <Text style={registrationStyles.input_label}>
              Confirm Password:
            </Text>
            <TextInput
              style={registrationStyles.input}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />
          </View>
          <View style={registrationStyles.input_container}>
            <Text style={registrationStyles.input_label}>Date of Birth:</Text>
            <TouchableOpacity
              style={registrationStyles.input}
              onPress={() => setDateModal(true)}>
              <Text>{moment(dateOfBirth).format('YYYY-MM-DD')}</Text>
            </TouchableOpacity>
            <DatePicker
              modal
              mode="date"
              open={dateModal}
              date={dateOfBirth}
              onConfirm={date => {
                setDateModal(false);
                setDateOfBirth(date);
              }}
              onCancel={() => {
                setDateModal(false);
              }}
            />
          </View>
          <View style={registrationStyles.input_container}>
            <Text style={registrationStyles.input_label}>Gender</Text>
            <SelectDropdown
              buttonStyle={{
                width: '100%',
                borderWidth: 1,
                borderColor: 'black',
                borderRadius: 10,
                paddingLeft: 13,
                marginBottom: 5,
                marginTop: 3,
              }}
              buttonTextStyle={{
                fontSize: 16,
                fontWeight: '400',
              }}
              data={gender}
              onSelect={(selectedItem: string, index: number) => {
                setSelectedGender(selectedItem);
              }}
              buttonTextAfterSelection={(
                selectedItem: string,
                index: number,
              ) => {
                return selectedItem;
              }}
              rowTextForSelection={(item: string, index: number) => {
                return item;
              }}
            />
          </View>
          <View style={registrationStyles.input_container}>
            <Text style={registrationStyles.input_label}>Phone Number</Text>
            <TextInput
              style={registrationStyles.input}
              placeholder="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            />
          </View>
          <TouchableOpacity
            style={[
              registrationStyles.button,
              email && name && password && confirmPassword
                ? registrationStyles.buttonEnabled
                : registrationStyles.buttonDisabled,
            ]}
            disabled={!email || !name || !password || !confirmPassword}
            onPress={handleRegistration}>
            <Text style={registrationStyles.buttonText}>
              {loading ? 'Please wait...' : 'Register'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={registrationStyles.button}
            onPress={handleGoBackToLogin}>
            <Text style={registrationStyles.buttonGoBack}>
              Go back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Register;
