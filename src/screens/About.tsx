import {View, Text, SafeAreaView, ImageBackground} from 'react-native';
import React from 'react';
import Navbar from '../components/Navbar';

const About = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground
        source={require('../assets/background.jpg')}
        style={{flex: 1}}>
        <Navbar />
        <View style={{alignItems: 'center', marginTop: 100, flex: 1}}>
          <Text style={{fontSize: 35, fontWeight: 'bold'}}>About Us</Text>
          <Text
            style={{marginHorizontal: 10, fontWeight: 'bold', fontSize: 18}}>
            Using a unique combination of chatbot technology and image
            recognition. We are pleased to present Vitabot, your Smart Health
            Companion. Connecting state of the heart AI with individualized
            healthcare, Vitabot has insightful discussions while using picture
            recognition to improve diagnoses. Vitabot ushers in a new era of
            preventative and individualized health management by bringing
            together cutting-edge tech and individual aspirations.
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default About;
