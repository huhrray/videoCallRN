import { FlatList, LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Bubble, GiftedChat, IMessage, InputToolbar, Message, Send } from 'react-native-gifted-chat';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { changeTimeFormat } from '../functions/common';
import Voice from '@react-native-voice/voice';
import SystemSetting from 'react-native-system-setting';
import { setVoiceScript } from '../store/actions/userAction';
import { IconButton, TextInput } from 'react-native-paper';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

export default function ChatScreen(props: { navigation: any; route: any }) {
    //To ignore keyboardDidHide evnerListener deprecation warning at firestore
    LogBox.ignoreAllLogs();
    const dispatch = useDispatch();
    const { currentUserName, currentUserUid, selectedUserInfo, script, language } = useSelector((state: RootState) => state.userReducer);
    const { roomId, roomTitle } = props.route.params;
    // const [userInfo, setUserInfo] = useState({
    //     _id: currentUserUid,
    //     avatar: require('../img/patient_no_img.png'),
    // });
    const [textInput, setTextInput] = useState('');
    const [message, setMessage] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
    const [text, setText] = useState<string>('');
    const [isRecord, setIsRecord] = useState<boolean>(false);

    useEffect(() => {
        // for real time update
        const subscribe = firestore()
            .collection('chat')
            .doc(roomId)
            .collection('message')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    if (change.type == 'added') {
                        let data: FirebaseFirestoreTypes.DocumentData = change.doc.data();
                        data.createdAt = data.createdAt.toDate();
                        // setMessage(prevMessage => GiftedChat.append(prevMessage, data));
                        setMessage(prev => [...prev, data])
                    }
                });
            });

        return () => {
            subscribe();
        };
    }, []);

    async function onSend(messages: IMessage[], type: string) {
        console.log(messages[0], '메세지쓰');
        // send msg to roomId collection in Firestore
        let msg = messages[0];
        if (type === 'voice') {
            Object.assign(msg, { type: 'voice' });
        } else {
            Object.assign(msg, { type: 'text' });
        }
        firestore().collection('chat').doc(roomId).collection('message').doc(changeTimeFormat()).set(msg);
    }

    function sendMsg(message: string, type: string) {
        // send msg to roomId collection in Firestore
        let msg = {
            _id: uuidv4(),
            text: message,
            createdAt: new Date(),
            type: type === 'voice' ? 'voice' : 'text',
            user: {
                _id: currentUserUid,
                name: currentUserName,
                avatar: '',
            },
        };
        setTextInput("")
        firestore().collection('chat').doc(roomId).collection('message').doc(changeTimeFormat()).set(msg);

    }

    useEffect(() => {
        Voice.onSpeechStart = _onSpeechStart;
        Voice.onSpeechEnd = _onSpeechEnd;
        Voice.onSpeechRecognized = _onSpeechRecognized;
        Voice.onSpeechResults = _onSpeechResults;
        Voice.onSpeechError = _onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        Voice.start(language);
        setIsRecord(true);
    }, [Voice]);

    useEffect(() => {
        // isRecord ? setLabel("받아쓰기 중....") : setLabel("마이크가 꺼져있습니다.")
        //녹음시작 종료시마다 시스템 알림음 발생, disable 불가 임시방편으로 볼륨 0으로 조정
        isRecord && SystemSetting.setVolume(0, { type: 'alarm' });
    }, [isRecord]);

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
        //한번 인식이 끝나면 음성인식기가 꺼지기때문에 음성인식기를 강제로 다시 켜주는 역할
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

    useEffect(() => {
        dispatch(setVoiceScript(script + text));
    }, [text]);
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
    const renderMessage = (msg: any) => {
        return (
            <View style={colorStyle(msg.item)}>
                <Text style={styles.bubbleText}>{msg.item.text}</Text>
            </View>
        )
    };

    return (
        <View style={styles.chatContainer}>
            <View style={styles.chatLogContainer}>
                <FlatList
                    data={message}
                    renderItem={msg => renderMessage(msg)}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    mode="outlined"
                    activeOutlineColor="#2247f1"
                    style={styles.inputBox}
                    value={textInput}
                    onChangeText={text => setTextInput(text)}
                    autoFocus
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
                        textInput.length > 0 &&
                        < TextInput.Icon
                            name="arrow-up-circle"
                            color="red"
                            size={30}
                            onPress={() => sendMsg(textInput, 'text')}
                        />
                    }
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
    },
    inputContainer: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 15,
        fontSize: 10

    },
    inputBox: {
        width: "100%",
    },

    chatLogContainer: {
        position: 'absolute',
        width: "100%",
        top: 0,
        // backgroundColor: 'blue',
        height: 520
    },
    myBubble: {
        alignSelf: 'flex-end',
        paddingVertical: 7,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginRight: 15,
        backgroundColor: "#C6DCF5",
        borderRadius: 10,
    },
    otherBubble: {
        alignSelf: 'flex-start',
        paddingVertical: 7,
        paddingHorizontal: 10,
        marginVertical: 5,
        marginLeft: 15,
        backgroundColor: '#FFD1D6',
        borderRadius: 10,
    },
    bubbleText: {
        color: '#292C33',
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
});
