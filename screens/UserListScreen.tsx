import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import RoomContainer from '../components/RoomContainer';

const UserListScreen = (props: { navigation: string[]; }) => {
    return (
        <View>
            <RoomContainer />
        </View>
    );
};

export default UserListScreen;

const styles = StyleSheet.create({});
