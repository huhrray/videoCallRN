import { Image, PermissionsAndroid, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import firestore from '@react-native-firebase/firestore';
import { Switch } from 'react-native-paper';
import { camOptions, libOptions, windowHeight, windowWidth } from '../functions/values';
import { setUserStatus } from '../store/actions/userAction';
import { Asset, launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { firebase } from '@react-native-firebase/storage';

const MyPageScreen = () => {
    const dispatch = useDispatch();
    const [status, setStatus] = useState(false)
    const { currentUserName, currentUserType, currentUserUid, userStatus } = useSelector((state: RootState) => state.userReducer);
    const [imgUrl, setImgUrl] = useState<string | undefined>('')
    const [bigImg, setBigImg] = useState(false)

    useEffect(() => {
        firestore().collection("currentUsers").doc(currentUserUid).get().then(doc => {
            doc.data()?.active && setStatus(true)
        })

        firestore().collection('users').doc(currentUserUid).onSnapshot(snapshot => {
            const userData = snapshot.data()
            firebase.storage().ref(userData!.profile).getDownloadURL().then(photoUrl => {
                setImgUrl(photoUrl)
            })
        })
    }, [])


    const uploadPhoto = async (asset: Asset) => {
        // setImgUri(asset.uri)
        firestore().collection('users').doc(currentUserUid).update({ profile: asset.fileName })
        await firebase.storage().ref(asset.fileName).putFile(asset.uri!).then((snapshot) => {
            console.log("photo uploaded")
        }).catch((e) => console.log('uploading image error => ', e));
    }

    const handleStatusSwitch = () => {
        // setStatus(!status)
        dispatch(setUserStatus(!userStatus))
        firestore().collection('currentUsers').doc(currentUserUid).update({ active: !userStatus })
    }
    const selectPhoto = async () => {
        await launchImageLibrary(libOptions, res => {
            if (res.assets) {
                // setImgUri(res.assets[0].uri)
                uploadPhoto(res.assets[0])

            }
        });
    }
    const takePhoto = async () => {
        try {
            const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (isGranted) {
                launchCamera(camOptions, res => {
                    if (res.assets) {
                        // setImgUri(res.assets[0].uri)
                        uploadPhoto(res.assets[0])
                    }
                })
            } else {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera permission given");
                    launchCamera(camOptions, res => {
                        if (res.assets) {
                            // setImgUri(res.assets[0].uri)
                            uploadPhoto(res.assets[0])
                        }
                    });
                }
            }

        } catch (err) {
            console.warn(err);
        }
    }
    if (bigImg) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <Image style={{ width: windowWidth * 0.9, height: windowHeight * 0.8 }} source={imgUrl === '' ? require('../img/patient_no_img.png') : { uri: imgUrl }} />
                <Icon name='times' size={30} color='red' onPress={() => setBigImg(false)} />
            </View>
        )
    }
    return (
        <ScrollView style={styles.container}>
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
                    <Image style={styles.profileImg} source={imgUrl === '' ? require('../img/patient_no_img.png') : { uri: imgUrl }} />
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
            <View style={styles.textBox}><Text style={styles.textBoxHeader}>이름</Text><Text style={styles.textBoxText}>{currentUserName}</Text></View>
            <View style={styles.textBox}><Text style={styles.textBoxHeader}>멤버 유형</Text><Text style={styles.textBoxText}>{currentUserType === "doctor" ? "환자" : "의사"}</Text></View>
            <View style={styles.textBox}>
                <Text style={styles.textBoxHeader}>비대면 진료 설정</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.textBoxText} >Off</Text>
                    <Switch value={userStatus} onValueChange={() => handleStatusSwitch()} color="#2747f1" />
                    <Text style={styles.textBoxText}>On</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default MyPageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20

    },
    textBox: {
        height: windowHeight * 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textBoxHeader: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textBoxText: {
        fontSize: 15,
    },
    pContainer: {
        height: windowHeight * 0.3,
        alignItems: 'center',
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
        height: 55
    },
    plusIcon: {
        position: 'absolute',
        top: windowHeight * 0.15,
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
        top: windowHeight * 0.15,
        left: windowWidth * 0.3,
        backgroundColor: "#fff",
        borderColor: '#2247f1',
        borderWidth: 2,
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: 'center'
    },

})