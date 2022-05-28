import React from 'react'
import { Modal } from "react-bootstrap";
import ReadMore from "../components/ReadMore";
import { useTranslation } from "react-i18next";
import { checkImageURL } from "../helper/utils";
import firebase from "firebase";
import { db } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { setChatId, setMessageState, setOtherUserData, } from "../redux/action/chatDataAction";
import { ApiGet, ApiPost } from '../helper/API/ApiData';
import { hostingList } from '../pages/viewhost/ViewHostList';
import { useHistory } from 'react-router-dom';
import AuthStorage from '../helper/AuthStorage';


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

interface props {
    hostingId?: string;
    show?: boolean;
    setShow?: any;
    data?: any;
}


const HostPro: React.FC<props> = ({ hostingId, show, setShow, data }) => {
    const dispatch = useDispatch();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login)

    const [hosting, setHosting] = useState<hostingList>();

    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [delayLike, setDelayLike] = useState(false);

    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const { chatData, message_open } = useSelector(
        (state: RootStateOrAny) => state.chatData
    );

    const history = useHistory();
    useEffect(() => {
        if (hostingId)
            getHosting(hostingId);
    }, [hostingId])

    const Like = (id: string) => {
        setIsLiked(!isLiked);
        setDelayLike(true);
        ApiPost(`user/wishlist/${id}`, {})
            .then((res: any) => {
                setDelayLike(false);
            })
            .catch((err: any) => {
            });
    };

    const getHosting = (id: string) => {
        ApiGet(`hosting/hostByHostingId/${id}`).then((res: any) => {
            setHosting(res.data);
            setIsLiked(res.data.user.like);
        });
    };


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

    //for translation
    const { t } = useTranslation();

    const onmsgClick = () => {
        setShow(false);
        createChat(
            {
                id: userData.id,
                name: userData.user_name,
                profile_url: userData.avatar,
            },
            {
                id: hosting?.user.id ?? "",
                name: hosting?.user.user_name ?? "",
                profile_url: hosting?.user.avatar ?? "",
            },

        )
    }

    const handleClick = (itinerary_id: any, hostingID: any) => {
        history.push(`/itinerary?id=${itinerary_id}&hostingId=${hostingID}`)
    }
    return (
        <div>
            <Modal
                show={show}
                onHide={() => {
                    setShow(false);
                }}
                dialogClassName="welcome-modal host-modal-pro"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="p-0 host-popup-header" closeButton></Modal.Header>
                <Modal.Body className="p-0">
                    <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko "}>
                        <h3>{t("Host_Profile_Popup.Title")}</h3>
                    </div>
                    <div className="custom-border-b mt-40"></div>

                    {hosting && (
                        <>
                            {AuthStorage.getLang() === "en" ?

                                <div className="w-100 mt-33">
                                    <div className={AuthStorage.getLang() === "en" ? "host d-flex" : "hostko d-flex"}>

                                        <div className='user-local-host'>
                                            <div className='single-local-host-inner'>
                                                <div className='single-local-host-profile'>
                                                    <img src={hosting.user?.avatar || "./img/Avatar.png"} alt="" className='HostProfileImg' />
                                                    <div className={AuthStorage.getLang() === "en" ? 'pro-tag-name' : "pro-tag-nameko"}>
                                                        <div className="popup-sushname align-items-center d-flex justify-content-between">
                                                            <div className='d-flex align-items-center'>
                                                                <h3 className="userName">
                                                                    {hosting.user?.user_name.length >= 36
                                                                        ? hosting.user?.user_name.slice(0, 36) + ".."
                                                                        : hosting.user?.user_name}
                                                                </h3>
                                                                &nbsp;
                                                                <img src={checkImageURL(hosting.user?.flag)} alt="flag" style={{ width: '22px', height: '20px' }} />
                                                            </div>

                                                            {is_loggedin &&


                                                                <div className="d-flex join-pro ml-auto">
                                                                    {hosting?.user.id !== userData.id &&
                                                                        <div className="join-msgaaa" >
                                                                            <img
                                                                                src="./img/msg.svg" alt=""
                                                                                className='msgicon'
                                                                                onClick={() =>
                                                                                    onmsgClick()

                                                                                }

                                                                            />
                                                                        </div>
                                                                    }

                                                                    <div className="tout-created ml-auto">
                                                                        <div className="download-heart-icon button">
                                                                            <div className="heart-div">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id="id2"
                                                                                    checked={isLiked}
                                                                                    disabled={delayLike}
                                                                                    onClick={() => Like(hosting?.user.id)}
                                                                                    className="instruments"
                                                                                />
                                                                                <label
                                                                                    htmlFor="id2"
                                                                                    className="text-white check mb-0"
                                                                                >
                                                                                    {!isLiked &&
                                                                                        <img src="./img/Favourite.png" alt="" className='favorite' style={{ cursor: 'pointer' }} />
                                                                                    }
                                                                                </label>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                            }
                                                        </div>

                                                        <div className="host-mainTag mt-14">
                                                            <div
                                                                className={
                                                                    hosting.hosting.type === "Local"
                                                                        ? "local-host-bg hots-tags"
                                                                        : "travel-host-bg hots-tags"
                                                                }
                                                            >
                                                                <p className="info">{hosting.hosting.type === "Local" ? t("Local_Host") : t("Traveler_Host")}</p>
                                                            </div>
                                                            <div className="hots-gender">
                                                                <p className="">{hosting.user?.gender === "MALE" ? t("Male") : t("Female")}</p>
                                                            </div>
                                                            <div className="hots-age">
                                                                <p className=''>{AuthStorage.getLang() === "en" ? <p>{hosting.user?.age}'{t("Age_Groups")}</p> : <p className="d-flex align-items-center justify-content-center">{hosting.user?.age}<span>{t("Age_Groups")}</span></p>}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='custom-border'></div>
                                        </div>
                                    </div>
                                </div>

                                :

                                <div className="w-100 mt-33">
                                    <div className="hostko d-flex align-items-center">

                                        <div className='user-local-host'>
                                            <div className='single-local-host-inner'>
                                                <div className='single-local-host-profile'>
                                                    <img src={hosting.user?.avatar || "./img/Avatar.png"} alt="" className='HostProfileImg' />
                                                    <div className="pro-tag-nameko">
                                                        <div className="popup-sushnameko align-items-center d-flex justify-content-between">
                                                            <div className='d-flex align-items-center'>
                                                                <h3 className="userName">
                                                                    {hosting.user?.user_name.length >= 36
                                                                        ? hosting.user?.user_name.slice(0, 36) + ".."
                                                                        : hosting.user?.user_name}
                                                                </h3>
                                                                &nbsp;
                                                                <img src={checkImageURL(hosting.user?.flag)} alt="flag" style={{ width: '22px', height: '20px' }} />
                                                            </div>


                                                        </div>



                                                        <div className="host-mainTag mt-14 d-flex align-items-center">
                                                            <div
                                                                className={
                                                                    hosting.hosting.type === "Local"
                                                                        ? "local-host-bgko hots-tags"
                                                                        : "travel-host-bgko hots-tags"
                                                                }
                                                            >
                                                                <p className="info">{hosting.hosting.type === "Local" ? t("Local_Host") : t("Traveler_Host")}</p>
                                                            </div>
                                                            <div className="hots-gender">
                                                                <p className="">{hosting.user?.gender === "MALE" ? t("Male") : t("Female")}</p>
                                                            </div>
                                                            <div className="hots-age">
                                                                <p className=''>{AuthStorage.getLang() === "en" ? <p>{hosting.user?.age}'{t("Age_Groups")}</p> : <p className="d-flex align-items-center justify-content-center">{hosting.user?.age}<span>{t("Age_Groups")}</span></p>}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className='custom-border'></div>
                                        </div>

                                        <>

                                            {is_loggedin &&


                                                <div className="d-flex join-pro ml-auto">
                                                    {hosting?.user.id !== userData.id &&
                                                        <div className="join-msgaaa" >
                                                            <img
                                                                src="./img/msg.svg" alt=""
                                                                className='msgicon'
                                                                onClick={() =>
                                                                    onmsgClick()

                                                                }
                                                                style={{ width: '29px', height: '32px', marginRight: '26px', borderRadius: '0px', cursor: 'pointer' }}
                                                            />
                                                        </div>
                                                    }

                                                    <div className="tout-created ml-auto">
                                                        <div className="download-heart-icon button">
                                                            <div className="heart-div">
                                                                <input
                                                                    type="checkbox"
                                                                    id="id2"
                                                                    checked={isLiked}
                                                                    disabled={delayLike}
                                                                    onClick={() => Like(hosting?.user.id)}
                                                                    className="instruments"
                                                                />
                                                                <label
                                                                    htmlFor="id2"
                                                                    className="text-white check mb-0"
                                                                >
                                                                    {!isLiked &&
                                                                        <img src="./img/Favourite.png" alt="" className='favorite' style={{ cursor: 'pointer' }} />
                                                                    }
                                                                </label>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            }
                                        </>



                                    </div>

                                    <div className='borderCustom'></div>
                                </div>

                            }
                            {AuthStorage.getLang() === "en" ?
                                <div className="userImgContent" onClick={() => handleClick(hosting.itinerary.id, hostingId)}>

                                    <div className="NewHostingtitle">
                                        <p >
                                            {t("Host_Profile_Popup.Now_Hosting")}
                                        </p>
                                    </div>

                                    <div className="mt-24 d-flex mainProfile">
                                        <div className="mr-50 host-profile-modal">
                                            <img src={hosting.course.image} alt="" />
                                        </div>
                                        <div className='modalImageContent'>
                                            <h3 className="font-20-bold color-black h-24">
                                                {" "}
                                                {hosting.itinerary.title}
                                            </h3>
                                            <p className="modalcountryname">
                                                {" "}
                                                @ {hosting.itinerary.region} , {hosting.itinerary.country}
                                            </p>
                                            <p className="CountryReview">
                                                ★ {hosting.review.star}｜{" "}
                                                {t("Host_Profile_Popup.Reviews1")}
                                                {hosting.review.review}
                                                {t("Host_Profile_Popup.Reviews2")}
                                                <span className='onlyheart'>
                                                    <img src="./img/onlyheart.svg" alt="" />
                                                    {hosting.review.like}{" "}
                                                </span>{" "}
                                            </p>
                                            <div className="loaction">
                                                <h6 className="font-18-normal color-black ls-one mb-0">
                                                    <ReadMore>
                                                        {/* {hosting.course.courses.map((x: any, i: number) => {
                                                        return `${i + 1}. ${x} `;
                                                    })} */}
                                                        <span>1.</span>  {hosting.course.courses.toString().slice(0, 22).replace(",", " 2.")} <span>...</span>
                                                    </ReadMore>
                                                </h6>

                                            </div>
                                        </div>


                                    </div>

                                    <div className='d-flex align-itmes-center justify-content-between date-time'>
                                        <p className="date">
                                            {hosting.hosting.date.replaceAll("-", ".")}{" "}
                                            {hosting.hosting.start.slice(0, 5)}
                                            {" - "}
                                            {hosting.hosting.end.slice(0, 5)}
                                        </p>
                                        <h1 className="pax-font">
                                            {t("Host_Own.pax1")}
                                            <span className="blue-font">
                                                <label>
                                                    {hosting.hosting.participate_count}
                                                </label>
                                                {t("Host_Own.pax3")}
                                            </span>
                                            /{hosting.hosting.pax}
                                            {t("Host_Own.pax3")} {t("Host_Own.pax2")}
                                        </h1>
                                    </div>
                                </div>
                                :
                                <div className="userImgContentko" onClick={() => handleClick(hosting.itinerary.id, hostingId)}>

                                    <div className="NewHostingtitleko">
                                        <p >
                                            {t("Host_Profile_Popup.Now_Hosting")}
                                        </p>
                                    </div>

                                    <div className="mt-24 d-flex mainProfileko">
                                        <div className="mr-50 host-profile-modalko">
                                            <img src={hosting.course.image} alt="" />
                                        </div>
                                        <div className='modalImageContent'>
                                            <h3 className="font-20-bold color-black h-24">
                                                {" "}
                                                {hosting.itinerary.title}
                                            </h3>
                                            <p className="modalcountryname">
                                                {" "}
                                                @ {hosting.itinerary.region} , {hosting.itinerary.country}
                                            </p>
                                            <p className="CountryReview">
                                                ★ {hosting.review.star}｜{" "}
                                                {t("Host_Profile_Popup.Reviews1")}
                                                {hosting.review.review}
                                                {t("Host_Profile_Popup.Reviews2")}
                                                <span className='onlyheart'>
                                                    <img src="./img/onlyheart.svg" alt="" />
                                                    {hosting.review.like}{" "}
                                                </span>{" "}
                                            </p>
                                            <div className="loaction">
                                                <h6 className="font-18-normal color-black ls-one mb-0">
                                                    <ReadMore>
                                                        {/* {hosting.course.courses.map((x: any, i: number) => {
                return `${i + 1}. ${x} `;
            })} */}
                                                        <span>1.</span>  {hosting.course.courses.toString().slice(0, 22).replace(",", " 2.")} <span>...</span>
                                                    </ReadMore>
                                                </h6>

                                            </div>
                                        </div>


                                    </div>

                                    <div className='d-flex align-itmes-center justify-content-between date-timeko'>
                                        <p className="date">
                                            {hosting.hosting.date.replaceAll("-", ".")}{" "}
                                            {hosting.hosting.start.slice(0, 5)}
                                            {" - "}
                                            {hosting.hosting.end.slice(0, 5)}
                                        </p>
                                        <h1 className="pax-font">
                                            {t("Host_Own.pax1")}
                                            <span className="blue-font">
                                                <label>
                                                    {hosting.hosting.participate_count}
                                                </label>
                                                {t("Host_Own.pax3")}
                                            </span>
                                            /{hosting.hosting.pax}
                                            {t("Host_Own.pax3")} {t("Host_Own.pax2")}
                                        </h1>
                                    </div>
                                </div>
                            }

                        </>
                    )}
                </Modal.Body >
            </Modal >
        </div >
    )
}

export default HostPro


