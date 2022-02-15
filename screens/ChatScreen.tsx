import { LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bubble, GiftedChat, IMessage, InputToolbar, Message, Send, SendProps } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import auth from '@react-native-firebase/auth'
import { changeTimeFormat } from '../functions/common';

export default function ChatScreen(props: { navigation: any; route: any }) {
    //To ignore keyboardDidHide evnerListener deprecation warning at firestore 
    const { roomId, roomTitle } = props.route.params
    LogBox.ignoreLogs(['EventEmitter.removeListener'])
    const { currentUserUid, selectedUser } = useSelector((state: RootState) => state.userReducer)
    const dispatch = useDispatch()
    const [userInfo, setUserInfo] = useState({ _id: currentUserUid, avatar: require("../img/patient_no_img.png") })
    const [message, setMessage] = useState([])
    useEffect(() => {
        // for real time update
        console.log(roomId)
        const subscribe = firestore().collection('chat').doc(roomId).collection("message").onSnapshot(snapshot => {
            snapshot.docChanges().forEach((change) => {
                if (change.type == "added") {
                    let data: any = change.doc.data()
                    data.createdAt = data.createdAt.toDate()
                    setMessage((prevMessage) => GiftedChat.append(prevMessage, data))
                }
            })
        })

        return () => {
            subscribe();
        }
    }, [])

    function onSend(messages: IMessage[]) {
        // send msg to roomId collection in Firestore
        // firestore().collection('chat').doc(selectedUser.userUid).collection('message').doc().collection('room').doc(Date.now().toString()).set(messages[0])
        firestore().collection('chat').doc(roomId).collection("message").doc(changeTimeFormat()).set(messages[0])
    }


    const customtInputToolbar = (props: any) => {
        return (
            <InputToolbar
                {...props}
                containerStyle={{
                    backgroundColor: "white",
                    borderTopColor: "#E8E8E8",
                    borderTopWidth: 1,
                    borderRadius: 10,
                    justifyContent: "center"
                }}
                placeholder={"댓글 추가..."}
                alwaysShowSend={true}
            />
        );
    };
    const customtMessage = (props: any) => {
        return (
            <Message
                {...props}
                wrapperStyle={{
                    backgroundColor: "white",
                    borderTopColor: "#E8E8E8",
                    borderTopWidth: 1,
                    borderRadius: 10,
                }}

            />
        );
    };
    function customSendBtn(props: any) {
        return (
            <Send {...props}>
                <View style={styles.sendingContainer}>
                    <Icon name="arrow-circle-up" size={30} color="red" />
                </View>
            </Send>
        );
    }
    const customtBubble = (props: any) => {
        return (
            <View
                style={styles.bubble}
            >
                {/* <Text style={styles.messageUsername}>{userId}</Text> */}
                <Bubble
                    {...props}
                    wrapperStyle={{
                        right: {
                            backgroundColor: "transparent",
                        },
                        left: {
                            backgroundColor: "transparent",
                        }
                    }}
                    textStyle={{
                        right: {
                            color: 'white',
                            fontFamily: "CerebriSans-Book",
                        },
                        left: {
                            color: 'white',
                            fontFamily: "CerebriSans-Book",
                            textAlign: "left"

                        },
                    }}
                    style={styles.bubbleAll}
                />

            </View>
        );
    };

    return (
        <View style={styles.chatContainer}>
            <GiftedChat messages={message}
                // renderInputToolbar={props => customtInputToolbar(props)}
                // renderBubble={props => customtBubble(props)}
                renderTime={() => null}
                renderUsernameOnMessage={true}
                // renderMessage={props => customtMessage(props)}
                onSend={(messages) => onSend(messages)}
                renderAvatar={() => null}
                // renderSend={props => customSendBtn(props)}
                user={userInfo}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        flex: 1,
        backgroundColor: "black",

    },
    bubble: {

    },
    bubbleAll: {
        // backgroundColor: "blue"
    },
    messageUsername: {
        fontSize: 10,
        color: "#D3D3D3",
    },
    sendingContainer: {
        marginRight: 10

    }
});
