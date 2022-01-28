import { LogBox, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Bubble, GiftedChat, IMessage, InputToolbar, Send } from 'react-native-gifted-chat';
import firestore from '@react-native-firebase/firestore'
import Icon from 'react-native-vector-icons/FontAwesome5';

export default function ChatContainer(message: any[] | undefined) {
    //To ignore keyboardDidHide evnerListener deprecation warning at firestore 
    LogBox.ignoreLogs(['EventEmitter.removeListener'])
    const [userId, setUserId] = useState("")
    // const [message, setMessage] = useState([])
    useEffect(() => {
        getUser()
        // for real time update
        // const subscribe = firestore().collection('chatId').onSnapshot((snapshot) => {
        //     snapshot.docChanges().forEach((change) => {
        //         if (change.type == "added") {
        //             let data: any = change.doc.data()
        //             data.createdAt = data.createdAt.toDate()
        //             setMessage((prevMessage) => GiftedChat.append(prevMessage, data))
        //         }
        //     })
        // })
        // return () => {
        //     subscribe();
        // }

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
            <View>
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
                            fontSize: 15,
                            fontFamily: "CerebriSans-Book"
                        },
                        left: {
                            color: 'white',
                            fontSize: 15,
                            fontFamily: "CerebriSans-Book"
                        },
                    }}
                />
                <Text style={styles.messageUsername}>{userId}</Text>
            </View>
        );
    };


    return (
        <View style={styles.chatContainer}>
            <GiftedChat
                renderAvatar={() => null}
                renderInputToolbar={props => customtInputToolbar(props)}
                renderBubble={props => customtBubble(props)}
                renderTime={() => null}
                renderSend={props => customSendBtn(props)}
                messages={message}
                onSend={(messages) => onSend(messages)}
                user={{ _id: userId, name: userId }} />
        </View>
    );
}

const styles = StyleSheet.create({
    chatContainer: {
        backgroundColor: 'transparent',
        height: 300,
    },
    messageTime: {

    },
    messageUsername: {
        fontSize: 9,
        color: "white"

    },
    sendingContainer: {
        marginRight: 10

    }
});
