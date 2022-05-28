import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { ApiPostNoAuth } from '../../helper/API/ApiData';

interface Props {
    onHideForgot?: () => void,
    showForgot?: boolean,
}

const ForgotPass: React.FC<Props> = ({
    onHideForgot,
    showForgot
}) => {

    const { t } = useTranslation();

    //Reset Password ---------
    const [resetpassError, setResetpassError] = useState("");
    const [resetPassEmail, setResetPassEmail] = useState("");
    const [isResetPassSubmited, setIsResetPassSubmited] = useState(false);
    const [noUserFound, setNoUserFound] = useState("");
    const [successMsg, setSuccessMsg] = useState(false);

    const resetPassValidation = () => {
        let resetpassError = "";

        if (resetPassEmail === "") {
            resetpassError = "Enter Your Email";
        }
        setResetpassError(resetpassError);
        setNoUserFound("");

        if (!resetpassError) {
            return true;
        }
        return false;
    };

    const ResetPassword = () => {
        setIsResetPassSubmited(true);
        if (!resetPassValidation()) {
            return;
        }

        ApiPostNoAuth("user/sendForgotlink", {
            email: resetPassEmail,
        })
            .then((res: any) => {
                setSuccessMsg(true);
            })
            .catch((error) => {
                setNoUserFound("User Not Found");
            });
    };

    useEffect(() => {

        //Reset Password
        if (isResetPassSubmited) {
            resetPassValidation();
        }

    }, [resetPassEmail]);
    return (
        <Modal
            show={showForgot}
            centered
            dialogClassName="forgot-modal"
        >
            <div className='modal-close-button' onClick={onHideForgot}>
                <img src="./img/close.svg" alt="" />
            </div>

            <Modal.Body className='p-0'>
                <div className='forgot-modal-inner'>
                    <div className='custom-modal-header'>
                        <h5>{t("Reset_Password.Reset_Password")}</h5>
                    </div>

                    <div className='text-forgot-password'>
                        <p>{t("Reset_Password.Enter_registered_email")}</p>
                    </div>

                    <div className='forgot-modal-content'>
                        <div className='single-input position-relative'>
                            <label>{t("Reset_Password.Email")}</label>
                            <input
                                type='email'
                                placeholder={t("Reset_Password.Placeholder.Email")}
                                name="forgotemail"
                                value={resetPassEmail}
                                onChange={(e: any) => {
                                    setResetPassEmail(e.target.value);
                                }}
                            />
                            {resetpassError && (
                                <p className="forgot-form-error">{resetpassError}</p>
                            )}
                            {noUserFound && <p className="forgot-form-error">{noUserFound}</p>}

                            {/* <p className='forgot-form-error'>Invalid email address</p> */}
                        </div>
                        {resetPassEmail ?
                            <div className='forgot-btn-modal w-100 text-center'>
                                <button onClick={ResetPassword}> {t("Reset_Password.Send_reset_link")}{" "}</button>
                            </div> :

                            < div className='forgot-btn btn-secondary-modal w-100 text-center'>
                                <button onClick={ResetPassword}> {t("Reset_Password.Send_reset_link")}{" "}</button>
                            </div>
                        }
                        {successMsg &&
                            <div className='forgot-Sucessfull-label w-100 text-center'>
                                <label>{t("Reset_Password.Password_reset_email_sent")}{" "}
                                </label>
                            </div>
                        }
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ForgotPass