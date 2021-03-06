import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth';
import { Button, Snackbar } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const LogoutButton = () => {
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    const hanldeLogOut = async () => {
        setLoading(true)
        await firestore().collection('currentUsers').doc(auth().currentUser?.uid).delete()
        auth().signOut().then(() => {
            console.log("user has signed out")
            setLoading(false)
            setVisible(true)

        })
    }

    return (
        <View>
            <Button
                // mode="contained"
                onPress={hanldeLogOut}
                style={styles.btn}
                contentStyle={styles.btnContent}
                color="#2247f1"
                loading={loading}>
                로그아웃
            </Button>
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
        marginBottom: 10,
        marginHorizontal: 10

    },
});
