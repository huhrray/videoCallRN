import { StyleProp, StyleSheet, Text, View, ViewProps, ViewStyle } from 'react-native';
import React, { useState } from 'react';
import auth from '@react-native-firebase/auth'
import { Avatar, Button, Card, Divider, List, Paragraph, Snackbar, Subheading, Surface, Title } from 'react-native-paper';
import { $DeepPartial } from '@callstack/react-theme-provider';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import LogoutButton from '../components/LogoutButton';

const HomeScreen = (props: { navigation: string[]; }) => {
    const user = auth().currentUser
    if (user === null) {
        props.navigation.push("Login")
    }
    return (
        <View style={styles.root}>
            <View style={styles.aContainer}>
                <Card style={styles.patientCardContainer}>
                    <Card.Content style={styles.patientCard}>
                        <Text style={{ color: "red", position: "absolute", left: 60, fontWeight: "bold", fontSize: 25 }}>L1</Text>
                        <Icon name="circle-slice-1" color="red" size={100} />
                        <View style={styles.patientCardText}>
                            <Paragraph style={styles.userInfo} >
                                <Text style={{ fontWeight: "bold" }}>{user?.email}</Text>님의 검진결과 구강위험 <Text style={{ color: "red", fontWeight: "bold" }}> Level 1</Text> 입니다.
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
            <Divider />
            <View style={styles.bContainer}>
                <Text style={styles.subheading}>원하시는 치료를 받아보세요</Text>
                <View style={styles.cardContainer}>
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
                            <Icon name="star-four-points-outline" color="#2247f1" size={35} />
                            <Text>치아미백</Text>
                        </Card.Content>
                    </Card>
                    <Card style={styles.card}>
                        <Card.Content style={styles.cardContent}>
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
                    <Card style={styles.card} onPress={() => props.navigation.push('List')} >
                        <Card.Content style={styles.cardContent}>
                            <Icon name="stethoscope" color="#2247f1" size={35} />
                            <Text>비대면 진료</Text>
                        </Card.Content>
                    </Card>
                </View>
            </View>
            {LogoutButton(props.navigation)}

        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    root: {
        flex: 1
    },
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
    cardContainer: {
        flexDirection: 'row',
    },
    userInfo: {
        fontSize: 16.5
    },
    btnContent: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
    },
    btn: {
        height: 50,
        alignItems: 'stretch',
        justifyContent: 'center',
        fontSize: 18,
        marginBottom: 10,
        marginHorizontal: 10,
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
    }
});
