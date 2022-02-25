import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedUserInfo } from '../store/actions/userAction';

const UserListScreen = (props: { navigation: any }) => {
    const [userList, setUserList] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

    const { currentUserName, currentUserUid, currentUserType } = useSelector((state: RootState) => state.userReducer)
    const dispatch = useDispatch()
    useEffect(() => {
        //get realtime userlist
        const userRef = firestore()
            .collection('currentUsers')
            .onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                const users: FirebaseFirestoreTypes.DocumentData[] = []
                changes.forEach(change => {
                    if (change.type == 'added') {
                        if (currentUserType === 'doctor') {
                            if (change.doc.data().userUid !== currentUserUid && change.doc.data().userType === 'patient') {
                                users.push(change.doc.data())
                                setUserList(users)
                            }
                        } else {
                            if (change.doc.data().userUid !== currentUserUid && change.doc.data().userType === 'doctor') {
                                users.push(change.doc.data())
                                setUserList(users)
                            }
                        }

                    } else if (change.type == 'removed') {
                        const currentUsers = userList.filter(
                            item => item !== change.doc.data().userName
                        );
                        setUserList(currentUsers);
                    } else if (change.type == 'modified') {
                        // listen to user active status
                        if (change.doc.data().active) {
                            users.push(change.doc.data())
                            setUserList(users)
                        } else {
                            setUserList(users.filter(user => {
                                user.userUid !== change.doc.data().userUid
                            }))
                        }
                    }
                });
            })

        return () => {
            //to update actively 
            userRef();
        };
    }, []);


    const moveToChatRoom = (user: FirebaseFirestoreTypes.DocumentData) => {
        let room: string
        let exist: boolean = false
        firestore().collection('chat').doc(`@make@${user.userUid}@with@${currentUserUid}`).collection('message').get().then(doc => {
            doc.forEach(data => {
                if (data.exists) {
                    exist = true
                }
            })
        }).then(() => {
            if (exist) {
                room = `@make@${user.userUid}@with@${currentUserUid}`
            } else {
                room = `@make@${currentUserUid}@with@${user.userUid}`
            }

            const info = {
                targetUserUid: user.userUid,
                targetUserName: user.userName,
                roomUserlist: [user.userUid, currentUserUid],// 챗방 유저리스트 
                roomUserName: [user.userName, currentUserName], // 챗방 유저 이름 
                roomId: room
            }
            dispatch(setSelectedUserInfo(info))
            props.navigation.push("Chat", { roomId: room, roomTitle: user.userName, otherUserUid: user.userUid })
        })


    }

    const moveToCallRoom = (user: FirebaseFirestoreTypes.DocumentData) => {
        let room: string = `@make@${user.userUid}@with@${currentUserUid}`
        const info = {
            targetUserUid: user.userUid,
            targetUserName: user.userName,
            roomUserlist: [user.userUid, currentUserUid],// 영상챗방 유저리스트 
            roomUserName: [user.userName, currentUserName], // 영상챗방 유저 이름 
            roomId: room
        }
        dispatch(setSelectedUserInfo(info))
        props.navigation.push("Call", { roomId: room, roomTitle: user.userName })
    }


    const renderUser = (user: FirebaseFirestoreTypes.DocumentData) => {
        return (
            <View style={styles.userBtn}>
                <Text style={styles.userName}>{user.userName}</Text>
                <Icon
                    name="comments"
                    onPress={() => moveToChatRoom(user)}
                    color="green"
                    style={styles.Btn}
                    size={20}
                />
                <Icon
                    name="video"
                    onPress={() => moveToCallRoom(user)}
                    color="red"
                    style={styles.Btn}
                    size={20}
                />
            </View>

        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>{currentUserType === 'doctor' ? '진료 대기 중인 환자' : '현재 통화 가능 한 비대면 진료 전문의'}</Text>
            <FlatList
                style={styles.listItme}
                data={userList}
                renderItem={user => renderUser(user.item)}
                keyExtractor={(item, index) => index.toString()}
            />

        </SafeAreaView>
    );
};

export default UserListScreen;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 15
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        margin: 10,
    },
    listItme: {
        width: '100%',
    },
    userBtn: {
        width: "100%",
        height: 60,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        elevation: 3,
        marginVertical: 5,
    },
    userName: {
        marginHorizontal: 70,
        fontSize: 20,
        fontWeight: "bold"
    },
    Btn: {
        marginHorizontal: 20,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,

    },
    modal: {
        backgroundColor: 'white',
        padding: 22,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
        borderColor: 'rgba(0, 0, 0, 0.1)',
    }

});


