import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native'
import { Button, TextInput } from 'react-native-paper';
import auth from "@react-native-firebase/auth"


export default function RegisterScreen(props: { navigation: string[]; }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [avatar, setAvatar] = useState('');

    const handleJoin = async (email: string, password: string) => {
        try {
            let response = await auth().createUserWithEmailAndPassword(email, password);
            if (response) {
                console.log("?", response)
            }
        } catch (e) {
            console.error(e);
        }

    }

    return (
        <View style={styles.container}>
            <TextInput
                placeholder='이름을 입력하세요'
                label='이름'
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
                activeUnderlineColor="#2247f1"
            />
            <TextInput
                placeholder='이메일 주소를 입력하세요'
                label='Email'
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                activeUnderlineColor="#2247f1"
            />
            <TextInput
                placeholder='비밀번호를 입력하세요'
                label='비밀번호'
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                style={styles.input}
                activeUnderlineColor="#2247f1"
            />
            {/* <TextInput
                placeholder='프로필 사진을 업로드하세요'
                label='프로필'
                value={avatar}
                onChangeText={text => setAvatar(text)}
                style={styles.input}
                activeUnderlineColor="#2247f1"
            /> */}
            <Button mode="contained" style={styles.button} color="#2247f1" onPress={() => handleJoin(email, password)}>가입하기</Button>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 30,

    },
    button: {
        marginTop: 10,
    },
    input: {
        backgroundColor: "#fff",
        marginBottom: 10
    }
})