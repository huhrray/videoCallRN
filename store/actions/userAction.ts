import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { CHAT_REQUEST, CHAT_REQUESTOR, CURRENT_USER_AUTH, CURRENT_USER_NAME, LANGUAGE, OTHER_USER_NAME, SELECTED_USER, VOICE_SCRIPT } from "./types";

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
  export const setSelectedUserInfo = (user:{}) =>  (dispatch: (arg0: { type: string; payload: any; }) => void) => {
    dispatch({
      type: SELECTED_USER,
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
  