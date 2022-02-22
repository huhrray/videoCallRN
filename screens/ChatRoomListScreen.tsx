import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUserInfo } from '../store/actions/userAction';
import { Badge } from 'react-native-paper';

const ChatRoomListScreen = (props: { navigation: any }) => {
    const [userList, setUserList] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

    const { currentUserName, currentUserUid, newMsgCount } = useSelector((state: RootState) => state.userReducer)
    const dispatch = useDispatch()
    useEffect(() => {
        //get realtime userlist
        const userRef = firestore()
            .collection('users')
            .doc(currentUserUid)
            .get().then(data => {
                const list: string[] = data.data()?.room
                if (list.length > 0) {
                    list.forEach(item => {
                        const regexMake = /@make@/gi
                        const regexWith = /@with@/gi
                        const otherUserUid = item.replace(regexMake, '').replace(regexWith, '').replace(currentUserUid, '').trim()
                        firestore().collection('chat').doc(item).collection('message').orderBy('createdAt', 'desc').limit(1).get().then(docs => {
                            const lastText = docs.docs[0].data().text
                            firestore().collection('users').doc(otherUserUid).get().then(data => {
                                const otherUserName = data.data()?.name
                                setUserList(prev => [...prev, { userUid: otherUserUid, userName: otherUserName, roomId: item, lastMsg: lastText }])
                            })
                        })

                    });

                }
            })

        return () => {
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
        dispatch(setSelectedUserInfo(info))
        props.navigation.push("Chat", { roomId: user.roomId, roomTitle: user.userName })

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
                <View style={{ marginHorizontal: 10, justifyContent: 'center' }}>
                    {newMsgCount.count > 0 && user.roomId === newMsgCount.roomId &&
                        <Badge style={{ backgroundColor: 'red' }}>
                            {newMsgCount.count}
                        </Badge>
                    }
                </View>
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


