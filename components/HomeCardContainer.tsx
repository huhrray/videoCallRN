import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Card } from 'react-native-paper'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeCardContainer = (navigation: any) => {
    return (
        <View style={styles.bContainer}>
            <Text style={styles.subheading}>원하시는 치료를 받아보세요</Text>
            <View style={styles.cardContainer}>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Icon name="star-four-points-outline" color="#2247f1" size={35} />
                        <Text>치아미백</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.card} >
                    <Card.Content style={styles.cardContent} >
                        <Icon name="screw-lag" color="#2247f1" size={35} />
                        <Text>임플란트</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent} >
                        <Icon name="toothbrush" color="#2247f1" size={35} />
                        <Text>충치치료</Text>
                    </Card.Content>
                </Card>
            </View>
            <View style={styles.cardContainer}>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Icon name="needle" color="#2247f1" size={35} />
                        <Text>신경치료</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.card}>
                    <Card.Content style={styles.cardContent}>
                        <Icon name="tooth-outline" color="#2247f1" size={35} />
                        <Text>치주치료</Text>
                    </Card.Content>
                </Card>
                <Card style={styles.card}  >
                    <Card.Content style={styles.cardContent}>
                        <Icon name="stethoscope" color="#2247f1" size={35} />
                        <Text>비대면 진료</Text>
                    </Card.Content>
                </Card>
            </View>
        </View>
    )
}

export default HomeCardContainer

const styles = StyleSheet.create({
    bContainer: {
        width: "100%",
        height: 350,
        justifyContent: "center",
        alignItems: "center"
    },
    subheading: {
        fontWeight: "bold",
        fontSize: 20
    },
    card: {
        width: 110,
        height: 140,
        marginHorizontal: 5,
        marginVertical: 5,
        alignItems: 'center',
        justifyContent: "center",
        elevation: 4,
    },
    cardContent: {
        top: 20,
        alignItems: 'center',
        justifyContent: "center",
    },
    cardContainer: {
        flexDirection: 'row',
    },
})