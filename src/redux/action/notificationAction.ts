import moment from "moment";
import { db } from "../../firebaseConfig";
import { GET_NOTIFICATION } from "../type";
import firebase from "firebase";

export const getNotification = (id: string) => (dispatch: any) => {

  const date = firebase.firestore.Timestamp.fromDate(new Date(moment(new Date()).subtract(30, 'd').format('YYYY-MM-DD'))).toDate()

  const unsubscribe = db
    .collection("notification")
    .orderBy("timestamp", "desc")
    .where("reciever", "==", id)
    .where('timestamp', '>=', date)
    .onSnapshot(
      (snapshot) => {
        if (snapshot.docs) {
          let data = snapshot.docs.map((doc: any) => ({
            id: doc.id,
            data: doc.data(),
          }));

          dispatch({
            type: GET_NOTIFICATION,
            payload: data
          });
        }
      },
      (err: any) => {
        console.log("Error in getNotification: ", err);
      }
    );
  return unsubscribe;
};