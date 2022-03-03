import { FlatList, Image, PermissionsAndroid, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { changeTimeFormat } from '../functions/common';
import Voice from '@react-native-voice/voice';
import SystemSetting from 'react-native-system-setting';
import { setNewMsgCount, setVoiceScript } from '../store/actions/userAction';
import { Button, Modal, TextInput } from 'react-native-paper';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { firebase } from '@react-native-firebase/storage';
import { camOptions, libOptions } from '../functions/values';

export default function ChatContainer(roomId: string | undefined, otherUser: string | undefined) {
    const dispatch = useDispatch();
    const { currentUserName, currentUserUid, script, language, newMsgCount, selectedUserInfo } = useSelector((state: RootState) => state.userReducer);
    const [textInput, setTextInput] = useState('');
    const [message, setMessage] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
    const [text, setText] = useState<string>('');
    const [isRecord, setIsRecord] = useState<boolean>(false);
    const flatListRef = useRef<FlatList<any>>(null);
    //loader before the chatmsg logs render
    const [isLoading, setIsLoading] = useState(true)
    //open a small tab on plus icon
    const [tab, setTab] = useState(false)
    const [isPhotoLoading, setIsPhotoLoading] = useState(false)
    useEffect(() => {
        console.log(roomId, '룸아이딩')
        //voice recognition 
        setIsRecord(true);
        Voice.onSpeechStart = _onSpeechStart;
        Voice.onSpeechEnd = _onSpeechEnd;
        Voice.onSpeechRecognized = _onSpeechRecognized;
        Voice.onSpeechResults = _onSpeechResults;
        Voice.onSpeechError = _onSpeechError;
        setTimeout(() => flatListRef.current?.scrollToEnd(), 300)
        // for real time update
        setTimeout(() => flatListRef.current?.scrollToEnd(), 300)
        // for real time update
        const subscribe = firestore().collection('chat').doc(roomId).collection('message').onSnapshot(snapshot => {
            snapshot.docChanges().forEach(async change => {
                if (change.type == 'added') {
                    let data: FirebaseFirestoreTypes.DocumentData = change.doc.data();
                    const newData = await dataSetting(data)
                    !isPhotoLoading && setMessage(prev => [...prev, newData])
                    setIsLoading(false)
                }
            });
        });
        // is it neccessary?? when room list is updated in sendMsg
        //Add current roomId to user's chat room list if it's no already in 
        firestore().collection('users').doc(currentUserUid).get().then((doc) => {
            const roomArr: string[] = doc.data()?.room
            if (roomArr === undefined) {
                firestore().collection('users').doc(currentUserUid).update({ room: [roomId] })
            } else {
                if (roomArr.length > 0) {
                    if (roomArr.indexOf(roomId!) < 0) {
                        let newArr = [...roomArr, roomId]
                        firestore().collection('users').doc(currentUserUid).update({ room: newArr })
                    }
                } else {
                    firestore().collection('users').doc(currentUserUid).update({ room: [roomId] })
                }
            }

        })

        return () => {
            subscribe();
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        Voice.start(language)
        setIsRecord(true);
    }, [Voice]);

    useEffect(() => {
        //녹음시작 종료시마다 시스템 알림음 발생, disable 불가 임시방편으로 볼륨 0으로 조정
        const rec = Voice.isRecognizing().then(res => {
            return res ? true : false
        })

        isRecord && SystemSetting.setVolume(0, { type: 'alarm' });
        !isRecord && !rec && Voice.destroy()
    }, [isRecord]);

    useEffect(() => {
        dispatch(setVoiceScript(script + text));
    }, [text]);

    //to load images from firestore
    const dataSetting = async (data: FirebaseFirestoreTypes.DocumentData) => {
        data.createdAt = data.createdAt.toDate();
        if (data.type === 'image') {
            setIsPhotoLoading(true)
            firebase.storage().ref(data.text).getDownloadURL().then(photoUrl => {
                data.text = photoUrl
                setIsPhotoLoading(false)
            })

        }
        return data
    }
    //set when the user left the chat room 
    function setLeftTime() {
        firestore().collection('chat').doc(roomId).collection('leftAt').doc(currentUserUid).get().then((doc) => {
            if (doc.data()) {
                firestore().collection('chat').doc(roomId).collection('leftAt').doc(currentUserUid).set({ lastSeen: changeTimeFormat() })
            } else {
                firestore().collection('chat').doc(roomId).collection('leftAt').doc(currentUserUid).set({ lastSeen: changeTimeFormat() })
            }
        })
        const newCounter = newMsgCount.filter((counter: { roomId: string; count: number }) => {
            counter.roomId !== roomId
        });
        dispatch(setNewMsgCount(newCounter))

    }

    async function sendMsg(message: string | undefined, type: string, imgUri?: string) {
        // send msg to roomId collection in Firestore
        let msgType
        if (type === 'voice') {
            msgType = 'voice'
        } else if (type === 'image') {
            msgType = 'image'
            await firebase.storage().ref(imgUri).putFile(message!).then((snapshot) => {
            }).catch((e) => console.log('uploading image error => ', e));
        } else if (type === "system") {
            msgType = 'system'
        } else {
            msgType = 'text'
        }
        let msg = {
            _id: uuidv4(),
            text: type === 'image' ? imgUri : message,
            createdAt: new Date(),
            type: msgType,
            user: {
                _id: currentUserUid,
                name: currentUserName,
                avatar: '',
            },
        };
        setTextInput("")
        firestore().collection('chat').doc(roomId).collection('message').doc(changeTimeFormat()).set(msg);

        firestore().collection('users').doc(selectedUserInfo.targetUserUid).get().then((doc) => {
            const roomArr: string[] = doc.data()?.room
            if (roomArr === undefined) {
                firestore().collection('users').doc(selectedUserInfo.targetUserUid).update({ room: [roomId] })
            } else {
                if (roomArr.length > 0) {
                    if (roomArr.indexOf(roomId!) < 0) {
                        let newArr = [...roomArr, roomId]
                        firestore().collection('users').doc(selectedUserInfo.targetUserUid).update({ room: newArr })
                    }
                } else {
                    firestore().collection('users').doc(selectedUserInfo.targetUserUid).update({ room: [roomId] })
                }
            }

        })
        firestore().collection('chat').doc(roomId).collection('leftAt').doc(selectedUserInfo.targetUserUid).get().then(data => {
            if (!data.exists) {
                firestore().collection('chat').doc(roomId).collection('leftAt').doc(selectedUserInfo.targetUserUid).set({ lastSeen: 0 })
            }
        })

    }

    // send photos to the chat 
    const selectPhoto = async () => {
        await launchImageLibrary(libOptions, res => {
            if (res.assets) {
                sendMsg(res.assets[0].uri, 'image', res.assets[0].fileName)
                setTab(false)
            }
        });
    }
    const takePhoto = async () => {
        try {

            const isGrantedCamera = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            const isGrantedWrite = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

            if (isGrantedCamera && isGrantedWrite) {
                launchCamera(camOptions, res => {
                    if (res.assets) {
                        sendMsg(res.assets[0].uri, 'image', res.assets[0].fileName)
                        setTab(false)
                    } else if (res.errorCode) {
                        console.log(res.errorCode)
                    }
                })
            } else {
                // camera & write permission requests
                const grantedCam = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                const grantedWrite = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
                if ((grantedCam && grantedWrite) === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera permission given");
                    launchCamera(camOptions, res => {
                        if (res.assets) {
                            console.log(res.assets[0])
                            sendMsg(res.assets[0].uri, 'image', res.assets[0].fileName)
                            setTab(false)
                        }
                    });
                }
            }

        } catch (err) {
            console.warn(err);
        }
    }


    const handleRecord = () => {
        isRecord ? Voice.destroy() : Voice.start(language);
        setIsRecord(!isRecord);
    };

    const _onSpeechStart = () => {
        console.log('녹음시작');
    };
    const _onSpeechEnd = () => {
        console.log('onSpeechEnd');
    };
    const _onSpeechRecognized = () => {
        console.log('onSpeechRecognized');
    };
    const _onSpeechResults = (event: any) => {
        console.log('onSpeechResults', event.value);
        // setText(event.value[0]);
        console.log('여기서 script????????', script);
        setText(event.value[0]);
        sendMsg(event.value[0], 'voice')
        //force the listener starts again when it finishes recognition
        Voice.isRecognizing().then(event => {
            // console.log("다시 킬까봐", event)
            !event && Voice.start(language);
        });
    };

    const _onSpeechError = async (event: any) => {
        console.log('_onSpeechError');
        console.log(event.error);
        if (event.error.message === '7/No match') {
            await Voice.start(language);
            return;
        } else if (event.error.message === '8/RecognitionService busy') {
            await Voice.destroy().then(() => Voice.start(language));
        }
    };

    const colorStyle = (item: any) => {
        if (item.user._id === currentUserUid) {
            if (item.type === 'voice') {
                return [styles.myBubble, { backgroundColor: '#687494' }]
            } else {
                return styles.myBubble
            }
        } else {
            if (item.type === 'voice') {
                return [styles.otherBubble, { backgroundColor: '#948359' }]
            } else {
                return styles.otherBubble
            }
        }
    }
    // const renderMessage = (msg: any) => {
    //     if (msg.item.type === 'image') {
    //         return (
    //             <View style={colorStyle(msg.item)}>
    //                 <Image style={{ width: 100, height: 100 }} source={{ uri: msg.item.text }} />
    //             </View>)
    //     } else {
    //         return (
    //             <View style={colorStyle(msg.item)}>
    //                 <Text style={styles.bubbleText}>{msg.item.text}</Text>
    //             </View>
    //         )
    //     }
    // };


    return (
        <View style={styles.chatContainer}>
            <View style={styles.chatLogContainer}>
                <FlatList
                    ref={flatListRef}
                    data={message}
                    onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                    renderItem={msg =>
                        msg.item.type === 'image' ?
                            <View style={colorStyle(msg.item)}>
                                <Image style={{ width: 100, height: 100 }} source={{ uri: msg.item.text }} />
                            </View>
                            :
                            <View style={colorStyle(msg.item)}>
                                <Text style={styles.bubbleText}>{msg.item.text}</Text>
                            </View>}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={{ marginTop: 5 }}>
                <TextInput
                    mode="outlined"
                    outlineColor="#2247f1"
                    activeOutlineColor='#2247f1'
                    style={styles.inputBox}
                    value={textInput}
                    onChangeText={text => setTextInput(text)}
                    theme={{ roundness: 30 }}
                    left={
                        <TextInput.Icon
                            name="microphone"
                            color={isRecord ? '#2247f1' : 'grey'}
                            size={30}
                            onPress={handleRecord}
                        />
                    }
                    right={
                        textInput.length > 0 ?
                            < TextInput.Icon
                                name="arrow-up-circle"
                                color="red"
                                size={30}
                                onPress={() => sendMsg(textInput, 'text')}
                            /> : < TextInput.Icon
                                name="plus"
                                color="#2247f1"
                                size={30}
                                onPress={() => setTab(true)}
                            />
                    }
                />
                <Modal
                    visible={tab}
                    onDismiss={() => setTab(false)}
                    contentContainerStyle={styles.modal}>
                    <Button onPress={() => selectPhoto()}>앨범에서 고르기</Button>
                    <Button onPress={() => takePhoto()}>사진 찍기</Button>
                </Modal>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1
    },
    chatLogContainer: {
        width: "100%",
        height: 200,
        backgroundColor: "rgba(115, 115, 115, 0.43)"
    },
    inputBox: {
        width: "100%",
        height: 40,
        paddingTop: 5
    },
    myBubble: {
        alignSelf: 'flex-start',
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginLeft: 5,
        borderRadius: 10,
    },
    otherBubble: {
        alignSelf: 'flex-start',
        paddingVertical: 2,
        paddingHorizontal: 10,
        marginLeft: 5,
        borderRadius: 10,
    },
    bubbleText: {
        color: '#fff',
        fontSize: 15
    },
    messageUsername: {
        fontSize: 10,
        color: '#D3D3D3',
    },
    sendingContainer: {
        marginRight: 10,
    },
    btn: {
        position: 'absolute',
        top: 10,
        right: 170,
    },
    hideInput: {
        display: 'none',
    },
    modal: {
        backgroundColor: '#fff'
    },
});
