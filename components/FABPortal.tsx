import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { FAB, Portal, Provider } from 'react-native-paper';

const FABPortal = (isRecord: boolean, handleRecord: () => void) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Provider>
            <Portal >
                <FAB.Group
                    visible
                    open={isOpen}
                    icon={isOpen ? 'close' : 'plus'}
                    actions={[
                        {
                            icon: 'microphone',
                            label: isRecord ? "Mic on" : "Mic off",
                            color: isRecord ? '#2247f1' : 'grey',
                            onPress: () => handleRecord(),
                        }
                    ]}
                    onStateChange={() => { }}
                    onPress={() => setIsOpen(!isOpen)}
                />
            </Portal>
        </Provider>
    )
}

export default FABPortal

const styles = StyleSheet.create({})