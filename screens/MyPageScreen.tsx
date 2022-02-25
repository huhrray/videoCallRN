import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Switch } from 'react-native-paper';
import { windowHeight, windowWidth } from '../functions/values';

const MyPageScreen = () => {
    // const dispatch = useDispatch();
    const [status, setStatus] = useState(false)
    const { currentUserName, currentUserType, currentUserUid } = useSelector((state: RootState) => state.userReducer);
    useEffect(() => {
        firestore().collection("currentUsers").doc(currentUserUid).get().then(doc => {
            doc.data()?.active && setStatus(true)


        })
    }, [])

    const handleStatusSwitch = () => {
        setStatus(!status)
        firestore().collection('currentUsers').doc(currentUserUid).update({ active: !status })
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.textBox}><Text style={styles.textBoxHeader}>이름</Text><Text style={styles.textBoxText}>{currentUserName}</Text></View>
            <View style={styles.textBox}><Text style={styles.textBoxHeader}>멤버 유형</Text><Text style={styles.textBoxText}>{currentUserType === "doctor" ? "환자" : "의사"}</Text></View>
            <View style={styles.textBox}>
                <Text style={styles.textBoxHeader}>비대면 진료 설정</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.textBoxText} >Off</Text>
                    <Switch value={status} onValueChange={() => handleStatusSwitch()} color="#2747f1" />
                    <Text style={styles.textBoxText}>On</Text>
                </View>
            </View>
        </ScrollView>
    )
}

export default MyPageScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 20

    },
    textBox: {
        height: windowHeight * 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    textBoxHeader: {
        fontSize: 18,
        fontWeight: 'bold'
    },
    textBoxText: {
        fontSize: 15,
    }

})