import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { setChatRequest, setSelectedUser, setSelectedUserInfo } from '../store/actions/userAction';

const UserListScreen = (props: { navigation: any }) => {
    const [userList, setUserList] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);

    const { request, currentUserName, requestor, currentUserUid } = useSelector((state: RootState) => state.userReducer)
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
                        if (change.doc.data().userUid !== currentUserUid) {
                            users.push(change.doc.data())
                            setUserList(users)
                        }
                    } else if (change.type == 'removed') {
                        const currentUsers = userList.filter(
                            item => item !== change.doc.data().userName,
                        );
                        setUserList(currentUsers);
                    }
                });
            })

        return () => {
            userRef();
            // chatSubscribe()
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
                roomUserlist: [user.userUid, currentUserUid],// ?????? ??????????????? 
                roomUserName: [user.userName, currentUserName], // ?????? ?????? ?????? 
                roomId: room
            }
            dispatch(setSelectedUserInfo(info))
            props.navigation.push("Chat", { roomId: room, roomTitle: user.userName })
        })


    }

    const moveToCallRoom = (user: FirebaseFirestoreTypes.DocumentData) => {
        let room: string = `@call@${user.userUid}@with@${currentUserUid}`
        let exist: boolean = false

        const info = {
            targetUserUid: user.userUid,
            targetUserName: user.userName,
            roomUserlist: [user.userUid, currentUserUid],// ???????????? ??????????????? 
            roomUserName: [user.userName, currentUserName], // ???????????? ?????? ?????? 
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
    // const acceptChat = () => {
    //     dispatch(setChatRequest(false))
    //     props.navigation.push("Chat", { name: requestor })
    // }
    // const handleLeave = () => {
    //     dispatch(setChatRequest(false))
    // }
    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>?????? ?????? ?????? ??????</Text>
            <FlatList
                style={styles.listItme}
                data={userList}
                renderItem={user => renderUser(user.item)}
                keyExtractor={(item, index) => index.toString()}
            />
            {/* <Modal isVisible={request && currentUserName !== requestor} onDismiss={() => dispatch(setChatRequest(false))} >
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}>
                    <Text>{requestor}??? ???????????? ???????????????. ??????????????? ?????????????????????????</Text>
                    <Button onPress={acceptChat}>??????</Button>
                    <Button testID="Reject Call" onPress={handleLeave}>
                        ??????
                    </Button>
                </View>
            </Modal> */}
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


