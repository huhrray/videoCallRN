import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import UserListScreen from './UserListScreen';
import ChatScreen from './ChatScreen';
import CallScreen from './CallScreen';

const Stack = createNativeStackNavigator();

const TeleHealthScreen = () => {
    return (
        <NavigationContainer independent={true}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
            >
                <Stack.Screen name="List" component={UserListScreen} />
                <Stack.Screen name="Chat" component={ChatScreen}
                    options={({ route }: any) => ({
                        title: route.params.roomTitle
                    })} />
                <Stack.Screen name="Call" component={CallScreen}
                    options={({ route }: any) => ({
                        title: route.params.roomTitle
                    })} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default TeleHealthScreen

const styles = StyleSheet.create({})