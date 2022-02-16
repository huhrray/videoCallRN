import { FirebaseAuthTypes } from "@react-native-firebase/auth";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import ChatScreen from "../screens/ChatScreen";
import ChatContainer from "./ChatContainer";

interface Props {
    selectedUser: FirebaseFirestoreTypes.DocumentData,
    currentUser: FirebaseAuthTypes.User | null
}

export default function ChatRoom(props: Props) {
    return (
        // <ChatScreen selectedUser={props.selectedUser} currentUser={props.currentUser} />
        <></>
    );
}
const styles = StyleSheet.create({
    root: {
        backgroundColor: "black"
    }
})