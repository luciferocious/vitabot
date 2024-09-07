import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Home from '../screens/Home';
import Chat from '../screens/Chat';
import UserProfile from '../screens/UserProfile';
import About from '../screens/About';
import Insights from '../screens/Insights';

const HomeStackNavigation = () => {
  const HomeStack = createNativeStackNavigator();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Home}
        options={{headerShown: false}}
      />
      <HomeStack.Screen name="Chat" component={Chat} />
      <HomeStack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{headerTitle: 'User Profile'}}
      />
      <HomeStack.Screen
        name="About"
        component={About}
        options={{headerShown: false}}
      />
      <HomeStack.Screen
        name="Insights"
        component={Insights}
        options={{headerShown: false}}
      />
    </HomeStack.Navigator>
  );
};

export default HomeStackNavigation;
