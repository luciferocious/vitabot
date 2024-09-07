import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  Keyboard,
  ScrollView,
  Modal,
} from 'react-native';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackNavigationType} from '../Types';
import useAuthStore from '../zustand/AuthStore';
import Icon from 'react-native-vector-icons/AntDesign';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {SafeAreaView} from 'react-native-safe-area-context';
import {loginStyles} from '../Styles';
import {signInWithEmailAndPassword} from 'firebase/auth';
import {FIREBASE_AUTH} from '../FirebaseConfig';

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [keyboardVisible, setKeyboardVisible] = useState<boolean>(false);
  const [isChecked, setIsChecked] = useState<boolean>(false); // State for checkbox
  const [modalVisible, setModalVisible] = useState<boolean>(false); // State for modal

  const auth = FIREBASE_AUTH;

  const setUser = useAuthStore(state => state.setUser);

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

  const handleLogin = async () => {
    if (!isChecked) {
      Toast.show({
        type: 'error',
        text1: 'You must accept the terms and conditions to continue.',
      });
      return;
    }

    setLoading(true);
    try {
      const {user} = await signInWithEmailAndPassword(auth, email, password);
      if (user.emailVerified) {
        setLoading(false);
        setUser(email);
      } else {
        Toast.show({
          type: 'error',
          text1: `Please verify your email`,
        });
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: 'error',
        text1: `Email or password is incorrect.`,
      });
      console.log(error);
    }
  };

  const handleGoToRegisterScreen = () => {
    navigation.navigate('Register');
  };

  const handleGoToForgotPassword = () => {
    navigation.navigate('ForgotPassword');
  };

  // Handle showing the terms and conditions modal
  const handleTermsPress = () => {
    setModalVisible(true);
  };

  // Handle closing the terms and conditions modal
  const handleModalClose = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={loginStyles.login}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={loginStyles.backgroundImage}>
        <View
          style={[
            loginStyles.container,
            {
              marginTop: keyboardVisible ? 20 : 80,
            },
          ]}>
          <Image
            source={require('../assets/logo.png')}
            style={[
              loginStyles.logo,
              {
                marginTop: keyboardVisible ? 50 : 100,
                marginBottom: keyboardVisible ? 10 : 50,
              },
            ]}
          />
          <View style={loginStyles.input_container}>
            <Icon name="user" color="gray" size={24} />
            <TextInput
              style={loginStyles.input}
              placeholder="Email"
              placeholderTextColor="black"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          <View style={loginStyles.input_container}>
            <Icon name="lock" color="gray" size={24} />
            <TextInput
              style={loginStyles.input}
              placeholder="Password"
              placeholderTextColor="black"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>
          <View style={loginStyles.forgotContainer}>
            <Text></Text>
            <TouchableOpacity
              style={loginStyles.forgotPass}
              onPress={handleGoToForgotPassword}>
              <Text>Forgot password?</Text>
            </TouchableOpacity>
          </View>

          {/* Terms and Conditions Checkbox */}
          <View style={loginStyles.checkboxContainer}>
            <TouchableOpacity
              style={loginStyles.checkbox}
              onPress={() => setIsChecked(!isChecked)}>
              {isChecked && <Icon name="check" size={16} color="black" />}
            </TouchableOpacity>
            <Text style={loginStyles.termsText} onPress={handleTermsPress}>
              I agree to the <Text style={{color: 'blue'}}>Terms</Text> and{' '}
              <Text style={{color: 'blue'}}>Conditions</Text>
            </Text>
          </View>

          {/* Terms and Conditions Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={handleModalClose}>
            <View style={loginStyles.modalContainer}>
              <View style={loginStyles.modalContent}>
                <ScrollView>
                  <Text style={loginStyles.modalTitle}>
                    Terms and Conditions
                  </Text>
                  <Text style={loginStyles.modalText}>
                    {/* Placeholder text for terms and conditions */}
                    Welcome to Vitabot, your smart health companion. By
                    downloading, installing, or using the Vitabot mobile
                    application ("App"), you agree to these Terms and Conditions
                    ("Terms"). Please read them carefully.
                    {'\n\n'}1. **Acceptance of Terms**
                    {'\n'}By accessing or using the Vitabot App, you agree to be
                    bound by these Terms. If you do not agree with any part of
                    these Terms, you must immediately uninstall the App and
                    discontinue its use.
                    {'\n\n'}2. **Purpose of the App**
                    {'\n'}Vitabot is designed to provide general health
                    information, assist with health-related inquiries, and offer
                    personalized recommendations based on user inputs and
                    uploaded data. The App is not intended to replace
                    professional medical advice, diagnosis, or treatment.
                    {'\n\n'}3. **Use of the App**
                    {'\n'}Eligibility: You must be at least 18 years old to use
                    the App. If you are under 18, you must have parental or
                    guardian consent.
                    {'\n'}User Responsibility: You are responsible for providing
                    accurate and complete information to the App. The
                    recommendations provided are based on the data you input.
                    {'\n'}Prohibited Use: You agree not to misuse the App,
                    including but not limited to using it for any illegal or
                    unauthorized purposes, or attempting to interfere with the
                    operation of the App.
                    {'\n\n'}4. **Medical Disclaimer**
                    {'\n'}No Professional Advice: Vitabot provides general
                    health information and should not be considered professional
                    medical advice. Always consult a healthcare provider for
                    personalized medical advice, diagnosis, or treatment.
                    {'\n'}Emergency Situations: The App is not equipped to
                    handle medical emergencies. If you experience a medical
                    emergency, please contact emergency services immediately.
                    {'\n\n'}5. **Data Privacy and Security**
                    {'\n'}Data Collection: Vitabot collects and processes
                    personal data, including health information, in accordance
                    with our Privacy Policy. By using the App, you consent to
                    the collection and use of your data as described in the
                    Privacy Policy.
                    {'\n'}Data Security: We implement reasonable security
                    measures to protect your data, but we cannot guarantee
                    absolute security. It is your responsibility to maintain the
                    security of your mobile device and account.
                    {'\n\n'}6. **App Permissions**
                    {'\n'}The App may request access to certain features or data
                    on your mobile device, such as the camera for image
                    recognition or location services. Granting these permissions
                    is optional, but certain features of the App may not
                    function properly without them.
                    {'\n\n'}7. **Limitation of Liability**
                    {'\n'}No Warranty: The App is provided "as is" without any
                    warranties of any kind, either express or implied. We do not
                    guarantee the accuracy, completeness, or reliability of any
                    information provided by Vitabot.
                    {'\n'}Minor Illnesses: The App is designed to provide
                    guidance and information only for minor illnesses and health
                    concerns. It is not intended to diagnose, treat, or manage
                    serious medical conditions. Always consult a healthcare
                    provider for more significant health issues.
                    {'\n'}Limitation: To the fullest extent permitted by law, we
                    shall not be liable for any damages arising from your use of
                    the App, including but not limited to direct, indirect,
                    incidental, punitive, or consequential damages. This
                    includes, but is not limited to, any misinterpretation or
                    misuse of the information provided by the App.
                    {'\n\n'}8. **Intellectual Property**
                    {'\n'}Ownership: All content and materials provided by
                    Vitabot, including text, graphics, logos, and software, are
                    the intellectual property of Vitabot or its licensors and
                    are protected by applicable laws.
                    {'\n'}License: You are granted a limited, non-exclusive,
                    non-transferable license to use the App for personal,
                    non-commercial purposes.
                    {'\n\n'}9. **Governing Law**
                    {'\n'}These Terms shall be governed by and construed in
                    accordance with the laws of the Philippines, including but
                    not limited to the Data Privacy Act of 2012 (Republic Act
                    No. 10173) and the Cybercrime Prevention Act of 2012
                    (Republic Act No. 10175).
                    {'\n\n'}10. **Changes to the Terms**
                    {'\n'}We may update the App and these Terms from time to
                    time. Any updates will be pushed to your device, and
                    continued use of the App after any changes constitutes
                    acceptance of the new Terms. You may be required to accept
                    updated Terms to continue using the App.
                    {'\n\n'}11. **Termination**
                    {'\n'}We reserve the right to suspend or terminate your
                    access to the App at our discretion, without notice, for any
                    conduct that we believe violates these Terms or is harmful
                    to other users.
                  </Text>
                </ScrollView>
                <TouchableOpacity
                  style={loginStyles.modalButton}
                  onPress={handleModalClose}>
                  <Text style={loginStyles.modalButtonText}>Close</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <TouchableOpacity style={loginStyles.button} onPress={handleLogin}>
            <Text style={loginStyles.buttonText}>
              {loading ? 'Please wait..' : 'Sign in'}
            </Text>
          </TouchableOpacity>
          <View style={loginStyles.register_container}>
            <Text style={loginStyles.text}>Don't have account yet? </Text>
            <Text
              style={loginStyles.register_text}
              onPress={handleGoToRegisterScreen}>
              Register
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Login;
