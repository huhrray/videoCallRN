import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Card, Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const UserInfoContainer = (currentUserName: string) => {

    return (
        <View style={styles.aContainer}>
            <Card style={styles.patientCardContainer}>
                <Card.Content style={styles.patientCard}>
                    <Text style={{ color: "red", position: "absolute", left: 60, fontWeight: "bold", fontSize: 25 }}>L1</Text>
                    <Icon name="circle-slice-1" color="red" size={100} />
                    <View style={styles.patientCardText}>
                        <Paragraph style={styles.userInfo} >
                            <Text style={{ fontWeight: "bold" }}>{currentUserName}</Text>님의 검진결과 구강위험 <Text style={{ color: "red", fontWeight: "bold" }}> Level 1</Text> 입니다.
                        </Paragraph>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center" }}>
                                <Icon name="tooth-outline" color="black" size={10} />
                                <Text> 충치 2</Text>
                            </View>
                            <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center" }}>
                                <Icon name="tooth" color="black" size={10} />
                                <Text> 발치 1</Text>
                            </View>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        </View>
    )
}

export default UserInfoContainer

const styles = StyleSheet.create({
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
    userInfo: {
        fontSize: 16.5
    },

})