import React, { useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Text, FlatList, ListRenderItemInfo, ScrollView } from 'react-native';
import { Avatar, Button, Checkbox, RadioButton, Snackbar, TextInput } from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { PermissionsAndroid } from 'react-native';
import { camOptions, libOptions, windowHeight, windowWidth } from '../functions/values';
import DatePicker from 'react-native-date-picker'

export default function RegisterScreen(props: { navigation: any; route: any }) {
    //snack bar
    const [visible, setVisible] = useState(false);
    // registration form
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [imgUri, setImgUri] = useState<string | undefined>('')
    const [bigImg, setBigImg] = useState(false)
    const [gender, setGender] = useState('M')
    const [date, setDate] = useState(new Date())
    //date picker modal
    const [open, setOpen] = useState(false)
    //field checkbox
    const clinicField = [{ name: '치아미백', checked: false }, { name: '임플란트', checked: false }, { name: '신경치료', checked: false }, { name: '치주치료', checked: false }, { name: '치아교정', checked: false }, { name: '충치치료', checked: false }, { name: '사랑니', checked: false }, { name: '양악', checked: false }]
    const [field, setField] = useState(clinicField)
    const [selectedField, setSelectedField] = useState("")

    const formatDate = (date: Date) => {
        const month = date.getMonth() + 1
        return `${date.getFullYear().toString()}년 ${month.toString()}월 ${date.getDay().toString()}일`
    }

    const selectPhoto = async () => {
        await launchImageLibrary(libOptions, res => {
            if (res.assets) {
                setImgUri(res.assets[0].uri)
            }
        });
    }
    const takePhoto = async () => {
        try {
            const isGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
            if (isGranted) {
                launchCamera(camOptions, res => {
                    if (res.assets) {
                        setImgUri(res.assets[0].uri)
                    }
                })
            } else {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);

                if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                    console.log("Camera permission given");
                    launchCamera(camOptions, res => {
                        if (res.assets) {
                            setImgUri(res.assets[0].uri)
                        }
                    });
                }
            }

        } catch (err) {
            console.warn(err);
        }
    }
    const renderTypes = (item: ListRenderItemInfo<{
        name: string;
        checked: boolean;
    }>) => {
        // 중복선택??
        item.item.checked && setSelectedField(item.item.name)
        return (
            <Checkbox.Item
                onPress={() => setCheckBox(item.item.name)}
                label={item.item.name}
                position='leading'
                labelStyle={styles.listItemText}
                status={item.item.checked ? 'checked' : 'unchecked'}
                color="#2247f1"
                uncheckedColor='grey'
                style={styles.listItem} />
        )

    }
    const setCheckBox = (name: string) => {
        let newType: {
            name: string;
            checked: boolean;
        }[] = []
        field.forEach(item => {
            item.checked = item.name === name && !item.checked
            newType.push(item)
        })

        setField(newType)
    }

    const handleJoin = async (email: string, password: string) => {
        try {
            let cred = await auth()
                .createUserWithEmailAndPassword(email, password)
            if (cred) {
                firestore().collection('users').doc(cred.user.uid).set({
                    name: name,
                    profile: imgUri,
                    birth: date,
                    gender: gender,
                    type: props.route.params.type === 'doctor' ? 'doctor' : 'patient',
                    room: [],
                    field: selectedField
                })
                setName('');
                setEmail('');
                setPassword('');
                setImgUri('');
                setGender("M");
                setField(clinicField)
                setDate(new Date())
            };
            setVisible(true)
            setTimeout(() => {
                setVisible(false)
                props.navigation.push("Login")
            }, 2000)

        } catch (e: any) {
            if (e.code === 'auth/email-already-in-use') {
                console.log('That email address is already in use!');
            }

            if (e.code === 'auth/invalid-email') {
                console.log('That email address is invalid!');
            }
            console.error(e);
        }
    };
    if (bigImg) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
                <Image style={{ width: windowWidth * 0.9, height: windowHeight * 0.8 }} source={imgUri === '' ? require('../img/patient_no_img.png') : { uri: imgUri }} />
                <Icon name='times' size={30} color='red' onPress={() => setBigImg(false)} />
            </View>
        )
    }
    return (
        <ScrollView style={styles.container}>
            <View style={styles.pContainer}>
                <TouchableOpacity
                    style={styles.plusIcon}
                    onPress={() => selectPhoto()}>
                    <Icon
                        name="plus"
                        color="#2247f1"
                        size={18}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setBigImg(true) }}>
                    <Image style={styles.profileImg} source={imgUri === '' ? require('../img/patient_no_img.png') : { uri: imgUri }} />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cameraIcon}
                    onPress={() => takePhoto()}>
                    <Icon
                        name="camera"
                        color="#2247f1"
                        size={18}
                    />
                </TouchableOpacity>
            </View>
            <TextInput
                placeholder="이름을 입력하세요"
                label="이름"
                value={name}
                onChangeText={text => setName(text)}
                style={styles.input}
                activeUnderlineColor="#2247f1"
            />
            <TextInput
                placeholder="이메일 주소를 입력하세요"
                label="Email"
                value={email}
                onChangeText={text => setEmail(text)}
                style={styles.input}
                activeUnderlineColor="#2247f1"
            />
            <TextInput
                placeholder="비밀번호를 입력하세요"
                label="비밀번호"
                value={password}
                onChangeText={text => setPassword(text)}
                secureTextEntry
                style={styles.input}
                activeUnderlineColor="#2247f1"
            />
            <RadioButton.Group onValueChange={value => setGender(value)} value={gender}>
                <View style={styles.inputView}>
                    <Text style={{ fontSize: 16, marginLeft: 10 }}>성별</Text>
                    <View style={styles.radioBtnContainer}>
                        <RadioButton.Item label="남성" value="M" color="#2247f1" uncheckedColor='grey' style={styles.radioBtnItem} />
                        <RadioButton.Item label="여성" value="F" color="#2247f1" uncheckedColor='grey' style={styles.radioBtnItem} />
                    </View>
                </View>
            </RadioButton.Group>
            <View style={[styles.inputView, { height: 55 }]}>
                <Text style={{ fontSize: 16, marginLeft: 10 }}>생년월일</Text>
                <TouchableOpacity onPress={() => setOpen(true)}><Text style={{ fontSize: 18, letterSpacing: 2, marginRight: 5, color: "black" }}>{formatDate(date)}</Text></TouchableOpacity>
                <DatePicker
                    modal
                    mode="date"
                    open={open}
                    date={date}
                    onConfirm={(date) => {
                        setOpen(false)
                        setDate(date)
                    }}
                    onCancel={() => {
                        setOpen(false)
                    }}
                />
            </View>
            {props.route.params.type === 'doctor' &&
                <View style={styles.inputView}>
                    <FlatList
                        key={'listItem'}
                        ListHeaderComponent={<Text style={{ fontSize: 16, marginLeft: 10 }}>전문 치료 분야</Text>}
                        data={field}
                        renderItem={item => renderTypes(item)}
                        keyExtractor={(item) => item.name}
                        numColumns={3}
                        style={{
                            width: '100%',
                            borderBottomWidth: 1,
                            borderBottomColor: '#C5C5C5'
                        }}
                    />
                </View>
            }
            <Button
                mode="contained"
                style={styles.button}
                color="#2247f1"
                onPress={() => handleJoin(email, password)}>
                가입하기
            </Button>
            <Snackbar
                visible={visible}
                onDismiss={() => setVisible(false)}>
                회원가입이 완료되었습니다. 홈 화면으로 이동합니다.
            </Snackbar>
        </ScrollView>
    );
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 30,
    },
    pContainer: {
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'center'
    },

    profileImg: {
        borderColor: "#2247f1",
        borderWidth: 2,
        width: 100,
        height: 100,
        borderRadius: 50
    },
    button: {
        marginTop: 10,
    },
    input: {
        backgroundColor: '#fff',
        marginBottom: 10,
        height: 55
    },
    plusIcon: {
        position: 'absolute',
        top: windowHeight * 0.1,
        right: windowWidth * 0.3,
        zIndex: 1,
        backgroundColor: "#fff",
        borderColor: '#2247f1',
        borderWidth: 2,
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: 'center'
    },
    cameraIcon: {
        position: 'absolute',
        top: windowHeight * 0.1,
        left: windowWidth * 0.3,
        backgroundColor: "#fff",
        borderColor: '#2247f1',
        borderWidth: 2,
        width: 30,
        height: 30,
        borderRadius: 50,
        justifyContent: "center",
        alignItems: 'center'
    },
    inputView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#C5C5C5',
        borderBottomWidth: 1,
        marginBottom: 10,
    },
    radioBtnItem: {
        flexDirection: 'row-reverse',
    },
    radioBtnContainer: {
        width: '50%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginRight: 10
    },
    listItem: {
        width: windowWidth / 3.5,
    },
    listItemText: {
        fontSize: 13,
        textAlign: 'left',
    },
    listItemContainer: {
        overflow: 'scroll'
    }

});
