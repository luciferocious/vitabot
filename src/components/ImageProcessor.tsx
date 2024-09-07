import {View, TouchableOpacity, Modal, Text} from 'react-native';
import {
  launchImageLibrary,
  ImageLibraryOptions,
} from 'react-native-image-picker';
import {homeStyles} from '../Styles';
import IconImage from 'react-native-vector-icons/Entypo';
import React, {useEffect, useState} from 'react';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import {StyleSheet} from 'react-native';
import useFetchConsent from '../utilities/useFetchConsent';

interface Prop {
  setImageText: (imageText: string) => void;
}

const ImageProcessor = ({setImageText}: Prop) => {
  const [image, setImage] = useState<string | null>(null);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const {hasConsented, setConsent} = useFetchConsent();

  const imagePickerOptions: ImageLibraryOptions = {
    mediaType: 'photo',
  };

  const selectImage = async () => {
    if (hasConsented === undefined) {
      return; // Wait for consent state to load
    }
    if (!hasConsented) {
      setShowConsentModal(true);
      return;
    }

    try {
      const response = await launchImageLibrary(imagePickerOptions);
      if (
        !response.didCancel &&
        !response.errorMessage &&
        response.assets &&
        response.assets.length > 0
      ) {
        const selectedImageURI = response.assets[0].uri;
        setImage('Please wait');
        setImage(selectedImageURI || '');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchText = async () => {
      if (image) {
        // console.log(image);
        const result = await TextRecognition.recognize(image);
        setImageText(
          result.text +
            ' \n this is from a blood chem result, could you explain this to me',
        );
      }
    };
    fetchText();
  }, [image]);

  const handleConsent = async (consent: boolean) => {
    await setConsent(consent);
    setShowConsentModal(false);

    if (consent) {
      selectImage();
    }
  };

  return (
    <View style={homeStyles.imagePicker}>
      <TouchableOpacity
        onPress={selectImage}
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <IconImage name="image" size={24} color="black" />
      </TouchableOpacity>

      {/* Consent Modal */}
      <Modal
        transparent={true}
        visible={showConsentModal}
        onRequestClose={() => setShowConsentModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Consent Required</Text>
            <Text style={styles.modalText}>
              Consent for Uploading Blood Test Results By uploading your blood
              test results to VitaBot, you consent to the following: You
              voluntarily provide your results for personalized health insights.
              Your data will be securely stored and used only for analysis
              within the app. We will not share your information with third
              parties without your consent.
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                onPress={() => handleConsent(true)}
                style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Agree</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleConsent(false)}
                style={[styles.modalButton, {backgroundColor: 'red'}]}>
                <Text style={styles.modalButtonText}>Disagree</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ImageProcessor;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  modalButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
