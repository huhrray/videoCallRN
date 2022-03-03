import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { windowHeight, windowWidth } from '../functions/values';

const HomeCardContainer = (navigation: any) => {
    return (
        <View style={styles.container}>
            <View style={{ width: 20, height: 10, borderColor: 'black', borderTopWidth: 3, marginLeft: 15 }} />
            <Text style={styles.subheading}>원하시는 치료를 받아보세요</Text>
            <View style={styles.cardOuterContainer}>
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Icon name="star-four-points-outline" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>치아미백</Text>
                        </View>
                    </View>
                    <View style={styles.card} >
                        <View style={styles.cardContent} >
                            <Icon name="screw-lag" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>임플란트</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.cardContent} >
                            <Icon name="toothbrush" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>충치치료</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Icon name="needle" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>신경치료</Text>
                        </View>
                    </View>
                    <View style={styles.card}>
                        <View style={styles.cardContent}>
                            <Icon name="tooth-outline" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>치주치료</Text>
                        </View>
                    </View>
                    <View style={styles.card}  >
                        <View style={styles.cardContent}>
                            <Icon name="stethoscope" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>비대면 진료</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <View style={styles.card}  >
                        <View style={styles.cardContent}>
                            <Icon name="vector-square" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>치아교정</Text>
                        </View>
                    </View>
                    <View style={styles.card}  >
                        <View style={styles.cardContent}>
                            <Icon name="camera-iris" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>치아촬영</Text>
                        </View>
                    </View>
                    <View style={styles.card}  >
                        <View style={styles.cardContent}>
                            <Icon name="text-box-multiple-outline" color="#2247f1" size={40} />
                            <Text style={styles.cardText}>진료기록</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default HomeCardContainer

const styles = StyleSheet.create({
    container: {
        width: windowWidth,
        height: windowHeight * 0.9,
        // flexDirection: 'column',
    },
    subheading: {
        fontWeight: "bold",
        fontSize: 18,
        marginHorizontal: 15
    },
    card: {
        width: windowWidth * 0.3,
        height: windowHeight * 0.2,
        // marginHorizontal: 5,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: "center",
        elevation: 10,
        backgroundColor: '#fff',
        borderRadius: 10
    },
    cardContent: {
        alignItems: 'center',
        justifyContent: "center",
    },
    cardText: {
        fontSize: 15
    },
    cardContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    cardOuterContainer: {
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 15
    }
})