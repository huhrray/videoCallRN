import {
  CHAT_REQUEST,
  CHAT_REQUESTOR,
  CURRENT_USER_NAME,
  LANGUAGE,
  OTHER_USER_NAME,
  SELECTED_USER,
  VOICE_SCRIPT,
} from '../actions/types';

const initialState = {
  currentUserName: '',
  otherUserName: '',
  selectedUser: null,
  request: false,
  requestor: '',
  script: "",
  language: "ko-KR"
};

export function userReducer(
  state = initialState,
  action: { type: any; payload: any },
) {
  switch (action.type) {
    case CURRENT_USER_NAME:
      return { ...state, currentUserName: action.payload };
    case OTHER_USER_NAME:
      return { ...state, otherUserName: action.payload };
    case SELECTED_USER:
      return { ...state, selectedUser: action.payload };
    case CHAT_REQUEST:
      return { ...state, request: action.payload };
    case CHAT_REQUESTOR:
      return { ...state, requestor: action.payload };
    case VOICE_SCRIPT:
      return { ...state, script: action.payload };
    case LANGUAGE:
      return { ...state, language: action.payload };
    default:
      return state;
  }
}
