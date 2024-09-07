import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  Animated,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {chatBubbleStyles} from '../Styles';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  onSummarize: (message: string) => void;
  onBubbleLongPress: () => void;
  isActive: boolean;
}

const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  isUser,
  onSummarize,
  onBubbleLongPress,
  isActive,
}) => {
  const [buttonOpacity] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(buttonOpacity, {
      toValue: isActive ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isActive, buttonOpacity]);

  const handleLongPress = () => {
    onBubbleLongPress();
  };

  const handleSummarize = () => {
    onSummarize(`Summarize this in categorized bullet points with brief category summaries.
    This summary captures the key elements of organizing information into specific categories (SUGGESTION, CAUSE/SYMPTOM, RECOMMENDATION), using bullet points, and providing summaries for each category. "${message}"`);
  };

  return (
    <View>
      <TouchableWithoutFeedback onLongPress={handleLongPress}>
        <View
          style={[
            chatBubbleStyles.messageContainer,
            isUser
              ? chatBubbleStyles.userMessageContainer
              : chatBubbleStyles.aiMessageContainer,
          ]}>
          <Text
            style={[
              chatBubbleStyles.messageText,
              isUser
                ? chatBubbleStyles.userMessageText
                : chatBubbleStyles.aiMessageText,
            ]}>
            {message}
          </Text>
        </View>
      </TouchableWithoutFeedback>
      {isActive && (
        <Animated.View
          style={[
            chatBubbleStyles.summarizeButtonContainer,
            {opacity: buttonOpacity},
          ]}>
          <TouchableOpacity
            style={chatBubbleStyles.summarizeButton}
            onPress={handleSummarize}>
            <Text style={chatBubbleStyles.summarizeButtonText}>Analyze</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

export default ChatBubble;
