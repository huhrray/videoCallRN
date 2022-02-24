import {
  CHAT_REQUEST,
  CHAT_REQUESTOR,
  CURRENT_USER_AUTH,
  CURRENT_USER_NAME,
  INCOMING_CALL,
  LANGUAGE,
  OTHER_USER_NAME,
  SELECTED_USER,
  SELECTED_USER_INFO,
  VOICE_SCRIPT,
  IS_RECORD,
  IS_CHAT,
  LAST_SEEN,
  NEW_MSG_COUNT
} from '../actions/types';

const initialState = {
  currentUserName: '',
  currentUserUid: '',
  otherUserName: '',
  selectedUser: null,
  selectedUserInfo: null,
  request: false,
  requestor: '',
  script: "",
  language: "ko-KR",
  incomingCall: false,
  isRecord: false,
  isChat: false,
  lastSeen: '',
  newMsgCount:[{roomId:'', count:0}]
};

export function userReducer(
  state = initialState,
  action: { type: any; payload: any },
) {
  switch (action.type) {
    case CURRENT_USER_NAME:
      return { ...state, currentUserName: action.payload };
    case CURRENT_USER_AUTH:
      return { ...state, currentUserUid: action.payload };
    case OTHER_USER_NAME:
      return { ...state, otherUserName: action.payload };
    case SELECTED_USER:
      return { ...state, selectedUser: action.payload };
    case SELECTED_USER_INFO:
      return { ...state, selectedUserInfo: action.payload };
    case CHAT_REQUEST:
      return { ...state, request: action.payload };
    case CHAT_REQUESTOR:
      return { ...state, requestor: action.payload };
    case VOICE_SCRIPT:
      return { ...state, script: action.payload };
    case LANGUAGE:
      return { ...state, language: action.payload };
    case INCOMING_CALL:
      return { ...state, incomingCall: action.payload };
    case IS_RECORD:
      return { ...state, isRecord: action.payload };
    case IS_CHAT:
      return { ...state, isChat: action.payload };
    case LAST_SEEN:
      return { ...state, lastSeen: action.payload };
    case NEW_MSG_COUNT:
      return { ...state, newMsgCount: [...state.newMsgCount,  action.payload] };
    default:
      return state;
  }
}
