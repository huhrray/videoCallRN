import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';

/** * 현재날짜 yyyyMMddHHmmsss형태로 반환 */
export function changeTimeFormat(time?: any) {
    var vDate = time ? time : new Date();
    var yyyy = vDate.getFullYear().toString();
    var MM = (vDate.getMonth() + 1).toString();
    var dd = vDate.getDate().toString();
    var HH = vDate.getHours().toString();
    var mm = vDate.getMinutes().toString();
    var ss = vDate.getSeconds().toString();
    var sss = vDate.getMilliseconds().toString();
    return (
        yyyy +
        (MM[1] ? MM : '0' + MM[0]) +
        (dd[1] ? dd : '0' + dd[0]) +
        (HH[1] ? HH : '0' + HH[0]) +
        (mm[1] ? mm : '0' + mm[0]) +
        (ss[1] ? ss : '0' + ss[0]) +
        sss
    );
};

/** * timestamp를 날짜 시간 으로 변환 */
export function timeStampToTime(timestamp: string) {
    var date = new Date(timestamp),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        week = new Array('일', '월', '화', '수', '목', '금', '토');
    var convertDate =
        year + '년 ' + month + '월 ' + day + '일 (' + week[date.getDay()] + ') ';
    var convertHour = '';
    if (hour < 12) {
        convertHour =
            '오전 ' + addZero(hour) + ':' + addZero(minute);
    } else if (hour === 12) {
        convertHour =
            '오후 ' + addZero(hour) + ':' + addZero(minute);
    } else {
        convertHour =
            '오후 ' + addZero(hour - 12) + ':' + addZero(minute);
    }
    return convertDate + convertHour;
};

function addZero(n: number) { return n > 9 ? "" + n : "0" + n; }

export const firestoreDelete = async (roomId: string) => {
    const cRef = firestore().collection('call').doc(roomId);

    if (cRef) {
        const calleeCandidate = await cRef.collection('callee').get();
        calleeCandidate.forEach(async candidate => {
            await candidate.ref.delete();
        });
        const callerCandidate = await cRef.collection('caller').get();
        callerCandidate.forEach(async candidate => {
            await candidate.ref.delete();
        });
        const listener = await firestore().collection('incoming').get();
        listener.forEach(async doc => {
            await doc.ref.delete()
        })
        cRef.delete();
    }
};

export const checkNewMsgs = (roomId: string) => {
    let time
    firestore().collection('chat').doc(roomId).collection('message').orderBy('createdAt', 'desc').limit(1).get().then(doc => {
        const dataTime: string = changeTimeFormat(doc.docs[0].data().createdAt.toDate())
        //받아오는 스탈 20220217083656142 형식
        console.log(dataTime, '새 메세지')

    })
}

export const leftTimeSubscribe = (roomId: string, userUid: string) => {
    firestore().collection('chat').doc(roomId).collection('leftAt').doc(userUid).get().then(data => {
        const lastActive = data.data()?.lastSeen
        console.log(lastActive, '라스트')
        //채팅방 나간 시간
        return lastActive
    })
}