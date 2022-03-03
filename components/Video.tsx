import { View, StyleSheet, KeyboardAvoidingView } from "react-native";
import React from "react";
import { MediaStream, RTCView } from "react-native-webrtc";
import Button from "./Button";
import ChatContainer from "./ChatContainer";
interface Props {
    hangup: () => void;
    localStream?: MediaStream | null;
    remoteStream?: MediaStream | null;
    style?: boolean;
    roomId?: string;
    roomTitle?: string
}
function ButtonContainer(props: Props) {
    return (
        <View style={styles.bContainer}>
            <Button iconName="phone-slash" backgroundColor="red" onPress={props.hangup} style={styles.btn} />
        </View>
    );
}
export default function Video(props: Props) {

    // before the connection starts 
    if (props.localStream && !props.remoteStream) {
        return (
            <View style={styles.container}>
                <RTCView
                    streamURL={props.localStream.toURL()}
                    objectFit={"cover"}
                    style={styles.video}
                />
                <ButtonContainer hangup={props.hangup} />
            </View>
        );
    }
    //once the call is connected, local on top of remote
    if (props.localStream && props.remoteStream) {
        return (
            <View style={styles.container}>
                <RTCView
                    streamURL={props.remoteStream.toURL()}
                    objectFit={"cover"}
                    style={styles.video}
                />

                <ButtonContainer hangup={props.hangup} />
                <KeyboardAvoidingView style={styles.cContainer}>
                    {ChatContainer(props.roomId, props.roomTitle)}
                    <RTCView
                        streamURL={props.localStream.toURL()}
                        objectFit={"cover"}
                        style={styles.videoLocal}
                    />
                </KeyboardAvoidingView>
            </View>
        );
    }
    return <ButtonContainer hangup={props.hangup} />;
}
const styles = StyleSheet.create({
    bContainer: {
        flexDirection: "row",
        bottom: 30,
        zIndex: 1
    },
    container: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center",
    },
    video: {
        position: "absolute",
        width: "100%",
        height: "100%",
    },
    videoLocal: {
        position: "absolute",
        width: 120,
        height: 170,
        bottom: 70,
        right: 20,
        zIndex: 1,
        elevation: 10,
    },
    cContainer: {
        position: "absolute",
        // bottom: 20,
        width: "100%",
        // paddingHorizontal: 10,
    },
    callEndBtnContainer: {
        flexDirection: "row",
        bottom: 30,
    },
    btn: {
        width: 60,
        height: 60
    }
});
