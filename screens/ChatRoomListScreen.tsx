import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { setNewMsgCount, setSelectedUserInfo } from '../store/actions/userAction';
import { Badge } from 'react-native-paper';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


const Stack = createNativeStackNavigator();

const ChatRoomListScreen = (props: { navigation: any }) => {
    const [userList, setUserList] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

    const { currentUserName, currentUserUid, newMsgCount } = useSelector((state: RootState) => state.userReducer)
    const dispatch = useDispatch()
    useEffect(() => {
        let firstData: { userUid: string, userName: string, roomId: string, lastMsg: string }[] = []
        //get realtime userlist
        const userRef = firestore()
            .collection('users')
            .doc(currentUserUid)
            .onSnapshot(snapshot => {
                const list: string[] = snapshot.data()?.room
                if (list.length > 0) {
                    list.forEach(item => {
                        const regexMake = /@make@/gi
                        const regexWith = /@with@/gi
                        const otherUserUid = item.replace(regexMake, '').replace(regexWith, '').replace(currentUserUid, '').trim()
                        firestore().collection('chat').doc(item).collection('message').orderBy('createdAt', 'desc').limit(1).onSnapshot(snapshot => {
                            snapshot.docChanges().forEach(change => {
                                if (change.type === 'added') {
                                    const lastText = change.doc.data().text
                                    console.log("왜 여기오냐 ㅠ ")
                                    firestore().collection('users').doc(otherUserUid).get().then(data => {
                                        const otherUserName = data.data()?.name
                                        // when new msg comes remove the exisitng data to replace to a new one
                                        firstData.forEach(dataItem => {
                                            if (dataItem.roomId === item && dataItem.lastMsg !== lastText) {
                                                firstData = firstData.filter(ele => ele.roomId !== item && dataItem.lastMsg !== lastText)
                                            }
                                        })
                                        firstData = [...firstData, { userUid: otherUserUid, userName: otherUserName, roomId: item, lastMsg: lastText }]

                                        // setUserList(prev => [...prev, { userUid: otherUserUid, userName: otherUserName, roomId: item, lastMsg: lastText }])
                                    }).then(() => {
                                        console.log("좀 기다려봐 ㅠ")
                                        setUserList(firstData)
                                    })
                                }
                            })
                        })
                    });

                }
            })
        return () => {
            userRef()
        };
    }, []);

    const moveToChatRoom = (user: FirebaseFirestoreTypes.DocumentData) => {
        const info = {
            targetUserUid: user.userUid,
            targetUserName: user.userName,
            roomUserlist: [user.userUid, currentUserUid],// 챗방 유저리스트 
            roomUserName: [user.userName, currentUserName], // 챗방 유저 이름 
            roomId: user.roomId
        }

        dispatch(setNewMsgCount({ roomId: user.roomId, count: 0 }))
        dispatch(setSelectedUserInfo(info))
        props.navigation.push("Chat", { roomId: user.roomId, roomTitle: user.userName, otherUserUid: user.userUid })

    }
    const badgeCounter = (roomId: string) => {
        let count: number = 0
        newMsgCount.forEach((counter: { count: number; roomId: string; }) => {
            if (counter.count > 0 && roomId === counter.roomId) {
                count = counter.count
            }
        })
        return count
    }

    const renderUser = (user: FirebaseFirestoreTypes.DocumentData) => {
        return (
            <TouchableOpacity
                style={styles.btnView}

                onPress={() => moveToChatRoom(user)}>
                <View style={styles.btnTextView}>
                    <Text style={{
                        fontSize: 15, marginBottom: 5, color: 'black',
                    }}>{user.userName}</Text>
                    <Text style={{ fontSize: 12 }}>{user.lastMsg}</Text>
                </View>
                {badgeCounter(user.roomId) > 0 && <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
                    <Badge style={{ backgroundColor: 'red' }}>
                        {badgeCounter(user.roomId)}
                    </Badge>
                </View>
                }
            </TouchableOpacity>
        );
    };
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                // style={styles.listItem}
                data={userList}
                renderItem={user => renderUser(user.item)}
                keyExtractor={(item, index) => index.toString()}
            />
        </SafeAreaView>
    );
};

export default ChatRoomListScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
    },
    listItem: {
        width: '100%',
    },
    btnView: {
        width: "100%",
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#d3d3d3',
        borderWidth: 0.7
    },
    btnTextView: {
        marginHorizontal: 10,
        flexDirection: 'column'
    }

});


