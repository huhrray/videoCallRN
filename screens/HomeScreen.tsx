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
import MyPageScreen from './MyPageScreen';

const Tab = createBottomTabNavigator();

const HomeScreen = (props: { navigation: any }) => {

    const { newMsgCount } = useSelector((state: RootState) => state.userReducer);
    const user = auth().currentUser
    if (user === null) {
        props.navigation.push('Login')
    }
    // sum of all the new messages 
    const sumNewMsg = () => {
        let count = 0
        // console.log(newMsgCount, '뉴메세지')
        newMsgCount.forEach((item: { roomId: string, count: number }) => {
            count = count + item.count
        });
        return count
    }

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
                    } else if (route.name === 'MyPage') {
                        iconName = 'user-circle'
                        iconColor = focused ? '#2247f1' : 'grey'
                    }
                    return <Icon name={iconName} size={size} color={iconColor} />;
                },
                headerShown: false,
                tabBarActiveTintColor: '#2247f1',
                tabBarInactiveTintColor: 'gray',
            })}>
            <Tab.Screen name="Main" component={MainScreen} options={{
                title: '홈'
            }} />
            <Tab.Screen name="ChatRoomList" component={ChatRoomListScreen} options={{
                tabBarBadge: sumNewMsg() > 0 ? `${sumNewMsg()}` : undefined,
                title: '내 채팅'
            }} />
            <Tab.Screen name="List" component={UserListScreen} options={{
                title: '비대면 진료'
            }} />
            <Tab.Screen name="MyPage" component={MyPageScreen} options={{
                title: '마이 페이지'
            }} />
        </Tab.Navigator>
    );
};

const styles = StyleSheet.create({

});

export default HomeScreen
