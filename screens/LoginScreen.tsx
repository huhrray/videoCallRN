
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import auth from "@react-native-firebase/auth"

export default function LoginScreen(props: { navigation: any; }) {
    const [userId, setUserId] = useState("")
    const [userPw, setUserPw] = useState("")
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [snackBarText, setSnackBarText] = useState('')
    const onLogin = async () => {
        setLoading(true);
        try {
            //login auth
            const credential = await auth().signInWithEmailAndPassword(userId, userPw)
            if (credential) {
                console.log(credential.user)
                setVisible(true)
                setSnackBarText('로그인되었습니다.')
                setUserId("")
                setUserPw("")
                setLoading(false);
                props.navigation.push("Home");
            }
        } catch (err) {
            console.log('Error::', err);
            setVisible(true)
            setLoading(false);
            setSnackBarText("로그인 정보를 확인해주세요.")

            setTimeout(() => {
                setVisible(false)
                setSnackBarText('')
            }, 2000)
            //로그인 에러시 알림 추가!!!!!!!!!!

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
                    onPress={() => props.navigation.push("Register", { type: 'patient' })}
                    style={styles.btn}
                    contentStyle={styles.btnContent}
                    color="#2247f1"
                >
                    회원가입
                </Button>
                <View style={{ alignItems: 'center' }}>
                    <Text
                        style={{ fontSize: 13 }}
                        onPress={() => props.navigation.push("Register", { type: 'doctor' })}
                    >
                        전문의 회원 가입
                    </Text>
                </View>
            </View>
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}
                style={{ flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <Text>{snackBarText}</Text>
            </Snackbar>
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
