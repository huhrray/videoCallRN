import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { CHAT_REQUEST, CHAT_REQUESTOR, CURRENT_USER_AUTH, CURRENT_USER_NAME, CURRENT_USER_TYPE, GETTING_CALL, INCOMING_CALL, IS_CHAT, IS_RECORD, LANGUAGE, NEW_MSG_COUNT, OTHER_USER_NAME, SELECTED_USER, SELECTED_USER_INFO,  USER_STATUS,  VOICE_SCRIPT } from "./types";

export const setCurrentUsername = (name: string) => (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: CURRENT_USER_NAME,
      payload: name,
    });
  };
  
  export const setCurrentUserAuth = (user: string | undefined) => (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: CURRENT_USER_AUTH,
      payload: user,
    });
  };

  export const setCurrentUserType = (type: string | undefined) => (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: CURRENT_USER_TYPE,
      payload: type,
    });
  }

  export const setOtherUsername = (name: string) => (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: OTHER_USER_NAME,
      payload: name,
    });
  };

  export const setSelectedUser = (user: FirebaseFirestoreTypes.DocumentData) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: SELECTED_USER,
      payload: user,
    });
  };
  export const setSelectedUserInfo = (user: { targetUserUid: any; targetUserName: any; roomUserlist: any[]; roomUserName: any[]; roomId: string; }) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: SELECTED_USER_INFO,
      payload: user,
    });
  };

  export const setChatRequest = (request: boolean) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: CHAT_REQUEST,
      payload: request,
    });
  };

  export const setChatRequestor = (requestor: string) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: CHAT_REQUESTOR,
      payload: requestor,
    });
  };

  export const setVoiceScript = (script: string) =>(dispatch: (arg0: { type: string; payload: any; }) => void) =>{
    dispatch({
      type: VOICE_SCRIPT,
      payload: script,
    });
  }

  export const setLanguage = (lang: string) =>(dispatch: (arg0: { type: string; payload: any; }) => void) =>{
    dispatch({
      type: LANGUAGE,
      payload: lang,
    });
  }
  
  //to change the screen when user accpets a phone call
  export const setGettingCall = (isGettingCall: boolean) =>(dispatch: (arg0: { type: string; payload: any; }) => void) =>{
    dispatch({
      type: GETTING_CALL,
      payload: isGettingCall,
    });
  }

  // to notify the user about an incoming call
  export const setIncomingCall = (isCalling: boolean) =>(dispatch: (arg0: { type: string; payload: any; }) => void) =>{
    dispatch({
      type: INCOMING_CALL,
      payload: isCalling,
    });
  }

  export const setUserStatus = (isActive: boolean) =>(dispatch: (arg0: { type: string; payload: any; }) => void) =>{
    dispatch({
      type: USER_STATUS,
      payload: isActive,
    });
  }

 export const setIsRecord = (isRecord: boolean) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: IS_RECORD,
      payload: isRecord,
    });
  };

  export const setIsChat = (isChat: boolean) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: IS_CHAT,
      payload: isChat
    });
  };
  
  export const setLastSeen = (lastSeen:string) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: IS_CHAT,
      payload: lastSeen
    });
  };

  
  export const setNewMsgCount = ( newMsgArr:{roomId:string, count:number}[]) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: NEW_MSG_COUNT,
      payload: newMsgArr
    });
  };


