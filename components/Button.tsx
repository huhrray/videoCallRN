import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Icon from "react-native-vector-icons/FontAwesome5";

interface Props {
    onPress?: any;
    iconName: string;
    backgroundColor: string;
    style: any;
    iconSize?: number
}
export default function Button(props: Props) {
    return (
        <View>
            <TouchableOpacity
                onPress={props.onPress}
                style={[
                    { backgroundColor: props.backgroundColor },
                    props.style,
                    styles.button,

                ]}
            >
                <Icon name={props.iconName} color="white" size={props.iconSize ? props.iconSize : 20} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        // width: 60,
        // height: 60,
        padding: 10,
        elevation: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 100,
    },
});
