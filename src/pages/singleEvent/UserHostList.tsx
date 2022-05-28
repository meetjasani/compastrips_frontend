import { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
// import Buttons from "../../components/Buttons";
import { ApiGet, ApiPost, ApiPut } from "../../helper/API/ApiData";
import * as QueryString from "query-string";
import { useTranslation } from "react-i18next";
import moment from "moment";
import Rating from "react-rating";
// import InputField from "../../components/Inputfield";
import { checkImageURL, transporTation } from "../../helper/utils";
import { setChatId, setMessageState, setOtherUserData } from "../../redux/action/chatDataAction";
import { db } from "../../firebaseConfig";
import firebase from "firebase";
import AuthStorage from "../../helper/AuthStorage";
import TextareaAutosize from 'react-textarea-autosize';
import Login from "../modal/Login";
import { getNotification } from "../../redux/action/notificationAction";


interface CurrentUser {
  id: string;
  name: string;
  profile_url: string;
}
interface OtherUser {
  id: string;
  name: string;
  profile_url: string;
}


const UserHostList = (props: any) => {
  const [joinHost, setjoinHost] = useState(false);
  const [appApply, setappApply] = useState(false);
  const [cancleApp, setcancleApp] = useState(false);
  const [cancleConfirm, setcancleConfirm] = useState(false);
  const [reqCancle, setreqCancle] = useState(false);
  const [conDelete, setconDelete] = useState(false);

  //Review
  const [feedback, setFeedback] = useState<string>("");
  const [stars, setStars] = useState<number>(0);

  const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);
  const { notificationData } = useSelector((state: RootStateOrAny) => state.notification);

  //Popup State
  const [hostNotice, sethostNotice] = useState(false);
  const [cancleHosting, setCancleHosting] = useState(false);
  const [reviewPopup, setReviewPopup] = useState(false);
  const [reviewNot, setreviewNot] = useState(false);

  const history = useHistory();
  const params = QueryString.parse(history.location.search);

  const [userHostList, setUserHostList] = useState<any>();
  const [participantList, setParticipantList] = useState<any[]>([]);
  const { userData } = useSelector((state: RootStateOrAny) => state.userData);
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // buttons states
  const [checkJoinButton, setCheckJoinButton] = useState(false);
  const [checkCancleBox, setCheckCancleBox] = useState(false);
  const [checkHostingCancle, setCheckHostingCancle] = useState(false);
  const [checkDeclined, setCheckDeclined] = useState(false);
  const [applicationAccepted, setApplicationAccepted] = useState(false);
  const [standBy, setStandBy] = useState(false);
  const [checkReviewButton, setCheckReviewButton] = useState(false);
  const [hostingCom, SethostingCom] = useState(false);
  const [comHostNotice, SetcomHostNotice] = useState(false);
  const [isHostingCompleted, setIsHostingCompleted] = useState(false);
  const [isReviewSubmited, setIsReviewSubmited] = useState(false);

  const reqdelBtn = () => {
    setreqCancle(false);
    setconDelete(true);

    ApiPost(`hosting/participate/${userHostList.id}`, {}).then((ress: any) => {
      getHosting();
      setCheckCancleBox(false);
    });
  }

  //For Translation
  const { t } = useTranslation();

  // handlers
  const getHosting = () => {
    ApiGet(`hosting/host-itinerary/${params.id}`).then((res: any) => {
      const data = props.isCompas ? res?.data?.find((x: any) =>
        x.id === props.isCompas
      ) : res.data[0]
      setIsLiked(data?.user.like)
      setUserHostList(data);
      getParticipants(data?.id);
      if (data?.status === "COMPLETED") {
        setIsHostingCompleted(true);
        setCheckReviewButton(true);
      }
    });
  };

  const setapplyBtn = () => {
    setjoinHost(false);
    setappApply(true);
  };

  const ReviewSubBtn = () => {
    setReviewPopup(false);
    setreviewNot(true);
  };

  const cancleConfirmBtn = () => {
    setcancleApp(false);
    setcancleConfirm(true);

    ApiPost(`hosting/participate/${userHostList.id}`, {}).then((ress: any) => {
      getHosting();
      setCheckCancleBox(false);
    });
  };

  const getParticipants = (id: string) => {
    ApiGet(`hosting/accept-participants/${id}`).then((res: any) => {
      setParticipantList(res.data.participants);
      setIsReviewSubmited(res.data.is_reviewed);
    });
  };

  const sendApplication = () => {
    ApiPost(`hosting/participate/${userHostList.id}`, {}).then((ress: any) => {
      setCheckCancleBox(true);
    });
  };

  const handleJoinHosting = () => {
    sendApplication();
    setapplyBtn();
  };

  const SethostingComBtn = () => {
    SethostingCom(false);
    SetcomHostNotice(true);
  }

  const cancleHostingFunction = () => {
    setCancleHosting(false);
    ApiPut(`hosting/cancelHosting/${userHostList.id}`, {}).then((res: any) => {
      sethostNotice(true);
    });
  }

  //Complete Hosting
  const completeHosting = () => {
    ApiPut(`hosting/completeHosting/${userHostList.id}`, {})
      .then((res: any) => {
        SethostingComBtn();
        setIsHostingCompleted(true);
        setCheckReviewButton(true);
        props.setIsHostingCompleted(true);
        // props.setRefreshPax(Math.random());
      })
  }

  //Send Review
  const sendReviews = () => {
    ApiPost('hosting/makeReview',
      {
        star: stars,
        content: feedback,
        hosting_id: userHostList.id
      })
      .then((res: any) => {
        setIsReviewSubmited(true);
        ReviewSubBtn();
        props.setRefreshReview(Math.random());
      })
  }

  //Like functonality
  const [delayLike, setDelayLike] = useState(false);

  const Like = (id: string) => {

    setIsLiked(!isLiked);
    setDelayLike(true);

    ApiPost(`user/wishlist/${id}`, {})
      .then((res: any) => {
        setDelayLike(false);
      })
  };


  //Checking for hosting completion
  const checkIsComplete = (date: string, endTime: string) => {
    let time = moment(moment(date).format("YYYY:MM:DD") + " " + endTime, "YYYY:MM:DD HH:mm");
    return (time.toDate() < moment(new Date, "YYYY:MM:DD HH:mm").toDate())
  }


  // Effects
  useEffect(() => {
    getHosting();
  }, [props.refresh]);

  useEffect(() => {
    if (userHostList) {
      if (userData && userHostList.user.id === userData.id) {
        setCheckHostingCancle(true);
      }
      else {
        userData && is_loggedin && ApiGet(`hosting/isrequested-participants/${userHostList.id}`).then(
          (res: any) => {
            if (res.data) {
              if (res.data.status === "DECLINED") {
                setCheckDeclined(true);
              }
              else {
                setCheckCancleBox(true);
              }
              setApplicationAccepted(res.data.status === "ACCEPTED");
              setStandBy(res.data.status === "STAND_BY");
            }
            else {
              setCheckJoinButton(true)
            }
          }
        );
        setCheckJoinButton(true)
      }
    }
  }, [userHostList, userData]);

  useEffect(() => {
    handleButtons();
    // if (userData && userData.hasOwnProperty("id")) {
    //   dispatch(getNotification(userData?.id))
    // }
  }, [checkDeclined, checkCancleBox, checkHostingCancle, userHostList])


  // Create a chat
  const dispatch = useDispatch();
  const { chatData, message_open } = useSelector((state: RootStateOrAny) => state.chatData);
  const createChat = async (
    current_user: CurrentUser,
    other_user: OtherUser
  ) => {
    let doc_id: string;
    if (!current_user.id && !other_user.id && current_user.id === other_user.id) {
      return;
    }
    if (current_user.id > other_user.id) {
      doc_id = current_user.id + other_user.id;
    } else {
      doc_id = other_user.id + current_user.id;
    }

    if (chatData.find((x: any) => x.id === doc_id)) {
      dispatch(setChatId(doc_id));
      dispatch(setOtherUserData(other_user));
      dispatch(setMessageState(!message_open));
    } else {
      const ref = db.collection("users").doc(doc_id);
      await ref.set(
        {
          [`${current_user.id}_count`]: 0,
          [`${other_user.id}_count`]: 0,
          lastMessage: "",
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          ids: [current_user.id, other_user.id],
          [`${current_user.id}`]: {
            id: current_user.id,
            name: current_user.name,
            profile_url: current_user.profile_url,
          },
          [`${other_user.id}`]: {
            id: other_user.id,
            name: other_user.name,
            profile_url: other_user.profile_url,
          },
        },
        { merge: true }
      );

      dispatch(setChatId(doc_id));
      dispatch(setOtherUserData(other_user));
      dispatch(setMessageState(!message_open));
    }
  };

  const [modalShow, setModalShow] = useState(false);
  const notlogin = () => {
    setModalShow(true)
  }
  // component helper functions
  const hostDetails = () => (
    <>

      <div className=''>
        <div className=''>
          <div className='single-local-host-inner postion-relative'>
            <div className="likechetBox">
              <div className=" join-pro ml-auto">
                {userHostList?.user?.id !== userData?.id && <div className="join-msg ">
                  <img src="./img/msg.svg" alt="" className="chatbox" onClick={() => {
                    is_loggedin ?
                      createChat(
                        {
                          id: userData.id,
                          name: userData.user_name,
                          profile_url: userData.avatar,
                        },
                        {
                          id: userHostList?.user.id,
                          name: userHostList?.user.user_name,
                          profile_url: userHostList?.user.avatar,
                        }
                      )
                      :
                      notlogin()
                  }} />
                </div>}
              </div>

              <div className="tout-created ml-auto">
                <div className="download-heart-icon button">
                  <div className="heart-div">
                    <input
                      type="checkbox"
                      checked={isLiked}
                      disabled={delayLike}
                      onClick={() => is_loggedin ? Like(userHostList?.user.id) : notlogin()} id="id" className="instruments" />
                    <label htmlFor="id" className="check mb-0">
                      {!isLiked && <img src="./img/Favourite.png" alt="" className="hostlistFavourite" />}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className='single-local-host-profile'>
              <img src={userHostList.user.avatar || "./img/Avatar.png"} alt="" />
              <div className='pro-tag-name'>
                <div className='pro-name-suah'>
                  <h3>{(userHostList.user.user_name).length < 9 ? userHostList.user.user_name : (userHostList.user.user_name).slice(0, 9) + "..."}</h3>
                  <img src={checkImageURL(userHostList.user.nationality)} alt="flag" />
                </div>
                <div className='pro-tag-suah'>
                  {userHostList.type === "Local"
                    ?
                    <div className='host-catrgory'><p>{t("Local_Host")}</p></div>
                    :
                    <div className='travel-host-catrgory'><p>{t("Traveler_Host")}</p></div>
                  }
                  {userHostList.user.gender === "MALE"
                    ?
                    <div className='host-gender'><p>{t("Male")}</p></div>
                    :
                    <div className='host-gender-male'><p>{t("Female")}</p></div>
                  }
                  <div className='host-ages'>{AuthStorage.getLang() === "en" ? <p>{userHostList.user.age_group}'{t("Age_Groups")}</p> : <p className="d-flex align-items-center">{userHostList.user.age_group}<span>{t("Age_Groups")}</span></p>}</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div >
    </>
    // <div className="host d-flex">
    //   <div>
    //     <img src={userHostList.user.avatar || "./img/Avatar.png"} alt="" />
    //   </div>
    //   <div className="ml-20">
    //     <div className="d-flex">
    //       <div className="d-flex img-join-host h-36 ">
    //         <h5 className="font-20-bold color-dark mr-18">
    //           {(userHostList.user.user_name).length < 9 ? userHostList.user.user_name : (userHostList.user.user_name).slice(0, 9) + "..."}
    //         </h5>
    //         <img src={checkImageURL(userHostList.user.nationality)} alt="flag" />
    //       </div>

    //       <div className="d-flex join-pro ml-auto">
    //         {userHostList?.user?.id !== userData.id && <div className="join-msg ">
    //           <img src="./img/msg.svg" alt="" onClick={() => {
    //             is_loggedin &&
    //               createChat(
    //                 {
    //                   id: userData.id,
    //                   name: userData.user_name,
    //                   profile_url: userData.avatar,
    //                 },
    //                 {
    //                   id: userHostList?.user.id,
    //                   name: userHostList?.user.user_name,
    //                   profile_url: userHostList?.user.avatar,
    //                 }
    //               )
    //           }} />
    //         </div>}
    //         <div className="tout-created ml-auto">
    //           <div className="download-heart-icon button">
    //             <div className="heart-div">
    //               <input type="checkbox" checked={isLiked}
    //                 disabled={delayLike}
    //                 onClick={() => is_loggedin && Like(userHostList?.user.id)} id="id" className="instruments" />
    //               <label htmlFor="id" className="text-white check mb-0">
    //                 {!isLiked && <img src="./img/Favourite.png" alt="" />}
    //               </label>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </div>

    //     <div className="host-info mt-14">
    //       <div
    //         className={
    //           userHostList.type === "Local"
    //             ? "local-host-bg hots-tags"
    //             : "travel-host-bg hots-tags"
    //         }
    //       >
    //         <p className="info">{userHostList.type === "Local" ? t("Local_Host") : t("Traveler_Host")}</p>
    //       </div>
    //       <div className="hots-tags">
    //         <p className="info">{userHostList.user.gender === "MALE" ? t("Male") : t("Female")}</p>
    //       </div>
    //       <div className="hots-tags">
    //         <p className="info">{userHostList.user.age_group}{t("Age_Groups")}</p>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );

  const joinButton = () => (
    <>

      <div className="btnbox">
        {/* <Button
        className="hosts-btn mt-15 p-0"
        onClick={() => {
          // applicationAccepted ?
          is_loggedin && setReviewPopup(true);
        }}
      >
        {t("Host_Details.Write_Review")}
      </Button> */}
        <Button
          className="hosts-btn p-0"
          onClick={() => {
            is_loggedin ? setjoinHost(true) : notlogin();
          }}
        >
          {t("Host_Details.Join")}
        </Button>
      </div>
    </>
  );

  const completeHostingBtn = () => (
    <>
      <div className="">
        <Button
          className="cancle-my-host p-0"
          onClick={() => {
            is_loggedin && setCancleHosting(true);
          }}
        >
          {t("Host_Details.Cancel_Btn.P1")}&nbsp;{t("Host_Details.Cancel_Btn.P2")}
        </Button>
      </div>
      <div className="">
        {checkIsComplete(userHostList.date, userHostList.end_time) && participantList.length !== 0
          ?
          <Button
            className="comp-my-host-blue p-0"
            // disabled={checkIsComplete(userHostList.date, userHostList.end_time)}
            onClick={() => {
              is_loggedin && SethostingCom(true);
            }}
          >
            {t("Host_Details.Hosting_Complete.P1")} {t("Host_Details.Hosting_Complete.P2")}
          </Button>
          :
          <Button
            className="comp-my-host p-0"
            disabled={checkIsComplete(userHostList.date, userHostList.end_time)}
          >
            {t("Host_Details.Hosting_Complete.P1")} {t("Host_Details.Hosting_Complete.P2")}
          </Button>
        }
      </div>
    </>
  )


  const cancleHostingButton = () => (
    <div className="d-flex mt-40 mb-40 CancleHosting">

      {isHostingCompleted
        ?
        <>
          <div className="single-host-appstatus mt-40">
            <label className=" p-0">{t("Host_Details.Hosting_Completed")}</label>
          </div>

        </>
        :
        completeHostingBtn()
      }
    </div>
  );

  const cancleApplicationButton = () => (
    <>
      {
        checkReviewButton
          ?
          reviewButton()
          :
          <>
            <div className="single-host-appstatus mt-40">
              <label className=" p-0">{applicationAccepted ? t("Host_Details.Application_Accepted") : t("Host_Details.Application_Sent")}</label>
            </div>

            <div className="cancleApplicationbtnbox">
              <button
                className="cancleApplicationbtn"
                onClick={() => {
                  // applicationAccepted ?
                  is_loggedin && (applicationAccepted ? setreqCancle(true) : setcancleApp(true))
                }}
              >
                {t("Host_Details.Cancel_My_Application")}
              </button>
            </div>
          </>
      }
    </>
  );

  const showParticipants = () => (
    <>
      <div className=''>
        <div className=''>
          <div className='total-pax-joining'>
            <p>
              {t("Host_Own.pax1")}
              <span>{userHostList.participate_count}{t("Host_Own.pax3")}</span>/{userHostList.pax}{t("Host_Own.pax3")}
              {t("Host_Own.pax2")}
            </p>
          </div>

          {participantList.map((participant: any) => (
            <div className='single-pax-list'>
              <div className='d-flex align-items-center'>
                <img src={participant.user.avatar || "./img/Avatar.png"} alt="" style={{ width: '36px', height: "36px", borderRadius: '50%' }} />
                <h5>{(participant.user.user_name).length >= 8 ? (participant.user.user_name).slice(0, 8) + ".." : participant.user.user_name}</h5>
              </div>


              <div className='d-flex align-items-center'>
                <img src={checkImageURL(participant.user.nationality)} alt="" className='pax-flag-imag' />
                {participant.user.gender === "MALE"
                  ?
                  <div className='host-gender'><p>{t("Male")}</p></div>
                  :
                  <div className='host-gender-male'><p>{t("Female")}</p></div>
                }
                <div className='host-ages'>{AuthStorage.getLang() === "en" ? <p>{participant.user.age_group}'{t("Age_Groups")}</p> : <p className="d-flex align-items-center">{participant.user.age_group}<span>{t("Age_Groups")}</span></p>}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </>

    // <div className="info-joinhost pax-host-list mt-30">
    //   <div className="mt-30">
    //     <p className="font-16-bold">{t("Host_Own.pax1")}
    //       <span className={(userHostList.participate_count === userHostList.pax) ? "orange-font" : "blue-font"}> {userHostList.participate_count}{t("Host_Own.pax3")}</span>/
    //       {userHostList.pax}{t("Host_Own.pax3")} {t("Host_Own.pax2")}
    //     </p>
    //   </div>
    //   {participantList.map((participant: any) => (
    //     <div className=" mt-20 host-info ">
    //       <div className="d-flex align-items-center w-380px">
    //         <img src={participant.user.avatar || "./img/Avatar.png"} className="pax-img" alt="" />
    //         <h5 className="font-20-bold color-dark mr-9 ml-30">
    //           {(participant.user.user_name).length >= 8 ? (participant.user.user_name).slice(0, 8) + ".." : participant.user.user_name}
    //         </h5>
    //         <img src={checkImageURL(participant.user.nationality)} alt="flag" className="round-flags" />
    //         <div className="d-flex ml-auto">
    //           <div className="hots-tags ml-10 mr-10 w-60">
    //             <p className="info mb-0 h-24">{participant.user.gender === "MALE" ? t("Male") : t("Female")}</p>
    //           </div>
    //           <div className="hots-tags w-60 mr-0">
    //             <p className="info mb-0">{participant.user.age_group}{t("Age_Groups")}</p>
    //           </div>
    //         </div>
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );

  const emptyParticipant = () => (

    <>
      <div className="emptymain">
        <p className="font-16-bold">{t("Host_Own.pax1")} <span>0</span>{t("Host_Own.pax3")}/{userHostList.pax}{t("Host_Own.pax3")} {t("Host_Own.pax2")}</p>
      </div>
      <div className="info-joinhost pax-host-list mt-30">
        <p className="font-18-normal text-center color-darkgray mt-60 mb-60">
          {t("Empty_Participates.Text")}
        </p>
      </div>
    </>
  );

  const showHostingData = () => (
    <>

      <div className='userhostlistmain'>
        <div className=''>
          <div className='single-row-about'>
            <h3>{t("Host_Details.Date&Time")}</h3>
            <h4>
              {userHostList.date.replaceAll("-", ".")}{" "}
              {userHostList.start_time.slice(0, 5)}
              {" - "}
              {userHostList.end_time.slice(0, 5)}
            </h4>
          </div>
          <div className='single-row-about'>
            <h3>{t("Host_Details.Starts_At")}</h3>
            <h4>{userHostList.location}</h4>
          </div>

          <div className='single-row-about'>
            <h3>{t("Host_Details.Transportation")}</h3>
            <h4>
              {AuthStorage.getLang() === "ko" ? transporTation(userHostList.transportation) : userHostList.transportation}
            </h4>
          </div>
        </div>
      </div>
    </>
  );

  const showHostingInformationData = () => (
    <>
      <div className=''>
        <p> {userHostList.host_information} </p>
      </div>
    </>
  );

  const applicationClosed = () => (
    <div className="single-host-appstatus mt-40">
      {/* <label className=" p-0">{t("Host_Details.Closed")}</label> */}
      <label className=" p-0">{t("Host_Details.Hosting_Completed")}</label>
    </div>
  );

  const applicationDeclined = () => (
    <>
      <div className="single-host-appstatus mt-40">
        <label className=" p-0">{t("Host_Details.Rejected_By_Host")}</label>
      </div>

      <div className="single-host-appstatus mb-40 mt-16">
        <label className=" p-0">{t("Host_Details.Cancle_Request")}</label>
      </div>
    </>
  );

  //Review Popup
  const reviewButton = () => (
    <>
      {(!standBy)
        ?
        <>
          <div className="single-host-appstatus mt-40">
            <label className=" p-0" >{t("Host_Details.Hosting_Completed")}</label>
          </div>

          <div className="">
            {isReviewSubmited
              ?
              <div className="single-host-appstatus2 mt-15">
                <label className=" p-0">{t("Host_Details.Review_Submitted")}</label>
              </div>
              :
              <Button
                className="hosts-btn mt-15 p-0"
                onClick={() => {
                  // applicationAccepted ?
                  is_loggedin && setReviewPopup(true);
                }}
              >
                {t("Host_Details.Write_Review")}
              </Button>}
          </div>
        </>
        :
        <div className="single-host-appstatus mt-40 mb-29">
          <label className=" p-0">{t("Host_Details.Closed")}</label>
        </div>
      }
    </>
  )



  const handleButtons = () => {
    if (checkDeclined) {
      return applicationDeclined();
    }
    if (checkCancleBox) {
      return cancleApplicationButton();
    }
    if (checkHostingCancle) {
      return cancleHostingButton();
    }
    if (userHostList?.participate_count === userHostList?.pax) {
      return applicationClosed();
    }
    if (checkJoinButton) {
      if ((userHostList && userHostList.participate_count === userHostList.pax) || checkIsComplete(userHostList?.date, userHostList?.end_time)) {
        return applicationClosed()
      }
      return joinButton();
    }
    if (checkReviewButton) {
      return reviewButton()
    }
  };

  return (
    <>
      {/* <div className="host-list-card">
        {userHostList && (
          <div className="">
            <div className="host-listuser">
              <div className="p-0 ">
                {hostDetails()}
                {handleButtons()}
              </div>
              {showHostingData()}
              {userHostList.participate_count
                ? showParticipants()
                : emptyParticipant()}
            </div>
          </div>
        )}
      </div> */}

      <div className='host-info-main'>

        {userHostList && (
          <>
            <div className='host-info-inner'>
              <div className='single-local-host-inner'>
                <div className='single-local-host-profile'>
                  {hostDetails()}
                </div>
                {handleButtons()}
              </div>
            </div>
            <div className='about-itinery-info'>
              <div className='about-itinery-info-inner'>
                <div className=''>
                  {showHostingData()}
                </div>
              </div>
            </div>
            <div className='about-itinery-info-inner'>
              <div className='infodetails'>
                {showHostingInformationData()}
              </div>
            </div>
            <div className='pax-list-host'>
              <div className='pax-list-inner'>
                {userHostList.participate_count
                  ? showParticipants()
                  : emptyParticipant()}
              </div>
            </div>
          </>
        )}
      </div>


      {/* Join Hosting Popup */}
      <Modal
        show={joinHost}
        onHide={() => {
          setjoinHost(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Join_Popup.Join")}</h3>
          </div>

          <div className="mt-50 welcome-content welcome-join-modal welcome-body">
            <div className="join-innner text-center">
              <p className="text-center">
                {t("Join_Popup.Text1")}


              </p>
              <label> {t("Join_Popup.Text2")}</label>
            </div>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between join-btnbox mt-60">
          <div className="">
            <button
              // ButtonStyle="join-cancle-btn"
              className="joincancle"
              onClick={() => {
                setjoinHost(false);
              }}
            >{t("Join_Popup.Cancel")}
            </button>
          </div>

          <div className="">
            <button
              // ButtonStyle="join-apply-btn"
              onClick={() => {
                handleJoinHosting();
              }}
              className="joinApply"
            >
              {t("Join_Popup.Apply")}
            </button>
          </div>
        </div>
      </Modal>


      {/* Application Sent Popup */}
      <Modal
        show={appApply}
        onHide={() => {
          setappApply(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Application_Sent.Application_Sent")}</h3>
          </div>
          <div className="mt-60 app-body">
            <div className="joinapplication">
              <div className="joinApplicationtextCtn">
                <p className="joinapplicationcontent">
                  {t("Application_Sent.Text1")}<br />
                  {t("Application_Sent.Text2")} <br />
                </p>
              </div>


              <div className="applicationaccount">
                <label> {t("Application_Sent.Text3")} </label>
              </div>
            </div>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="applicationBtn">
            <button
              // ButtonStyle="app-sent-ok"
              onClick={() => {
                setappApply(false);
              }}
            >
              {t("Application_Sent.OK")}
            </button>
          </div>
        </div>
      </Modal>


      {/* Cancel Application Popup */}
      <Modal
        show={cancleApp}
        onHide={() => {
          setcancleApp(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Cancel_Application.Cancel_Application")}</h3>
          </div>
          <div className="welcome-content cancle-body-app mt-60">
            <div className="canclePopUpContent text-center">
              <div className={AuthStorage.getLang() === "en" ? "CanclePopupInner" : "CanclePopupInnerko"}>
                <p className="h-60">
                  {t("Cancel_Application.Question")}<br />{t("Cancel_Application.Question1")}
                </p>
              </div>
            </div>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-50 canclePopupBtn" >
          <div className="cancle">
            <button
              // ButtonStyle="join-cancle-btn"
              onClick={() => {
                setcancleApp(false);
              }}
            >
              {t("Cancel_Application.Cancel")}
            </button>
          </div>

          <div className="confirm">
            <button
              // ButtonStyle="join-apply-btn"
              onClick={() => {
                cancleConfirmBtn();
              }}
            >
              {t("Cancel_Application.Confirm")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Application Notice Popup */}
      <Modal
        show={cancleConfirm}
        onHide={() => {
          setcancleConfirm(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko "}>
            <h3>{t("Cancel_Application.Cancel_Application")}</h3>
          </div>
          <div className="welcome-content cancle-body-app mt-60 text-center">
            <div className={AuthStorage.getLang() === "en" ? "cancleBodyInner text-center" : "cancleBodyInnerko text-center"}>
              <p className="h-60 font-20-normal">
                {AuthStorage.getLang() === "en" ? <>{t("Cancel_Application.Confirm_Statement")}</> :
                  <>
                    {t("Cancel_Application.Confirm_Statement")}<br />{t("Cancel_Application.Confirm_Statement1")}
                  </>
                }
              </p>
            </div>
          </div>
        </Modal.Body>
        <div className={AuthStorage.getLang() === "en" ? "w-100 mt-50 confirmCancleok" : "w-100 mt-50 confirmCancleokko"}>
          <div className="d-flex j-content-center">
            <button
              // ButtonStyle="app-sent-ok"
              onClick={() => {
                setcancleConfirm(false);
              }}
            >
              {t("Cancel_Application.OK")}
            </button>
          </div>
        </div>
      </Modal>


      {/* Cancel Hosting Popup */}
      <Modal
        show={cancleHosting}
        onHide={() => {
          setCancleHosting(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Cancel_Hosting_Popup.Title")}</h3>
          </div>
          <div className="welcome-content CancleHostingInnerContent mt-60">
            <div className="CancleHostingBG text-center">
              <h3 className="font-20-normal color-black text-center">{t("Cancel_Hosting_Popup.Question")}</h3>
              <p className={AuthStorage.getLang() === "en" ? "canclehostingen" : "canclehostingtextko"}>
                {AuthStorage.getLang() === "en" ?
                  <>{t("Cancel_Hosting_Popup.Text")}</>
                  :
                  <>{t("Cancel_Hosting_Popup.Text")} < br /> {t("Cancel_Hosting_Popup.Text1")} < br /> {t("Cancel_Hosting_Popup.Text2")}</>}</p>

            </div>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-40 CancleHostingBtnBox">
          <div className="cancle">
            <button
              // ButtonStyle="join-cancle-btn" 
              onClick={() => { setCancleHosting(false) }}>
              {t("Cancel_Hosting_Popup.Cancel")}
            </button>
          </div>
          <div className="confirm">
            <button
              // ButtonStyle="join-apply-btn" 
              onClick={() => cancleHostingFunction()}>
              {t("Cancel_Hosting_Popup.Confirm")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Cancel Hosting Notice Popup */}
      <Modal
        show={hostNotice}
        onHide={() => {
          sethostNotice(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >

        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3>{t("Cancel_Hosting_Popup.Notice.Title")}</h3>
          </div>
          <div className="welcome-content welcome-body userHostcancleContent mt-60">
            <div className="userHostCancleInner text-center">
              <p className="h-60 ">{t("Cancel_Hosting_Popup.Notice.Body")}</p>
            </div>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="okCancle">
            <button
              // ButtonStyle="app-sent-ok w-100" 
              onClick={() => { sethostNotice(false); history.push('/'); }}>
              {t("Cancel_Hosting_Popup.Notice.OK")}
            </button>
          </div>
        </div>
      </Modal>


      {/* Cancel Accepted Application Popup  */}

      <Modal
        show={reqCancle}
        onHide={() => {
          setreqCancle(false);
        }}
        dialogClassName="welcome-modal del-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >

        <Modal.Body className="p-0">
          <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko "}>
            <h3 className="h-36">{t("Cancel_Accepted.Title")}</h3>
          </div>
          <div className="myApplicationContent">
            <div className={AuthStorage.getLang() === "en" ? "MyApplicationInner" : "MyApplicationInnerko"}>
              <p className="font-24-normal h-36 color-black mt-36 text-center">{t("Cancel_Accepted.Body")}<br />{t("Cancel_Accepted.Body1")}</p>
            </div>

          </div>
        </Modal.Body>
        <div className={AuthStorage.getLang() === "en" ? "d-flex justify-content-between mt-40 myApplicationBtnBox" : "d-flex justify-content-between mt-40 myApplicationBtnBoxko"}>
          <div className="cancle">

            <button
              //  ButtonStyle="join-cancle-btn" 
              onClick={() => { setreqCancle(false) }}>
              {t("Cancel_Accepted.Cancel")}
            </button>


          </div>

          <div className="confirm">

            <button
              // ButtonStyle="join-apply-btn"
              onClick={() => { reqdelBtn() }}>
              {t("Cancel_Accepted.Continue")}
            </button>

          </div>

        </div>
      </Modal>

      {/* Cancel Accepted Application Notice Popup */}

      <Modal
        show={conDelete}
        onHide={() => {
          setconDelete(false);
        }}
        dialogClassName="welcome-modal del-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >

        <Modal.Body className="p-0">
          <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko "}>
            <h3 className="h-36">{t("Cancel_Accepted_Success.Title")}</h3>
          </div>
          <div className="ConMyApplicationContent">
            <div className="ConMyApplicationInner">
              <p className="font-24-normal h-36 color-black mt-36 text-center">{t("Cancel_Accepted_Success.Body")}<br />{t("Cancel_Accepted_Success.Body1")}</p>
            </div>

          </div>
        </Modal.Body>
        <div className="w-100 mt-40">
          <div className="ConMyApplicationBtn">
            <button
              // ButtonStyle="app-sent-ok w-240" 
              onClick={() => { setconDelete(false); }}>
              {t("Cancel_Accepted_Success.Continue")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Hosting Completed Popup */}
      <Modal
        show={hostingCom}
        onHide={() => {
          SethostingCom(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className="modal-signup-title ">
            <h3 className="h-34">{t("Hosting_Complete.Title")}</h3>
          </div>
          <div className="com-hosting mt-60">
            <div className="comHostingInner">
              <p className="text-center font-18-normal color-darkgray h-27">{t("Hosting_Complete.Text")}</p>
            </div>
          </div>
        </Modal.Body>
        <div className="d-flex justify-content-between mt-50 comHostingBtnBox">
          <div className="cancle">
            <button
              //  ButtonStyle="join-cancle-btn"
              onClick={() => SethostingCom(false)}>
              {t("Hosting_Complete.Cancel")}
            </button>
          </div>
          <div className="yes">
            <button
              //  ButtonStyle="join-apply-btn"
              onClick={() => completeHosting()}>
              {t("Hosting_Complete.Yes")}
            </button>
          </div>
        </div>
      </Modal>

      {/* Hosting Complete Notice Popup */}
      <Modal
        show={comHostNotice}
        onHide={() => {
          SetcomHostNotice(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >

        <Modal.Body className="p-0">
          <div className="modal-signup-title h-34">
            <h3>{t("Hosting_Complete.Notice.Title")}</h3>
          </div>
          <div className="yes-notice mt-60">
            <div className="ComHostingNotice text-center">
              <p className="font-17-normal">{t("Hosting_Complete.Notice.Body")}</p>
            </div>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className="ComHostNoticeBtn">
            <button
              // ButtonStyle="app-sent-ok"
              onClick={() => { SetcomHostNotice(false); }}>
              {t("Hosting_Complete.Notice.OK")}
            </button>
          </div>
        </div>
      </Modal>


      {/* Review Popup */}
      <Modal
        show={reviewPopup}
        onHide={() => {
          setReviewPopup(false);
        }}
        dialogClassName="welcome-modal reviewstar-popup"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Body className="p-0">
          <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko "}>
            <h3 className="h-34">{t("Review_Popup.Title")}</h3>
          </div>
          <div className="review-body mt-43">
            <div className={AuthStorage.getLang() === "en" ? "reviewContent" : "reviewContentko"}>
              <p className={AuthStorage.getLang() === "en" ? "ReviewDetails text-center" : "ReviewDetailskon text-center"}>
                {AuthStorage.getLang() === "en" ?
                  <>{t("Review_Popup.Body")}</> : <>{t("Review_Popup.Body")} < br /> {t("Review_Popup.Body1")}</>
                }
              </p>
            </div>
          </div>
          <div className="text-center reviewRating">
            <Rating
              emptySymbol={
                <img src="./img/star.svg" className="start-rat" alt="" />
              }
              fullSymbol={<img src="./img/color-star.svg" className="start-rat" alt="" />}
              initialRating={stars}
              onChange={(e: any) => {
                setStars(e);
              }}
              stop={5}
            />
          </div>

          <div className={AuthStorage.getLang() === "en" ? "reviewTextarea" : "reviewTextareako"}>
            {/* <input
              // label=""
              // fromrowStyleclass=""
              name="introduction"
              value={feedback}
              maxLength={2000}
              placeholder={t("Review_Popup.Write_Review")}
              type="textarea"
              // InputstyleClass="mt-37 write-review-area"
              // lablestyleClass="font-30-bold h-40 color-dark mt-80"
              onChange={(e: any) => { setFeedback(e.target.value) }}
            /> */}
            <TextareaAutosize
              minRows={6}
              onChange={(e: any) => { setFeedback(e.target.value) }}
              name="aboutTour"
              value={feedback}
              placeholder={t("Review_Popup.Write_Review")}

              maxLength={500} />
          </div>
        </Modal.Body>
        <div className={AuthStorage.getLang() === "en" ? "reviewRatingConBtn d-flex align-items-center justify-content-between" : "reviewRatingConBtnko d-flex align-items-center justify-content-between"}>
          <div className="">

            <button
              className="reviewCancle"
              // ButtonStyle="join-cancle-btn" 
              onClick={() => { setReviewPopup(false) }}>
              {t("Review_Popup.Cancel")}
            </button>

          </div>

          <div className="">

            <button
              className="reviewSubmit"
              // ButtonStyle="join-apply-btn" 
              onClick={() => { sendReviews(); }}>
              {t("Review_Popup.Submit")}
            </button>

          </div>

        </div>
      </Modal>


      {/* Review Notice Popup */}
      <Modal
        show={reviewNot}
        onHide={() => {
          setreviewNot(false);
        }}
        dialogClassName="welcome-modal host-modal"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >

        <Modal.Body className="p-0">
          <div className={AuthStorage.getLang() === "en" ? "modal-signup-title" : "modal-signup-titleko"}>
            <h3>{t("Review_Notice.Title")}</h3>
          </div>
          <div className="accept-notice-review">
            <div className={AuthStorage.getLang() === "en" ? "acceptDetails" : "acceptDetailsko text-center"}>
              <p className="font-24-normal color-darkgray h-60">{t("Review_Notice.Body")}</p>
            </div>
          </div>
        </Modal.Body>
        <div className="w-100 mt-50">
          <div className={AuthStorage.getLang() === "en" ? "accept-noticebtnbox" : "accept-noticebtnboxko"}>
            <button
              // ButtonStyle="app-sent-ok" 
              onClick={() => { setreviewNot(false); }}>
              {t("Review_Notice.OK")}
            </button>
          </div>
        </div>
      </Modal>
      <Login
        show={modalShow}
        onHide={() => setModalShow(false)}
        onHideNew=""
        onShow=""
      />
    </>
  );
}

export default UserHostList;
