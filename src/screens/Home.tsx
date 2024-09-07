import React, {useRef} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import {
  ImageBackground,
  TouchableOpacity,
  Image,
  View,
  Text,
  PanResponder,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {HomeStackProps} from '../Types';
import IconMenu from 'react-native-vector-icons/FontAwesome6';
import {ClipPath, Defs, Svg, Rect, G, Polygon} from 'react-native-svg';

const Home = () => {
  const navigation = useNavigation<HomeStackProps['navigation']>();

  const handleNavigateToChat = () => {
    navigation.navigate('Chat');
  };

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        // Set the responder when a vertical swipe is detected
        return Math.abs(gestureState.dy) > 20;
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -50) {
          // Swipe up detected
          handleNavigateToChat();
        }
      },
    }),
  ).current;

  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={{flex: 1}}>
        <Navbar />
        <View
          style={{
            width: '100%',
            paddingHorizontal: 20,
            flexWrap: 'wrap',
            flexDirection: 'row',
            gap: 20,
            justifyContent: 'space-around',
            paddingTop: 20,
          }}>
          <Image source={require('../assets/logo.png')} />
          <View
            style={{
              alignItems: 'flex-start',
              justifyContent: 'flex-start',
              width: '100%',
              padding: 20,
              borderRadius: 25,
            }}>
            <Text style={{fontSize: 18, color: 'white', textAlign: 'center'}}>
              The Healthcare Chatbot uses AI to analyze medical images and
              symptoms, aiding both professionals and patients. it provides
              diagnoses, treatment suggestions, and patient education. This
              efficient system improves triage, prioritization, and ensures data
              security.
            </Text>
          </View>
        </View>

        <View
          style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: 200,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          {...panResponder.panHandlers}>
          <TouchableOpacity
            style={{
              width: '100%',
              alignItems: 'center',
              backgroundColor: 'blue',
            }}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <Svg height="200" width="400">
                <Defs>
                  <ClipPath id="myClipPath">
                    <Polygon
                      points="200,0 400,16 400,400 0,400 0,16"
                      fillRule="evenodd"
                    />
                  </ClipPath>
                </Defs>
                <G clipPath="url(#myClipPath)">
                  <Rect
                    x="0"
                    y="0"
                    width="400"
                    height="200"
                    fill="rgba(0, 0, 0, 0.5)"
                  />
                </G>
              </Svg>
            </View>
            <View
              style={{
                position: 'absolute',
                bottom: -40,
                alignItems: 'center',
                gap: 20,
              }}>
              <View style={{alignItems: 'center'}}>
                <Text style={{color: 'white', marginBottom: 5, fontSize: 20}}>
                  Swipe up
                </Text>
                <Text style={{color: 'white', marginBottom: 5, fontSize: 20}}>
                  to use chatbot
                </Text>
              </View>
              <IconMenu name="arrow-up-long" size={40} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Home;
