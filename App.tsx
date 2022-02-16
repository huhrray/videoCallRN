import React, { useEffect, useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import CallScreen from './screens/CallScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import ChatScreen from './screens/ChatScreen';
import RegisterScreen from './screens/RegistScreen';
import HomeScreen from './screens/HomeScreen';
import auth from '@react-native-firebase/auth';
import UserListScreen from './screens/UserListScreen';
import VoiceSTT from './screens/VoiceSTT';
import { Provider, useDispatch, useSelector } from 'react-redux';
import Store, { RootState } from './store';
import { hanldeShutDown } from './functions/firebaseUser';
import { useAppState } from '@react-native-community/hooks'
import Modal from 'react-native-modal';
import { setIncomingCall } from './store/actions/userAction';
import { Button } from 'react-native-paper';

const Stack = createNativeStackNavigator();

export default function App() {
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


  if (!user) {
    return (
      <NavigationContainer>
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
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
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
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="List" component={UserListScreen} />
            <Stack.Screen name="Chat" component={ChatScreen}
              options={({ route }: any) => ({
                title: route.params.roomTitle
              })} />
            <Stack.Screen name="Call" component={CallScreen}
              options={({ route }: any) => ({
                title: route.params.roomTitle
              })} />
            <Stack.Screen name="STT" component={VoiceSTT} />
          </Stack.Navigator>

        </Provider>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  icon: {},
});
