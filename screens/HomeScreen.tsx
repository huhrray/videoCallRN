import { LogBox, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useReducer, useState } from 'react';
import auth from '@react-native-firebase/auth'
import { Button, Card, Divider, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LogoutButton from '../components/LogoutButton';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentUserAuth, setCurrentUsername, setIncomingCall } from '../store/actions/userAction';
import { RootState } from '../store';
import Modal from 'react-native-modal'
import { firestoreDelete } from '../functions/common';

const HomeScreen = (props: { navigation: any }) => {
    LogBox.ignoreAllLogs()
    const dispatch = useDispatch();
    const { incomingCall, currentUserName } = useSelector((state: RootState) => state.userReducer);
    // const [name, setName] = useState("")
    const [callerInfo, setCallerInfo] = useState({ roomId: '', callerName: '', callerUid: "" })
    const user = auth().currentUser
    if (user === null) {
        props.navigation.push("Login")
    }
    useEffect(() => {
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
        return () => {
            callListener()
        }
    }, [])

    useEffect(() => {
        //get username with the user uid from auth 
        firestore().collection("users").doc(user?.uid).get().then(doc => {
            // setName(doc.data()?.name)
            dispatch(setCurrentUsername(doc.data()?.name))
        })

        dispatch(setCurrentUserAuth(user?.uid))
    }, [user])

    useEffect(() => {
        if (currentUserName !== "") {
            //add current logged in users in firestore to see who is in
            firestore().collection('currentUsers').doc(user?.uid).set({
                userUid: user?.uid,
                userName: currentUserName
            })
        }
    }, [currentUserName])

    const acceptCall = () => {
        dispatch(setIncomingCall(false))
        props.navigation.push('Call', { roomId: callerInfo.roomId, roomTitle: callerInfo.callerName })
    }

    const handleLeave = () => {
        firestoreDelete(callerInfo.roomId)
        dispatch(setIncomingCall(false))
    }

    return (
        <ScrollView style={styles.root}>
            <View style={styles.aContainer}>
                <Card style={styles.patientCardContainer}>
                    <Card.Content style={styles.patientCard}>
                        <Text style={{ color: "red", position: "absolute", left: 60, fontWeight: "bold", fontSize: 25 }}>L1</Text>
                        <Icon name="circle-slice-1" color="red" size={100} />
                        <View style={styles.patientCardText}>
                            <Paragraph style={styles.userInfo} >
                                <Text style={{ fontWeight: "bold" }}>{currentUserName}</Text>?????? ???????????? ???????????? <Text style={{ color: "red", fontWeight: "bold" }}> Level 1</Text> ?????????.
                            </Paragraph>
                            <View style={{ flexDirection: "row", alignItems: "center" }}>
                                <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center" }}>
                                    <Icon name="tooth-outline" color="black" size={10} />
                                    <Text> ?????? 2</Text>
                                </View>
                                <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center" }}>
                                    <Icon name="tooth" color="black" size={10} />
                                    <Text> ?????? 1</Text>
                                </View>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            </View>
            <Divider />
            <View style={styles.bContainer}>
                <Text style={styles.subheading}>???????????? ????????? ???????????????</Text>
                <View style={styles.cardContainer}>
                    <Card style={styles.card} onPress={() => props.navigation.push('STT')}>
                        <Card.Content style={styles.cardContent}>
                            <Icon name="star-four-points-outline" color="#2247f1" size={35} />
                            <Text>????????????</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card} onPress={() => props.navigation.push('Chat2')}>
                        <Card.Content style={styles.cardContent} >
                            <Icon name="screw-lag" color="#2247f1" size={35} />
                            <Text>????????????</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent} >
                            <Icon name="toothbrush" color="#2247f1" size={35} />
                            <Text>????????????</Text>
                        </Card.Content>
                    </Card>
                </View>
                <View style={styles.cardContainer}>
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Icon name="needle" color="#2247f1" size={35} />
                            <Text>????????????</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Icon name="tooth-outline" color="#2247f1" size={35} />
                            <Text>????????????</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card} onPress={() => props.navigation.push('List')} >
                        <Card.Content style={styles.cardContent}>
                            <Icon name="stethoscope" color="#2247f1" size={35} />
                            <Text>????????? ??????</Text>
                        </Card.Content>
                    </Card>
                </View>
            </View>
            <LogoutButton />
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
                    <Text>{`${callerInfo.callerName}??? ??????????????? ?????????????????????`}?</Text>
                    <Button onPress={acceptCall}>??????</Button>
                    <Button testID="Reject Call" onPress={handleLeave}>
                        ??????
                    </Button>
                </View>
            </Modal>

        </ScrollView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
    aContainer: {
        height: 150,
        justifyContent: "center",
        marginHorizontal: 30,
        marginVertical: 10
    },
    patientCardContainer: {
        overflow: 'hidden',
        elevation: 4,
    },
    patientCard: {
        height: 140,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center"
    },
    patientCardText: {
        width: "58%",
        textAlign: "justify",
        fontSize: 16,
    },
    toothConditionText: {
        fontSize: 13,
    },
    bContainer: {
        width: "100%",
        height: 350,
        justifyContent: "center",
        alignItems: "center"
    },
    subheading: {
        fontWeight: "bold",
        fontSize: 20
    },
    cardContainer: {
        flexDirection: 'row',
    },
    userInfo: {
        fontSize: 16.5
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
    card: {
        width: 110,
        height: 140,
        marginHorizontal: 5,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: "center",
        elevation: 4,
    },
    cardContent: {
        top: 20,
        alignItems: 'center',
        justifyContent: "center",
    }
});
