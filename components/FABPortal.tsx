import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { FAB, Portal, Provider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setIsChat, setIsRecord } from '../store/actions/userAction';

interface Props {
    screen: string;
    hangup?: () => void
}

export const FabPortal = ({ screen, hangup }: Props) => {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch()
    const { isChat, isRecord } = useSelector((state: RootState) => state.userReducer);


    const callIconArr = [
        {
            icon: isRecord ? 'microphone-off' : 'microphone',
            label: isRecord ? "Mic on" : "Mic off",
            color: isRecord ? '#2247f1' : 'grey',
            onPress: () => dispatch(setIsRecord(!isRecord)),
        },
        {
            icon: 'chat-outline',
            label: 'Chat',
            color: isChat ? '#2247f1' : 'grey',
            onPress: () => dispatch(setIsChat(!isChat)),
        },
        {
            icon: 'phone-off',
            label: 'Close',
            color: isChat ? '#2247f1' : 'grey',
            onPress: () => dispatch(setIsChat(!isChat)),
        },
    ]
    const chatIconArr = [
        {
            icon: isRecord ? 'microphone-off' : 'microphone',
            label: isRecord ? "Mic on" : "Mic off",
            color: isRecord ? '#2247f1' : 'grey',
            onPress: () => dispatch(setIsRecord(!isRecord)),
        },
        {
            icon: 'video-outline',
            label: 'video',
            color: 'grey',
            onPress: () => { },
            //영상통화 이동 
        },
    ]
    return (
        <Provider>
            <Portal>
                <FAB.Group
                    visible
                    open={isOpen}
                    icon={isOpen ? 'close' : 'plus'}
                    actions={
                        chatIconArr
                    }
                    style={styles.fab}
                    theme={{ colors: { accent: 'red' } }}
                    onStateChange={() => { }}
                    onPress={() => setIsOpen(!isOpen)}
                />
            </Portal>
        </Provider>
    )
}


const styles = StyleSheet.create({
    fab: {
        // position: 'absolute',
        width: '100',
        backgroundColor: 'red',

    }
})