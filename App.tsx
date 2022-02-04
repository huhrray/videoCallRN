// import React, { useState, useRef, useEffect } from 'react';
// import { StyleSheet, View } from 'react-native';
// import Button from './components/Button';
// import GettingCall from './components/GettingCall';
// import Video from './components/Video';
// import {
//   EventOnAddStream,
//   MediaStream,
//   RTCIceCandidate,
//   RTCPeerConnection,
//   RTCSessionDescription,
// } from 'react-native-webrtc';
// import Utils from './components/Utils';
// import firestore, {
//   FirebaseFirestoreTypes,
// } from '@react-native-firebase/firestore';

// const TURN_SERVER_URL = '192.168.0.2:3478';
// const TURN_SERVER_USERNAME = 'seyhuh';
// const TURN_SERVER_CREDENTIAL = '1234';
// // WebRTC config: you don't have to change this for the example to work
// // If you are testing in local network, you can just use PC_CONFIG = {iceServers: []}
// const PC_CONFIG = {
//   iceServers: [
//     {
//       urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
//       username: TURN_SERVER_USERNAME,
//       credential: TURN_SERVER_CREDENTIAL
//     },
//     {
//       urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
//       username: TURN_SERVER_USERNAME,
//       credential: TURN_SERVER_CREDENTIAL
//     }
//   ]
// };
// const configuration = { iceServers: [{ url: 'stun:stun.l.google.com:19302' }] };

// export default function App() {
//   const [localStream, setLocalStream] = useState<MediaStream | null>();
//   const [remoteStream, setRemoteStream] = useState<MediaStream | null>();
//   const [gettingCall, setGettingCall] = useState(false);
//   const pc = useRef<RTCPeerConnection>();
//   const connecting = useRef(false);
//   useEffect(() => {
//     const cRef = firestore().collection('meet').doc('chatId');
//     const subscribe = cRef.onSnapshot(snapshot => {
//       const data = snapshot.data();

//       //on answer start the call
//       if (pc.current && !pc.current.remoteDescription && data && data.answer) {
//         pc.current.setRemoteDescription(new RTCSessionDescription(data.answer));
//       }

//       // if there is offer for chatId set the getting call flag
//       if (data && data.offer && !connecting.current) {
//         setGettingCall(true);
//       }
//     });
//     //on delete of collection call hangup
//     //the other side has clicekd on hangup
//     const subscribeDelete = cRef.collection('callee').onSnapshot(snapshot => {
//       snapshot.docChanges().forEach(change => {
//         if (change.type === 'removed') {
//           hangup();
//         }
//       });
//     });
//     return () => {
//       subscribe();
//       subscribeDelete();
//     };
//   }, []);
//   const setupWebrtc = async () => {
//     pc.current = new RTCPeerConnection(configuration);

//     //get the audio and video stream for the call
//     const stream = await Utils.getStream();
//     if (stream) {
//       setLocalStream(stream);
//       pc.current.addStream(stream);
//     }
//     // get the remote stream once it is available
//     pc.current.onaddstream = (event: EventOnAddStream) => {
//       setRemoteStream(event.stream);
//     };
//   };

//   const create = async () => {
//     console.log('calling');
//     connecting.current = true;

//     //setup webrtc
//     await setupWebrtc();

//     //document for the call
//     const cRef = firestore().collection('meet').doc('chatId');

//     //exchange the candidate between the caller and callee
//     collectIceCandidates(cRef, 'caller', 'callee');

//     if (pc.current) {
//       //create the offer for the call
//       // store the offer under the document
//       const offer = await pc.current.createOffer();
//       pc.current.setLocalDescription(offer);

//       const cWithOffer = {
//         offer: {
//           type: offer.type,
//           sdp: offer.sdp,
//         },
//       };
//       cRef.set(cWithOffer);
//     }
//   };

//   const join = async () => {
//     console.log('joining the call');
//     connecting.current = true;
//     setGettingCall(false);
//     const cRef = firestore().collection('meet').doc('chatId');
//     const offer = (await cRef.get()).data()?.offer;

