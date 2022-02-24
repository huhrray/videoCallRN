import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Button, Snackbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const LogoutButton = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const { currentUserUid } = useSelector((state: RootState) => state.userReducer);
    const hanldeLogOut = async () => {
        setLoading(true)
        firestore().collection('currentUsers').doc(currentUserUid).delete().then(() => {
            auth().signOut().then(() => {
                console.log("user has signed out")
                setLoading(false)
                setVisible(true)

            })
        })

    }

    return (
        <View>
            <Icon name='sign-out-alt' size={20} color="#fff" onPress={hanldeLogOut} />
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}>
                로그아웃되었습니다.
            </Snackbar>
        </View>
    );
};

export default LogoutButton;

const styles = StyleSheet.create({
    btnContent: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    btn: {
        height: 50,
        alignItems: 'stretch',
        justifyContent: 'center',
        fontSize: 18,
    },
});
