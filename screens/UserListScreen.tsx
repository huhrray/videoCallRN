import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { Button } from 'react-native-paper';
import ChatRoom from '../components/ChatRoom';
import auth from '@react-native-firebase/auth';

const UserListScreen = (props: { navigation: string[]; }) => {
    const [userList, setUserList] = useState<FirebaseFirestoreTypes.DocumentData[]>([]);
    const [selectedUser, setSelectedUser] = useState<{}>();

    useEffect(() => {
        //get realtime userlist
        const userRef = firestore()
            .collection('currentUsers')
            .onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                const users: FirebaseFirestoreTypes.DocumentData[] = []
                changes.forEach(change => {
                    if (change.type == 'added') {
                        change.doc.data().userUid !== auth().currentUser?.uid && setUserList([...userList, change.doc.data()])
                    } else if (change.type == 'removed') {
                        const currentUsers = userList.filter(
                            item => item !== change.doc.data().userName,
                        );
                        setUserList(currentUsers);
                    }
                });
            });
        return () => {
            userRef();
        };
    }, []);

    const renderUser = (user: FirebaseFirestoreTypes.DocumentData) => {
        return (
            <Button
                mode="contained"
                onPress={() => {
                    // setSelectedUser(user.userUid);
                    setSelectedUser(user)
                    // props.navigation.push("Chat", user.userUid)
                }}
                style={[styles.userBtn]}
                color="#D3D3D3">
                {user.userName}
            </Button>
        );
    };
    if (selectedUser) {
        return (
            <ChatRoom selectedUser={selectedUser} currentUser={auth().currentUser} />
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.title}>현재 접속 중인 유저</Text>
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
        padding: 2,
        marginHorizontal: 20,
        marginVertical: 3,
    },
});


