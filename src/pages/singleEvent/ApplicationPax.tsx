import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { ApiGet, ApiPut } from '../../helper/API/ApiData';
import { checkImageURL } from '../../helper/utils';
import firebase from "firebase";
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setChatId, setMessageState, setOtherUserData } from '../../redux/action/chatDataAction';
import { db } from '../../firebaseConfig';
import AuthStorage from '../../helper/AuthStorage';

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
interface user {
    age_group: string;
    avatar: string;
    dob: string;
    first_name: string;
    flag: string;
    gender: string;
    id: string;
    last_name: string;
    nationality: string;
    user_name: string;
}

interface hosting {
    participate_count: number;
    pax: number;
}

interface participanData {
    id: string;
    req_status: string;
    requested_at: string;
    hosting: hosting;
    user: user;
}

interface apiRes {
    participants: participanData[];
    participate_count: number;
    pax: number;
}

const ApplicationPax = (props: any) => {

    const { t } = useTranslation();

    const [acceptApp, SetAcceptApp] = useState(false);
    const [acceptAppNotice, SetAcceptAppNotice] = useState(false);
    const [declineApp, SetDeclinetApp] = useState(false);
    const [declineAppNotice, SetDeclineAppNotice] = useState(false);
    const [activeTab, setActiveTab] = useState("STAND_BY");
    const [participantData, setParticipantData] = useState<apiRes>({
        participants: [],
        participate_count: 0,
        pax: 0
    });
    const [id, setId] = useState("");
    const [participantID, setParticipantID] = useState<user>({
        age_group: "",
        avatar: "",
        dob: "",
        first_name: "",
        flag: "",
        gender: "",
        id: "",
        last_name: "",
        nationality: "",
        user_name: ""
    });
    const [refresh, setRefresh] = useState(false)

    const searchTab = (tab: string) => {
        setActiveTab(tab);
    }

    const getParticipants = () => {
        if (props.hostingID) {
            ApiGet(`hosting/participants/${props?.hostingID}`)
                .then((res: any) => {
                    setParticipantData(res.data);
                }
                )
        }
    }

    useEffect(() => {
        getParticipants();
    }, [activeTab, refresh, props])


    const acceptReq = (id: string) => {
        ApiPut(`hosting/acceptParticipant/${id}`, {})
            .then((res: any) => {
                SetAcceptAppBtn();
                setRefresh(!refresh);

            })

    }

    const declineReq = (id: string) => {
        ApiPut(`hosting/declineParticipant/${id}`, {})
            .then((res: any) => {
                SetDeclineAppNoticeBtn();
                setRefresh(!refresh);
                props.setRefresh(Math.random());
            })
    }

    const SetAcceptAppBtn = () => {
        SetAcceptApp(false);
        SetAcceptAppNotice(true);
    }

    const SetDeclineAppNoticeBtn = () => {
        SetDeclinetApp(false);
        SetDeclineAppNotice(true);
    }


    // Create a chat
    const dispatch = useDispatch();
    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
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


    const reqParticipants = () => {
        const filteredParticipants = participantData.participants.filter((x) => x.req_status === activeTab)
        return filteredParticipants.length ?
            (filteredParticipants.map((data, i) =>
                <div className="d-flex align-items-center chat-accept-decline-sec">
                    <div className="host d-flex  align-items-center">
                        <div>
                            <img src={data.user.avatar || "./img/Avatar.png"} alt="" style={{ width: '54px', height: '54px', borderRadius: '50%' }} />
                        </div>
                        <div className="ml-20 ApplicationMainBox">
                            <div className="d-flex img-join-host h-36">
                                <h5 className="font-20-bold color-dark mr-18 applicationUserTitel">
                                    {/* {data.user.user_name} */}
                                    {AuthStorage.getLang() === "en"
                                        ? data.user.user_name?.slice(0, 8)
                                        : data.user.user_name?.slice(0, 5)
                                    }
                                </h5>
                                &nbsp;
                                <img src={checkImageURL(data.user.nationality)} alt="flag" style={{ width: '19.98px', height: "19.98px", borderRadius: '50%' }} />
                            </div>
                            <div className="host-info mt-14 d-flex align-items-center applicationGender">
                                <div className="hots-tags">
                                    <p className="info">{data.user.gender === "MALE" ? t("Male") : t("Female")}</p>
                                </div>
                                <div className="hots-tags">
                                    <p className="info">{data.user.age_group}{t("Age_Groups")}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                        <div className="mr-48 applicationDate d-flex align-items-center">
                            <p className="font-18-normal color-dark">{t("Pax_Applications.Applied")} : {moment(data.requested_at).format("YYYY.MM.DD")}</p> &nbsp; <span></span> &nbsp;
                            <p className="font-18-normal color-dark">{t("Pax_Applications.Status")} {data.req_status === "STAND_BY" ? `${t("Pax_Applications.Standing")}` : (data.req_status === "ACCEPTED" ? `${t("Pax_Applications.Accepted")}` : `${t("Pax_Applications.Declined")}`)}</p>
                        </div>

                        <div className='ApplicationChatBox'>
                            <button
                                className='ApplicationChat'
                                // ButtonStyle="chat-btn mr-15"
                                onClick={() => {
                                    createChat(
                                        {
                                            id: userData.id,
                                            name: userData.user_name,
                                            profile_url: userData.avatar,
                                        },
                                        {
                                            id: data?.user.id,
                                            name: data?.user.user_name,
                                            profile_url: data?.user.avatar,
                                        }
                                    )
                                }}>
                                {t("Pax_Applications.Chat")}
                            </button>

                            {(data.req_status === "STAND_BY") ?
                                <button
                                    // ButtonStyle="chat-btn-border mr-15"
                                    className='ApplicationAccept'
                                    onClick={() => {
                                        setId(data.id);
                                        setParticipantID(data.user);
                                        SetAcceptApp(true);
                                    }}>
                                    {t("Pax_Applications.Accept")}
                                </button> : ""}

                            {(data.req_status === "STAND_BY") ?
                                <button
                                    className='ApplicationDecline'
                                    // ButtonStyle="chat-btn-border-danger"
                                    onClick={() => {
                                        setId(data.id);
                                        setParticipantID(data.user);
                                        SetDeclinetApp(true);
                                    }}>
                                    {t("Pax_Applications.Decline")}
                                </button> : ""}
                        </div>
                    </div>
                </div>

            )
            ) :
            (<div className="h-423 ">
                <div className="font-22-normal text-center Noapplication">
                    <p> {t("Pax_Applications.No_Application")}</p>
                </div>
            </div>)
    }

    return (
        <>
            <div className="main-container">
                <div className="main-app-box mt-80">
                    <div>
                        <h4 className="font-30-bold color-dark h-45">{t("Pax_Applications.Applications")}  ({t("Pax_Applications.Pax1")}{participantData.pax} {t("Pax_Applications.Pax2")} | {t("Pax_Applications.Vacancies1")}{participantData.pax - participantData.participate_count} {t("Pax_Applications.Vacancies2")})    </h4>
                    </div>
                    <div className="details-tabs mt-23 mb-40 h-36">

                        {
                            <>
                                <span className={activeTab === 'STAND_BY' ? "active font-24-bold cursor-p" : "font-24-bold cursor-p"} onClick={() => { searchTab('STAND_BY') }}>
                                    {t("Pax_Applications.Standing")} ({participantData?.participants?.filter((x) => x.req_status === "STAND_BY").length})
                                </span> <span className="font-26 color-gray"> | </span></>
                        }

                        {<>
                            <span className={activeTab === 'ACCEPTED' ? "active font-24-bold cursor-p" : "font-24-bold cursor-p"} onClick={() => { searchTab("ACCEPTED") }}>
                                {t("Pax_Applications.Accepted")} ({participantData?.participants?.filter((x) => x.req_status === "ACCEPTED").length})
                            </span>  <span className="font-26 color-gray"> | </span>
                        </>}


                        <span className={activeTab === 'DECLINED' ? "active font-24-bold cursor-p" : "font-24-bold cursor-p"} onClick={() => { searchTab("DECLINED") }}> {t("Pax_Applications.Declined")} ({participantData?.participants?.filter((x) => x.req_status === "DECLINED").length})</span>
                    </div>

                    {participantData?.participants?.length == 0
                        ?
                        <div className="mb-111">
                            <div className="h-423">
                                <div className="font-22-normal text-center Noapplication">
                                    <p> {t("Pax_Applications.No_Application")}</p>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="secMb111">
                            {reqParticipants()}
                        </div>
                    }

                </div>

            </div>


            <Modal
                show={acceptApp}
                onHide={() => {
                    SetAcceptApp(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="p-0">
                    <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko"}>
                        <h3>{t("Application_pax.Accept_Popup.Title")}</h3>
                    </div>
                    <div className=" app-accept-body mt-60">
                        <div className={AuthStorage.getLang() === "en" ? 'AcceptApplicationInner' : "AcceptApplicationInnerko"}>
                            {AuthStorage.getLang() === "en"
                                ?
                                <p className="text-center">

                                    &nbsp;
                                    {t("Application_pax.Accept_Popup.Body1")}
                                    <br />
                                    {AuthStorage.getLang() === "en"
                                        ? participantID.user_name?.length <= 8 ? participantID.user_name?.slice(0, 8) : participantID.user_name?.slice(0, 7) + ".."
                                        : participantID.user_name?.length <= 4 ? participantID.user_name + "님" : participantID.user_name?.slice(0, 3) + ".." + "님"
                                    }
                                    {t("Application_pax.Accept_Popup.Body2")}
                                </p>
                                :
                                <p className="text-center">
                                    {AuthStorage.getLang() === "en"
                                        ? participantID.user_name?.length <= 8 ? participantID.user_name?.slice(0, 8) : participantID.user_name?.slice(0, 7) + ".."
                                        : participantID.user_name?.length <= 4 ? participantID.user_name + "님" : participantID.user_name?.slice(0, 3) + ".." + "님"
                                    }
                                    &nbsp;
                                    {t("Application_pax.Accept_Popup.Body1")}
                                    <br />
                                    {t("Application_pax.Accept_Popup.Body2")}
                                </p>
                            }
                        </div>
                    </div>
                </Modal.Body>
                <div className={AuthStorage.getLang() === "en" ? "d-flex justify-content-between mt-40 AcceptApplicationBtn" : "d-flex justify-content-between mt-40 AcceptApplicationBtnko"}>
                    <div className="cancle">
                        <button
                            // ButtonStyle="join-cancle-btn" 
                            onClick={() => SetAcceptApp(false)}>
                            {t("Application_pax.Accept_Popup.Cancel")}
                        </button>


                    </div>

                    <div className="accept">
                        <button
                            // ButtonStyle="join-apply-btn" 
                            onClick={() => acceptReq(id)}>
                            {t("Application_pax.Accept_Popup.Accept")}
                        </button>

                    </div>

                </div>
            </Modal>

            <Modal
                show={acceptAppNotice}
                onHide={() => {
                    SetAcceptAppNotice(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="p-0">
                    <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko"}>
                        <h3>{t("Application_pax.Accept_Notice.Title")}</h3>
                    </div>
                    <div className="accept-notice mt-60">
                        <div className='AcceptNoticeInner text-center'>
                            <p className={AuthStorage.getLang() === "en" ? "acceptNoticeInnertexten" : "acceptNoticeInnertextko"}>{participantID.user_name}{t("Application_pax.Accept_Notice.Body1")}<br />{t("Application_pax.Accept_Notice.Body2")}</p>
                        </div>
                    </div>
                </Modal.Body>
                <div className={AuthStorage.getLang() === "en" ? "w-100 mt-50 AcceptNoticeBtn" : "w-100 mt-50 AcceptNoticeBtnko"}>
                    <div className="AcceptOK">
                        <button
                            // ButtonStyle="app-sent-ok"
                            onClick={() => { props.setRefresh(Math.random()); SetAcceptAppNotice(false); }}>
                            {t("Application_pax.Accept_Notice.OK")}
                        </button>
                    </div>
                </div>
            </Modal>


            <Modal
                show={declineApp}
                onHide={() => {
                    SetDeclinetApp(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="p-0">
                    <div className={AuthStorage.getLang() === "en" ? "modal-signup-title" : "modal-signup-titleko"}>
                        <h3>{t("Application_pax.Decline_Popup.Title")}</h3>
                    </div>
                    <div className=" app-accept-body mt-60">
                        <div className='DeclineContentInner'>
                            {AuthStorage.getLang() === "en" ?
                                <p className={AuthStorage.getLang() === "en" ? "text-center DeclineText" : "text-center DeclineTextko"}>


                                    &nbsp;
                                    {t("Application_pax.Decline_Popup.Body1")}
                                    <br />

                                    {AuthStorage.getLang() === "en"
                                        ? participantID.user_name?.length <= 8 ? participantID.user_name?.slice(0, 8) : participantID.user_name?.slice(0, 7) + ".."
                                        : participantID.user_name?.length <= 4 ? participantID.user_name?.slice(0, 4) + "님" : participantID.user_name?.slice(0, 3) + ".." + "님"
                                    }
                                    {t("Application_pax.Decline_Popup.Body2")}
                                </p>
                                :
                                <p className={AuthStorage.getLang() === "en" ? "text-center DeclineText" : "text-center DeclineTextko"}>

                                    {AuthStorage.getLang() === "en"
                                        ? participantID.user_name?.length <= 8 ? participantID.user_name?.slice(0, 8) : participantID.user_name?.slice(0, 7) + ".."
                                        : participantID.user_name?.length <= 4 ? participantID.user_name?.slice(0, 4) + "님" : participantID.user_name?.slice(0, 3) + ".." + "님"
                                    }
                                    &nbsp;
                                    {t("Application_pax.Decline_Popup.Body1")}
                                    <br />
                                    {t("Application_pax.Decline_Popup.Body2")}
                                </p>

                            }
                        </div>
                    </div>
                </Modal.Body>
                <div className={AuthStorage.getLang() === "en" ? "d-flex justify-content-between mt-40 DeclineBtnBox" : "d-flex justify-content-between mt-40 DeclineBtnBoxko"}>
                    <div className="Cancle">
                        <button
                            // ButtonStyle="join-cancle-btn"
                            onClick={() => SetDeclinetApp(false)}>
                            {t("Application_pax.Decline_Popup.Cancel")}
                        </button>
                    </div>

                    <div className="Decline">
                        <button
                            // ButtonStyle="join-apply-btn" 
                            onClick={() => declineReq(id)}>
                            {t("Application_pax.Decline_Popup.Decline")}
                        </button>
                    </div>

                </div>
            </Modal>


            <Modal
                show={declineAppNotice}
                onHide={() => {
                    SetDeclineAppNotice(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >

                <Modal.Body className="p-0">
                    <div className={AuthStorage.getLang() === "en" ? "modal-signup-title" : "modal-signup-titleko"}>
                        <h3>{t("Application_pax.Decline_Notice.Title")}</h3>
                    </div>
                    <div className="accept-notice mt-60">
                        <div className='text-center acceptNoticeInner'>
                            <p className={AuthStorage.getLang() === "en" ? "modal-signup-suben" : "modal-signup-subko"}>
                                {participantID.user_name}
                                {t("Application_pax.Decline_Notice.Body1")}
                                <br />
                                {t("Application_pax.Decline_Notice.Body2")}</p>
                        </div>
                    </div>
                </Modal.Body>
                <div className="w-100 mt-50">
                    <div className={AuthStorage.getLang() === "en" ? "AcceptNoticeBtn" : "AcceptNoticeBtnko"}>
                        <button
                            // ButtonStyle="app-sent-ok" 
                            onClick={() => { SetDeclineAppNotice(false); }}>
                            {t("Application_pax.Decline_Notice.OK")}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default ApplicationPax
