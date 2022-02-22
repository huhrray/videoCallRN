import React, { useEffect, useState } from 'react';
import { LogBox, StyleSheet } from 'react-native';
import LoginScreen from './screens/LoginScreen';
import CallScreen from './screens/CallScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import ChatScreen from './screens/ChatScreen';
import RegisterScreen from './screens/RegistScreen';
import HomeScreen from './screens/HomeScreen';
import auth from '@react-native-firebase/auth';
import UserListScreen from './screens/UserListScreen';
import VoiceSTT from './screens/VoiceSTT';
import { Provider } from 'react-redux';
import Store from './store';
import { useAppState } from '@react-native-community/hooks'
import ChatRoomListScreen from './screens/ChatRoomListScreen';
import LogoutButton from './components/LogoutButton';

const Stack = createNativeStackNavigator();

export default function App() {
  LogBox.ignoreAllLogs()
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const currentAppState = useAppState()
  console.log("currentApp State:::", currentAppState)


  // Handle user state 
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber()
      // hanldeShutDown()
    }; // unsubscribe on unmount
  }, []);

  if (initializing) return null;



  return (
    <NavigationContainer>
      <Provider store={Store}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2247f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
            },
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
          {user !== null && <Stack.Screen name="Home"
            component={HomeScreen}
            options={{
              headerBackButtonMenuEnabled: false,
              headerBackVisible: false,
              headerRight: () => <LogoutButton />
            }} />}
        </Stack.Navigator>
      </Provider>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  icon: {},
});
