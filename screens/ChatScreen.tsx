import { LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bubble, GiftedChat, IMessage, InputToolbar, Message, Send, SendProps } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function ChatScreen() {
    //To ignore keyboardDidHide evnerListener deprecation warning at firestore 
    LogBox.ignoreLogs(['EventEmitter.removeListener'])
    const [userId, setUserId] = useState("")
    const [userInfo, setUserInfo] = useState({ _id: userId, avatar: require("../img/patient_no_img.png") })
    const [message, setMessage] = useState([])
    useEffect(() => {
        getUser()
        // for real time update
        const subscribe = firestore().collection('chatId').onSnapshot((snapshot) => {
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

    async function getUser() {
        let userLocal = await AsyncStorage.getItem("userId")
        if (userLocal) setUserId(userLocal)
    }
    function onSend(messages: IMessage[]) {
        // for storing in Firestore
        firestore().collection('chatId').doc(Date.now().toString()).set(messages[0])
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
                renderInputToolbar={props => customtInputToolbar(props)}
                renderBubble={props => customtBubble(props)}
                renderTime={() => null}
                renderUsernameOnMessage={true}
                renderMessage={props => customtMessage(props)}
                onSend={(messages) => onSend(messages)}
                renderAvatar={() => null}
                renderSend={props => customSendBtn(props)}
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
