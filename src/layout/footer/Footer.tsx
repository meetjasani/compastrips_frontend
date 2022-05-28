import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RootStateOrAny, useDispatch, useSelector } from "react-redux";
import { getChatData, setChatState } from "../../redux/action/chatDataAction";
import { Badge, Container, Modal } from "react-bootstrap";
import Chat from "../../components/Chat";
import Message from "../../components/Message";
import Terms from "../../Terms&Conditions/Terms&Condition";
import PrivacyPolicy from "../../Terms&Conditions/PrivacyPolicy";


function Footer() {

    const [TermsUse, setTermsUse] = useState(false);
    const [Privacypolicy, setPrivacypolicy] = useState(false);


    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login);

    const { chatData, count, chat_open, message_open, id, otherUser } =
        useSelector((state: RootStateOrAny) => state.chatData);

    const dispatch = useDispatch();

    useEffect(() => {
        if (userData && userData.hasOwnProperty("id")) {
            dispatch(getChatData(userData?.id));
        }
    }, [userData]);

    const { t } = useTranslation();
    return (
        <>
            <div className='footer-inner'>
                <div className="ninetwenty-container ">
                    <div className='mini-container'>
                        <div className='d-flex footer-content-main'>
                            <div>
                                <img src="./img/logo-footer.svg" alt="" />
                            </div>
                            <div className='footer-content'>
                                <div className='list-of-links'>
                                    <Link to="" onClick={() => {
                                        setTermsUse(true);
                                    }}> {t("Footer.Terms_of_Use")} </Link>
                                    <p>•</p>
                                    <Link to="" onClick={() => {
                                        setPrivacypolicy(true);
                                    }}>{t("Footer.Privacy_Policy")}</Link>
                                    <p>•</p>
                                    <Link to="/inquirtPage">{t("Footer.Inquiries")}</Link>
                                    <p>•</p>
                                    <Link to="/customerService">{t("Footer.Customer_Service")}</Link>
                                </div>

                                <div className='contact-info-my'>
                                    <p>compastrips  |  {t("Footer.ceo")} : {t("Footer.Jace_Moon")}  |  {t("Footer.Business_Registration_Number")} : < a href="tel:0000000000">000-00-00000</a></p>
                                    <p>{t("Footer.Address")} : -  |  Website : <a href="" target='blank'>https://www.compastrips.io</a>  |  {t("Footer.Tel")} : < a href="tel:0000000000">0000-0000</a></p>
                                </div>

                                <div className='copy-section'>
                                    <p>Copyright © compastrips. ALL RIGHTS RESERVED.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ****** chat ****** */}
            <div className="Footer modal-footer p-0">
                {is_loggedin ? (
                    <button
                        // ButtonStyle="bg-transparent chat-widget"
                        onClick={() => dispatch(setChatState(!chat_open))}
                    >
                        <img src="./img/chaticon.svg" alt="" />
                        {count !== 0 && userData?.notification ? (
                            <Badge className="msg-badge" pill variant="danger">
                                {count}
                            </Badge>
                        ) : null}
                    </button>
                ) : null}
            </div>
            {chat_open && (
                <div>
                    <Modal
                        show={chat_open}
                        dialogClassName="allchatmodal"
                    >
                        <Modal.Title className="">
                            <div className="footerchatBox">
                                <h4 className="font-25-bold h-34 color-dark">{t("Chat.Chat")}</h4>
                                <img
                                    src="./img/closeIcon.svg"
                                    alt=""
                                    onClick={() => dispatch(setChatState(false))}
                                    className="footerClose"
                                />
                            </div>
                        </Modal.Title>
                        <Modal.Body className="p-0 mt-40">
                            <div className="chat-scroll">
                                {chatData.map((x: any) => {
                                    if (x.data.lastMessage)
                                        return <Chat data={x.data} id={x.id} />;
                                })}
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>
            )}
            {message_open && <Message id={id} data={otherUser} />}
            <Terms set={setTermsUse} value={TermsUse} />
            <PrivacyPolicy set={setPrivacypolicy} value={Privacypolicy} />

        </>
    )
}

export default Footer