//     if (offer) {
//       await setupWebrtc();

//       //exchange the ICE candidates
//       //check the paramets, its reversed. since the joining part is callee
//       collectIceCandidates(cRef, 'callee', 'caller');
//       if (pc.current) {
//         pc.current.setRemoteDescription(new RTCSessionDescription(offer));
//         //create the answer for the call
//         //update the document with answer
//         const answer = await pc.current.createAnswer();
//         pc.current.setLocalDescription(answer);
//         const cWithAnwer = {
//           answer: {
//             type: answer.type,
//             sdp: answer.sdp,
//           },
//         };
//         cRef.update(cWithAnwer);
//       }
//     }
//   };
//   // for disconnectiong the call clse the connection, release the stream  and delete the document for the call

//   const hangup = async () => {
//     setGettingCall(false);
//     connecting.current = false;
//     streamCleanUp();
//     firestoreSCleanup();
//     if (pc.current) {
//       pc.current.close();
//     }
//   };

//   //helper function
//   const streamCleanUp = async () => {
//     if (localStream) {
//       localStream.getTracks().forEach(t => t.stop());
//       localStream.release();
//     }
//     setLocalStream(null);
//     setRemoteStream(null);
//   };

//   const firestoreSCleanup = async () => {
//     const cRef = firestore().collection('meet').doc('chatId');
//     if (cRef) {
//       const calleeCandidate = await cRef.collection('callee').get();
//       calleeCandidate.forEach(async candidate => {
//         await candidate.ref.delete();
//       });
//       const callerCandidate = await cRef.collection('caller').get();
//       callerCandidate.forEach(async candidate => {
//         await candidate.ref.delete();
//       });
//       cRef.delete();
//     }
//   };

//   const collectIceCandidates = async (
//     cRef: FirebaseFirestoreTypes.DocumentReference<FirebaseFirestoreTypes.DocumentData>,
//     localName: string,
//     remoteName: string,
//   ) => {
//     const candidateCollection = cRef.collection(localName);
//     if (pc.current) {
//       //on new ICE candidate add it to firestore
//       pc.current.onicecandidate = event => {
//         if (event.candidate) {
//           candidateCollection.add(event.candidate);
//         }
//       };
//     }
//     // get the ICE candidate added to firesotre and update the local PC
//     cRef.collection(remoteName).onSnapshot(snapshot => {
//       snapshot.docChanges().forEach((change: any) => {
//         if (change.type === 'added') {
//           const candidate = new RTCIceCandidate(change.doc.data());
//           pc.current?.addIceCandidate(candidate);
//         }
//       });
//     });
//   };

//   //displays the gettingCall component
//   if (gettingCall) {
//     return <GettingCall hangup={hangup} join={join} />;
//   }
//   //displays local stream on calling
//   //displays both streams once call is connected
//   if (localStream) {
//     return (
//       <Video
//         hangup={hangup}
//         localStream={localStream}
//         remoteStream={remoteStream}
//       />
//     );
//   }

//   //displays the call button
//   return (
//     <View style={styles.container}>
//       <Button iconName="video" backgroundColor="grey" onPress={create} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });

import React, { useEffect, useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import CallScreen from './screens/CallScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { StyleSheet } from 'react-native';
import ChatScreen from './screens/ChatScreen';
import RegisterScreen from './screens/RegistScreen';
import HomeScreen from './screens/HomeScreen';
import auth from '@react-native-firebase/auth';
import UserListScreen from './screens/UserListScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  // Set an initializing state whilst Firebase connects
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  // Handle user state 
  function onAuthStateChanged(user: any) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);
  if (initializing) return null;

  if (!user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2247f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
            },
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2247f1',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: 'bold',
              fontSize: 25,
            },
            headerTitleAlign: 'center',
          }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="List" component={UserListScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
          <Stack.Screen name="Call" component={CallScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}

const styles = StyleSheet.create({
  icon: {},
});
