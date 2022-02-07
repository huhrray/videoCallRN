
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome5';
import firestore from '@react-native-firebase/firestore';
import auth from "@react-native-firebase/auth"

export default function LoginScreen(props: { navigation: string[]; }) {
    const [userName, setUserName] = useState("")
    const [userId, setUserId] = useState("")
    const [userPw, setUserPw] = useState("")
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const onLogin = async () => {
        setLoading(true);
        try {
            //login auth
            const credential = await auth().signInWithEmailAndPassword(userId, userPw)
            if (credential) {
                console.log(credential.user)
                setVisible(true)
                setUserId("")
                setUserPw("")
                setLoading(false);
                props.navigation.push("Home");
            }
        } catch (err) {
            console.log('Error', err);
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            <View style={styles.content}>
                <Icon name="tooth" color="#2247f1" size={50} style={styles.logoImg} />
                <Text style={styles.heading}>Vchina</Text>

                <TextInput
                    label="이메일"
                    onChangeText={text => setUserId(text)}
                    mode="outlined"
                    activeOutlineColor="#2247f1"
                    style={styles.input}
                    autoFocus
                />
                <TextInput
                    label="비밀번호"
                    onChangeText={text => setUserPw(text)}
                    mode="outlined"
                    activeOutlineColor="#2247f1"
                    style={styles.input}
                    secureTextEntry
                    right={<TextInput.Icon name="eye" />}
                />
                <Button
                    mode="contained"
                    onPress={onLogin}
                    loading={loading}
                    style={styles.btn}
                    contentStyle={styles.btnContent}
                    color="#2247f1"
                    disabled={userId.length === 0}>
                    로그인
                </Button>
                <Button
                    mode="contained"
                    onPress={() => props.navigation.push("Register")}
                    style={styles.btn}
                    contentStyle={styles.btnContent}
                    color="#2247f1"
                >
                    회원가입
                </Button>
                <Snackbar
                    visible={visible}
                    onDismiss={() => setVisible(false)}>
                    로그인되었습니다.
                </Snackbar>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#fff',
        flex: 1,
        display: "flex",
        justifyContent: 'center',
    },
    logoImg: {
        textAlign: "center",
        marginBottom: 10
    },
    content: {
        paddingHorizontal: 30,
        justifyContent: 'center',
    },
    heading: {
        textAlign: "center",
        fontSize: 40,
        marginBottom: 20,
        fontWeight: '900',
        color: "#2247f1"
    },
    input: {
        height: 60,
        marginBottom: 20
    },
    btn: {
        height: 50,
        alignItems: 'stretch',
        justifyContent: 'center',
        fontSize: 18,
        marginBottom: 10

    },
    btnContent: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
});
