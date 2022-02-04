import { FlatList, SafeAreaView, StyleSheet, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import { Button } from 'react-native-paper';
interface Props {
    userName: string;
    onPress: () => void;
}

export default function RoomContainer() {
    const [userList, setUserList] = useState<string[]>([]);
    const [selectedUser, setSelectedUser] = useState<{}>();
    //유저가 add되고 remove되는 걸 어디서 어떻게 들어올 건지 실시간으로 받아올 수 있어야함
    useEffect(() => {
        //get realtime userlist
        const userRef = firestore()
            .collection('currentUsers')
            .onSnapshot(snapshot => {
                let changes = snapshot.docChanges();
                const users: string[] = []
                changes.forEach(change => {
                    if (change.type == 'added') {
                        users.push(change.doc.data().userName)
                        setUserList(users);
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

    const renderUser = (user: {}) => {
        return (
            <Button
                mode="contained"
                onPress={() => {
                    setSelectedUser(user);
                }}
                style={[styles.userBtn]}
                color="#D3D3D3">
                {user}
            </Button>
        );
    };

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
}

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
