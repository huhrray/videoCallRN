import { ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import auth from '@react-native-firebase/auth'
import { Dialog, Divider, Portal, Provider } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { setCurrentUserAuth, setCurrentUsername, setCurrentUserType, setGettingCall, setIncomingCall, setNewMsgCount, setUserStatus } from '../store/actions/userAction';
import { RootState } from '../store';
import { changeTimeFormat, firestoreDelete } from '../functions/common';
import HomeCardContainer from '../components/HomeCardContainer';
import UserInfoContainer from '../components/UserInfoContainer';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../components/Button';
import Modal from 'react-native-modal'

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
        dispatch(setGettingCall(true))
        dispatch(setIncomingCall(false))
        props.navigation.navigate('Call', { roomId: callerInfo.roomId, roomTitle: callerInfo.callerName })
    }

    const handleLeave = () => {
        firestoreDelete(callerInfo.roomId)
        dispatch(setIncomingCall(false))
        dispatch(setUserStatus(true))
        firestore().collection('currentUsers').doc(user?.uid).update({ active: true })
    }

    return (
        <ScrollView style={styles.root}>
            {UserInfoContainer(currentUserName)}
            <Divider />
            {HomeCardContainer(props.navigation)}
            <Modal isVisible={incomingCall} onDismiss={() => dispatch(setIncomingCall(false))} style={styles.modal}>
                <Text style={{ fontSize: 15 }}>{`${callerInfo.callerName}님의  비대면 진료 요청`}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Button
                        iconName="phone-slash"
                        backgroundColor="red"
                        onPress={handleLeave}
                        style={styles.diagloBtn}
                    />
                    <Button
                        iconName="phone"
                        backgroundColor="green"
                        onPress={acceptCall}
                        style={styles.diagloBtn}
                    />
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
    diagloBtn: {
        marginHorizontal: 5,
        width: 50,
        height: 50,
    },
    modal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        padding: 10,
        borderRadius: 10,
        left: 0,
        right: 0,
        top: 0,
        backgroundColor: '#fff'
    }

})