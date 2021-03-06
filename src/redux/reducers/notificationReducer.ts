import { GET_NOTIFICATION } from "../type";

const initialState = {
  notificationData: [],
};

export const notificationDataReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case GET_NOTIFICATION:
      return {
        ...state,
        notificationData: action.payload,
      };

    default:
      return state;
  }
};
