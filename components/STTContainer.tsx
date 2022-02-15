import { LogBox, View, Text, Button } from 'react-native';
import React, { useEffect, useState } from 'react';
import Voice from '@react-native-voice/voice';
import SystemSetting from 'react-native-system-setting'
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setVoiceScript } from '../store/actions/userAction';

export const STTContainer = () => {
    LogBox.ignoreLogs(['EventEmitter.removeListener'])
    LogBox.ignoreAllLogs();
    const { script, language } = useSelector((state: RootState) => state.userReducer)
    const dispatch = useDispatch()
    const [text, setText] = useState<string>('');
    const [pText, setPtext] = useState<string>('');
    const [isRecord, setIsRecord] = useState<boolean>(false)
    const [label, setLabel] = useState("마이크가 꺼져있습니다.")

    useEffect(() => {
        Voice.onSpeechStart = _onSpeechStart;
        Voice.onSpeechEnd = _onSpeechEnd;
        Voice.onSpeechRecognized = _onSpeechRecognized
        Voice.onSpeechResults = _onSpeechResults;
        Voice.onSpeechPartialResults = _onSpeechPartialResults;
        Voice.onSpeechError = _onSpeechError;

        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
        };
    }, []);

    useEffect(() => {
        Voice.start(language)
        setIsRecord(true)

    }, [Voice])

    useEffect(() => {
        isRecord ? setLabel("받아쓰기 중....") : setLabel("마이크가 꺼져있습니다.")

        //녹음시작 종료시마다 시스템 알림음 발생, disable 불가 임시방편으로 볼륨 0으로 조정 
        isRecord && SystemSetting.setVolume(0, { type: 'alarm' });
    }, [isRecord])

    const handleRecord = () => {
        isRecord ? Voice.destroy() : Voice.start(language)
        setIsRecord(!isRecord)
    }

    const _onSpeechStart = () => {
        console.log('녹음시작');
    };
    const _onSpeechEnd = () => {
        console.log('onSpeechEnd');

    };
    const _onSpeechRecognized = () => {
        console.log('onSpeechRecognized');
    };
    const _onSpeechResults = (event: any) => {
        console.log('onSpeechResults', event.value);
        // setText(event.value[0]);
        console.log("여기서 script????????", script)
        setText(event.value[0])
        //한번 인식이 끝나면 음성인식기가 꺼지기때문에 음성인식기를 강제로 다시 켜주는 역할
        Voice.isRecognizing().then((event) => {
            // console.log("다시 킬까봐", event)
            !event && Voice.start(language)
        })
    };

    const _onSpeechPartialResults = (event: any) => {
        console.log('onSpeechPartialResults', event.value);
        // event.value[0].length > 0 && setPtext(event.value[0]);
    };

    const _onSpeechError = async (event: any) => {
        console.log('_onSpeechError');
        console.log(event.error);
        if (event.error.message === '7/No match') {
            await Voice.start(language);
            return;
        } else if (event.error.message === "8/RecognitionService busy") {
            await Voice.destroy().then(() => Voice.start(language))
        }
    };
    useEffect(() => {
        dispatch(setVoiceScript(script + text))
    }, [text])



    return (
        <View>
            <Text>{label}</Text>
            <Text style={{ fontSize: 20 }}>{script}</Text>
            <Button title={isRecord ? "off" : "on"} onPress={handleRecord}></Button>
        </View>
    );
};

