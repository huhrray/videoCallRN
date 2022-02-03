import { FlatList, ListRenderItem, ListRenderItemInfo, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Button } from 'react-native-paper';
interface Props {
    userName: string;
    onPress: () => void
}

export default function RoomContainer() {
    const [userList, setUserList] = useState<string[]>([])
    const [selectedUser, setSelectedUser] = useState<ListRenderItemInfo<string>>()
    //유저가 add되고 remove되는 걸 어디서 어떻게 들어올 건지 실시간으로 받아올 수 있어야함
    useEffect(() => {
        //get realtime userlist 
        const userRef = firestore().collection("currentUsers").onSnapshot((snapshot) => {
            let changes = snapshot.docChanges()
            changes.forEach(change => {
                if (change.type == "added") {
                    setUserList([...userList, change.doc.data().userId])
                } else if (change.type == "removed") {
                    const currentUsers = userList.filter(item => item !== change.doc.data().userId)
                    setUserList(currentUsers)
                }
            })
        })
    }, [])

    const renderUser = (userName: ListRenderItemInfo<string>) => {
        // const backgroundColor = props.userName === selectedUser ? "#6e3b6e" : "#f9c2ff";
        // const color = props.userName === selectedUser ? 'white' : 'black';
        return (
            <TouchableOpacity onPress={() => setSelectedUser(userName)
            } style={[styles.userBtn]}>
                <Text style={[styles.title]}>{userName}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* <FlatList
                data={userList}
                renderItem={user => renderUser(user)}
                keyExtractor={(user) => user}
            /> */}
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {

    },
    title: {

    },
    userBtn: {

    }
});
