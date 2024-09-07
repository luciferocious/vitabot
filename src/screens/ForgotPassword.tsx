import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ImageBackground,
} from 'react-native';
import {sendPasswordResetEmail} from 'firebase/auth';
import {FIREBASE_AUTH} from '../FirebaseConfig';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import Icon from 'react-native-vector-icons/AntDesign';
import {loginStyles} from '../Styles';
import {SafeAreaView} from 'react-native-safe-area-context';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);

  const auth = FIREBASE_AUTH;

  const handleSendEmail = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({
        type: 'success',
        text1: `Please check your email for change of password.`,
      });
      setTimeout(() => {
        setIsEmailSent(true);
      }, 2000);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: `Please type your email in the email section.`,
      });
    }
  };

  return (
    <SafeAreaView style={styles.forgotPassword}>
      <ImageBackground
        source={require('../assets/background-white.jpg')}
        style={loginStyles.backgroundImage}>
        <View style={styles.container}>
          <Text style={styles.title}>Forgot Password</Text>
          <Text style={styles.instructions}>
            {!isEmailSent
              ? 'We will send a password reset link to your email. Please check your email.'
              : 'An email with a password reset link has been sent to your emailaddress. Please check your inbox.'}
          </Text>
          <View style={loginStyles.input_container}>
            <Icon name="user" size={24} />
            <TextInput
              style={loginStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <TouchableOpacity
            style={loginStyles.button}
            onPress={handleSendEmail}>
            <Text style={loginStyles.buttonText}>
              {!isEmailSent ? 'Send' : 'Resend'}
            </Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    flex: 1,
  },
  container: {
    paddingHorizontal: 10,
    marginTop: 150,
    gap: 10,
    height: 250,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  instructions: {
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
});

export default ForgotPassword;
