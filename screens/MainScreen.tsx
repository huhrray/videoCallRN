import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'
import { Button, Divider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { setCurrentUserAuth, setCurrentUsername, setCurrentUserType, setIncomingCall, setLastSeen, setNewMsgCount } from '../store/actions/userAction';
import { RootState } from '../store';
import Modal from 'react-native-modal'
import { changeTimeFormat, firestoreDelete } from '../functions/common';
import HomeCardContainer from '../components/HomeCardContainer';
import UserInfoContainer from '../components/UserInfoContainer';
import { useDispatch, useSelector } from 'react-redux';

const MainScreen = (props: { navigation: any }) => {
    const dispatch = useDispatch();
    const { incomingCall, currentUserName, currentUserType, lastSeen } = useSelector((state: RootState) => state.userReducer);
    const [callerInfo, setCallerInfo] = useState({ roomId: '', callerName: '', callerUid: "" })
    const user = auth().currentUser
    useEffect(() => {

        //add current logged in users in firestore to see who is in
        firestore().collection("users").doc(user?.uid).get().then(doc => {
            dispatch(setCurrentUsername(doc.data()?.name))
            dispatch(setCurrentUserAuth(user?.uid))
            dispatch(setCurrentUserType(doc.data()?.type))
            firestore().collection('currentUsers').doc(user?.uid).set({
                userUid: user?.uid,
                userName: doc.data()?.name,
                userType: doc.data()?.type,
                active: true
            })
        })
        const callListener = firestore().collection('incoming').onSnapshot(snapshot =>
            snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const data = change.doc.data()
                    if (data.calleeUid === user?.uid) {
                        setCallerInfo({ roomId: data.roomId, callerName: data.callerName, callerUid: data.callerUid })
                        dispatch(setIncomingCall(true))
                    }
                }
            })
        )

        // let userRooms: string[] = []
        // listen to new msgs from rooms where the user is in
        firestore().collection('users').doc(user?.uid).get().then(data => {
            const userRooms: string[] = data.data()?.room

            if (userRooms !== undefined) {
                userRooms.forEach(room => {
                    let count = 0
                    let msgCounter: { roomId: string, count: number }[] = []
                    firestore().collection('chat').doc(room).collection('leftAt').doc(user?.uid).onSnapshot(snapshot => {
                        // if(snapshot.data())
                        if (snapshot.data() !== undefined) {
                            const lastSeenTime = snapshot.data()?.lastSeen
                            firestore().collection('chat').doc(room).collection('message').orderBy('createdAt', 'desc').onSnapshot(snapshot => {
                                snapshot.docChanges().forEach(change => {
                                    const sender = change.doc.data().user._id
                                    const msgTime = changeTimeFormat(change.doc.data().createdAt.toDate())
                                    if (sender !== user?.uid) {
                                        if (msgTime - lastSeenTime > 0) {
                                            count++
                                        }
                                    }
                                })
                                msgCounter.forEach(counter => {
                                    if (room === counter.roomId) {
                                        if (counter.count < count) {
                                            msgCounter = msgCounter.filter(counterItem => {
                                                counterItem.roomId !== room
                                            })
                                        }
                                    }

                                })
                                if (count > 0) {
                                    dispatch(setNewMsgCount([...msgCounter, { roomId: room, count: count }]))
                                    count = 0
                                }
                            })
                        }

                    })


                })
            }
        })
        return () => {
            callListener()

        }
    }, [])

    const acceptCall = () => {
        dispatch(setIncomingCall(false))
        props.navigation.navigate('Call', { roomId: callerInfo.roomId, roomTitle: callerInfo.callerName })
    }

    const handleLeave = () => {
        firestoreDelete(callerInfo.roomId)
        dispatch(setIncomingCall(false))
    }

    return (
        <ScrollView style={styles.root}>
            {UserInfoContainer(currentUserName)}
            <Divider />
            {HomeCardContainer(props.navigation)}
            <Modal isVisible={incomingCall} onDismiss={() => dispatch(setIncomingCall(false))} >
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 22,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: 4,
                        borderColor: 'rgba(0, 0, 0, 0.1)',
                    }}>
                    <Text>{`${callerInfo.callerName}이 영상통화를 요청하셨습니다`}?</Text>
                    <Button onPress={acceptCall}>수락</Button>
                    <Button testID="Reject Call" onPress={handleLeave}>
                        거절
                    </Button>
                </View>
            </Modal>
        </ScrollView>
    )
}

export default MainScreen

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    btnContent: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    btn: {
        height: 50,
        alignItems: 'stretch',
        justifyContent: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginHorizontal: 10,
    },

})