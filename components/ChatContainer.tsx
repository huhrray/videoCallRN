import { FlatList, KeyboardAvoidingView, LogBox, Platform, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { changeTimeFormat } from '../functions/common';
import Voice from '@react-native-voice/voice';
import SystemSetting from 'react-native-system-setting';
import { setVoiceScript } from '../store/actions/userAction';
import { TextInput } from 'react-native-paper';
import 'react-native-get-random-values'
import { v4 as uuidv4 } from 'uuid';

export default function ChatContainer(roomId: string | undefined, otherUser: string | undefined) {
    const dispatch = useDispatch();
    const { currentUserName, currentUserUid, script, language } = useSelector((state: RootState) => state.userReducer);
    const [textInput, setTextInput] = useState('');
    const [message, setMessage] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
    const [text, setText] = useState<string>('');
    const [isRecord, setIsRecord] = useState<boolean>(false);
    const flatListRef = useRef<FlatList<any>>(null);
    useEffect(() => {
        //voice recognition 
        Voice.start(language);
        setIsRecord(true);
        Voice.onSpeechStart = _onSpeechStart;
        Voice.onSpeechEnd = _onSpeechEnd;
        Voice.onSpeechRecognized = _onSpeechRecognized;
        Voice.onSpeechResults = _onSpeechResults;
        Voice.onSpeechError = _onSpeechError;
        setTimeout(() => flatListRef.current?.scrollToEnd(), 300)
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
                        setMessage(prev => [...prev, data])
                    }
                });
            });

        return () => {
            subscribe();
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    // useEffect(() => {
    //     Voice.start(language);
    //     setIsRecord(true);
    // }, [Voice]);

    useEffect(() => {
        //녹음시작 종료시마다 시스템 알림음 발생, disable 불가 임시방편으로 볼륨 0으로 조정
        isRecord && SystemSetting.setVolume(0, { type: 'alarm' });
        !isRecord && Voice.isRecognizing() && Voice.destroy()
    }, [isRecord]);

    useEffect(() => {
        dispatch(setVoiceScript(script + text));
    }, [text]);

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
    const renderMessage = (msg: any) => {
        return (
            <View style={colorStyle(msg.item)}>
                <Text style={[styles.bubbleText, { color: '#D3D3D3', marginBottom: 0 }]}>{msg.item.user.name}</Text>
                <Text style={styles.bubbleText}>{msg.item.text}</Text>
            </View>
        )
    };


    return (
        <View style={styles.chatContainer}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}>
                <View style={styles.chatLogContainer}>
                    <FlatList
                        ref={flatListRef}
                        data={message}
                        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
                        renderItem={msg => renderMessage(msg)}
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
            </KeyboardAvoidingView>

        </View>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        flexDirection: 'column-reverse',
        // height: "100%",
        // alignContent: 'center',
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
});
