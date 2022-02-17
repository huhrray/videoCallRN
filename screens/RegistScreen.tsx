import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Avatar, Button, TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { PermissionsAndroid } from 'react-native';
import { camOptions, libOptions, windowHeight, windowWidth } from '../functions/values';

export default function RegisterScreen(props: { navigation: string[] }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imgUri, setImgUri] = useState<string | undefined>('')
    const [bigImg, setBigImg] = useState(false)


    const selectPhoto = async () => {
        await launchImageLibrary(libOptions, res => {
            if (res.assets) {
                setImgUri(res.assets[0].uri)
            }
        });
    }
    const takePhoto = async () => {
        try {
            const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (isGranted) {
                launchCamera(camOptions, res => {
                    if (res.assets) {
                        setImgUri(res.assets[0].uri)
                    }
                })
            } else {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera permission given");
                    launchCamera(camOptions, res => {
                        if (res.assets) {
                            setImgUri(res.assets[0].uri)
                        }
                    });
                }
            }

        } catch (err) {
            console.warn(err);
        }
    }


    const handleJoin = async (email: string, password: string) => {
        try {
            let cred = await auth()
                .createUserWithEmailAndPassword(email, password)
            if (cred) {
                firestore().collection('users').doc(cred.user.uid).set({
                    name: name,
                    profile: imgUri
                })
                setName('');
                setEmail('');
                setPassword('');
                setImgUri('')
                //모달 띄우거나 알림으로 완료 알림
                // props.navigation.push('Home')
            };
        } catch (e: any) {
            if (e.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (e.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }
            console.error(e);
        }
    };
    if (bigImg) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <Image style={{ width: windowWidth * 0.9, height: windowHeight * 0.8 }} source={imgUri === '' ? require('../img/patient_no_img.png') : { uri: imgUri }} />
                <Icon name='times' size={30} color='red' onPress={() => setBigImg(false)} />
            </View>
        )
    }
    return (
        <View style={styles.container}>
            <View style={styles.pContainer}>
                <TouchableOpacity
                    style={styles.plusIcon}
                    onPress={() => selectPhoto()}>
                    <Icon
                        name="plus"
                        color="#2247f1"
                        size={18}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setBigImg(true) }}>
                    <Image style={styles.profileImg} source={imgUri === '' ? require('../img/patient_no_img.png') : { uri: imgUri }} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cameraIcon}
                    onPress={() => takePhoto()}>
                    <Icon
                        name="camera"
                        color="#2247f1"
                        size={18}
                    />
                </TouchableOpacity>
            </View>
            <TextInput
                placeholder="이름을 입력하세요"
                label="이름"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
                activeUnderlineColor="#2247f1"
            />
            <TextInput
                placeholder="이메일 주소를 입력하세요"
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                activeUnderlineColor="#2247f1"
            />
            <TextInput
                placeholder="비밀번호를 입력하세요"
                label="비밀번호"
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
            <Button
                mode="contained"
                style={styles.button}
                color="#2247f1"
                onPress={() => handleJoin(email, password)}>
                가입하기
            </Button>
        </View>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 30,
    },
    pContainer: {
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    profileImg: {
        borderColor: "#2247f1",
        borderWidth: 2,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    button: {
        marginTop: 10,
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 10,
    },
    plusIcon: {
        position: 'absolute',
        top: windowHeight * 0.1,
        right: windowWidth * 0.3,
        zIndex: 1,
        backgroundColor: "#fff",
        borderColor: '#2247f1',
        borderWidth: 2,
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: 'center'
    },
    cameraIcon: {
        position: 'absolute',
        top: windowHeight * 0.1,
        left: windowWidth * 0.3,
        backgroundColor: "#fff",
        borderColor: '#2247f1',
        borderWidth: 2,
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: 'center'
    }

});
