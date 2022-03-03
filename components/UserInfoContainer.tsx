import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Paragraph } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { windowHeight, windowWidth } from '../functions/values';
// import CircularProgress from 'react-native-circular-progress-indicator';
const UserInfoContainer = (currentUserName: string) => {

    return (
        <View style={styles.container}>
            <View style={styles.textContainer}>
                <Icon name="alert-circle" size={15} color="red" />
                <Text style={styles.textAlert}><Text style={{ fontWeight: 'bold' }}> 미루면 늦습니다!</Text> 지금 바로 검진결과를 확인하세요</Text>
            </View>
            <View style={styles.patientCardContainer}>
                <View style={styles.patientCard}>
                    <Text style={{ color: "red", position: "absolute", left: 60, fontWeight: "bold", fontSize: 25 }}>L1</Text>
                    {/* <CircularProgress value={1}
                        maxValue={4}
                        valuePrefix={'L'}
                        inActiveStrokeColor={'red'}
                        inActiveStrokeOpacity={0.2} /> */}
                    <Icon name="circle-slice-1" color="red" size={100} />
                    <View style={styles.patientCardText}>
                        <Paragraph style={styles.userInfo} >
                            <Text style={{ fontWeight: "bold" }}>{currentUserName}</Text>님의 검진결과 {"\n"}구강위험 <Text style={{ color: "red", fontWeight: "bold" }}> Level 1</Text> 입니다.
                        </Paragraph>
                        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 10 }}>
                            <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center", }}>
                                <Icon name="tooth" color="white" size={10} style={{ backgroundColor: '#D3D3D3', padding: 5, borderRadius: 50 }} />
                                <Text> 충치 2</Text>
                            </View>
                            <View style={{ marginRight: 10, flexDirection: "row", alignItems: "center" }}>
                                <Icon name="tooth" color="white" size={10} style={{ backgroundColor: '#D3D3D3', padding: 5, borderRadius: 50 }} />
                                <Text> 발치 1</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default UserInfoContainer

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight * 0.3,
    },
    textContainer: {
        height: windowHeight * 0.05,
        flexDirection: 'row',
        alignItems: 'center',
        fontSize: 12,
        marginVertical: 10,
        marginHorizontal: 15
    },
    textAlert: {
        color: 'red'
    },
    patientCardContainer: {
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: '#fff',
        elevation: 10,
        marginHorizontal: 15
    },
    patientCard: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",

    },
    patientCardText: {
        width: "58%",
        fontSize: 16,
    },
    toothConditionText: {
        fontSize: 13,
    },
    userInfo: {
        fontSize: 16.5
    },

})