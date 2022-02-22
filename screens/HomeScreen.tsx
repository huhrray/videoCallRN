import { StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import auth from '@react-native-firebase/auth'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MainScreen from './MainScreen';
import ChatRoomListScreen from './ChatRoomListScreen';
import UserListScreen from './UserListScreen';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const Tab = createBottomTabNavigator();

const HomeScreen = (props: { navigation: any }) => {

    const { newMsgCount } = useSelector((state: RootState) => state.userReducer);
    const user = auth().currentUser
    if (user === null) {
        props.navigation.push('Login')
    }
    useEffect(() => {
        if (newMsgCount.count > 0) {

        }
    }, [newMsgCount])


    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName = '';
                    let iconColor: string = ''
                    if (route.name === 'Main') {
                        iconName = 'home'
                        iconColor = focused ? '#2247f1' : 'grey'
                    } else if (route.name === 'ChatRoomList') {
                        iconName = 'comments'
                        iconColor = focused ? '#2247f1' : 'grey'
                    } else if (route.name === 'List') {
                        iconName = 'user-md'
                        iconColor = focused ? '#2247f1' : 'grey'
                    }

                    // You can return any component that you like here!
                    return <Icon name={iconName} size={size} color={iconColor} />;

                },
                headerShown: false,
                tabBarActiveTintColor: '#2247f1',
                tabBarInactiveTintColor: 'gray',
                tabBarShowLabel: false,

            })}>
            <Tab.Screen name="Main" component={MainScreen} />
            <Tab.Screen name="ChatRoomList" component={ChatRoomListScreen} options={{
                tabBarBadge: newMsgCount.count > 0 ? 'new' : undefined
            }} />
            <Tab.Screen name="List" component={UserListScreen} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({

});

export default HomeScreen
