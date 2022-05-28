import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import STORAGEKEY from '../../config/APP/app.config';
import { ApiPost } from '../../helper/API/ApiData';
import AuthStorage from '../../helper/AuthStorage';
import { changeLoginState } from '../../redux/action/loginAction';
import { getUserData } from '../../redux/action/userDataAction';
import ForgotPass from './ForgotPass';
import Signup from './Signup';

interface Props {
    onHide?: () => void,
    show?: boolean,
    onHideNew: any,
    onShow: any
}

interface loginFormState {
    email: string;
    password: string;
}
const Login: React.FC<Props> = ({
    onHide,
    show,
    onHideNew,
    onShow
}) => {

    const loginCredential: loginFormState = {
        email: "",
        password: "",
    };

    const login_Err = {
        emailError: "",
        emailFormatErr: "",
        passError: "",
    };

    const { t } = useTranslation();
    const [statelogin, setStatelogin] = useState(loginCredential);
    const [loginErrors, setLoginErrors] = useState(login_Err);
    const [keepMeLogin, setKeepMeLogin] = useState(false);
    const [saveEmail, setSaveEmail] = useState(false);
    const [incorrectPass, setIncorrectPass] = useState("");
    const [invalidEmail, setInvalidEmail] = useState("");
    const [forgotModal, setForgotModal] = useState(false);
    const [signupModal, setSignupModal] = useState(false);

    const dispatch = useDispatch();
    const history = useHistory();

    const onHideLogin = () => {
        setForgotModal(true);
        onHideNew(false)
    }

    const onHideSignup = () => {
        setSignupModal(true);
        onHideNew(false)
    }
    const loginValidation = () => {
        let flag = true
        let login_Err = {
            emailError: "",
            emailFormatErr: "",
            passError: "",
        };

        const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

        if (statelogin.email && !validEmail.test(statelogin.email)) {
            login_Err.emailFormatErr = `${t("logIn.Errors.InvalidEmail")}`;
            flag = false
        }

        if (statelogin.email === "") {
            login_Err.emailError = `${t("logIn.Errors.Email")}`;
            flag = false
        }

        if (statelogin.password === "") {
            login_Err.passError = `${t("logIn.Errors.Password")}`;
            flag = false
        }

        setLoginErrors(login_Err);
        setIncorrectPass("");

        return flag;
    };

    useEffect(() => {
        setLocalEmail();
    }, []);

    //For Save Email Functionality in Login Part
    const setLocalEmail = () => {
        const email = AuthStorage.getStorageData(STORAGEKEY.email);
        if (email) {
            setStatelogin({
                ...statelogin,
                email: email
            })
        }
    }

    const login = () => {
        if (!loginValidation()) {
            return;
        }

        ApiPost("user/auth/login", {
            email: statelogin.email,
            password: statelogin.password,
        })
            .then((res: any) => {

                setStatelogin(loginCredential);

                if (saveEmail) {
                    AuthStorage.setStorageData(STORAGEKEY.email, statelogin.email, true);
                } else {
                    AuthStorage.deleteKey(STORAGEKEY.email)
                }

                AuthStorage.setStorageData(
                    STORAGEKEY.token,
                    res.data.token,
                    keepMeLogin
                );
                delete res.data.token;
                AuthStorage.setStorageJsonData(
                    STORAGEKEY.userData,
                    res.data,
                    keepMeLogin
                );
                dispatch(changeLoginState(true))
                dispatch(getUserData())
                history.push("/");
                onHideNew(false);
            })
            .catch((error) => {
                if (error === "Wrong Email") {
                    setIncorrectPass("")
                    setInvalidEmail(`${t('logIn.Errors.InvalidEmail')}`);
                }

                if (error === "Wrong Password") {
                    setInvalidEmail("")
                    setIncorrectPass(`${t("logIn.Errors.IncorrectPass")}`);
                }
            });

        // });

    }
    const closeSignup = () => {
        setSignupModal(false)
    }
    return (

        <>

            <Modal
                show={show}
                centered
                dialogClassName="login-modal"
            >

                <div className='modal-close-button' onClick={onHide}>
                    <img src="./img/close.svg" alt="" />
                </div>

                <Modal.Body className='p-0'>
                    <div className='login-modal-inner'>
                        <div className='custom-modal-header'>
                            <h5>{t("logIn.Log_In")}</h5>
                        </div>

                        <div className='login-modal-content'>
                            <div className='single-input position-relative'>
                                <label>{t("logIn.Email")}</label>
                                <input
                                    type='email'
                                    placeholder={t("logIn.Placeholder.Email")}
                                    name="email"
                                    onChange={(e) => {
                                        setLoginErrors({
                                            ...loginErrors,
                                            emailError: "",
                                            emailFormatErr: ""

                                        });
                                        setInvalidEmail("");
                                        setStatelogin({ ...statelogin, email: e.target.value })
                                    }
                                    }
                                    value={statelogin.email}
                                />
                                {loginErrors.emailError && (
                                    <p className="login-form-error">
                                        {loginErrors.emailError}
                                    </p>
                                )}
                                {loginErrors.emailFormatErr && (
                                    <p className="login-form-error">
                                        {loginErrors.emailFormatErr}
                                    </p>
                                )}
                                {!loginErrors.emailError && !loginErrors.emailFormatErr && invalidEmail && (
                                    <p className="login-form-error">{invalidEmail}</p>
                                )}
                                {/* {!loginErrors.emailError &&
                                !loginErrors.emailFormatErr &&
                                invalidEmail && (
                                    <p className="login-form-error">{invalidEmail}</p>
                                )} */}
                                {/* <p className='login-form-error'>Invalid email address</p> */}
                            </div>
                            <div className='single-input password-input position-relative'>
                                <label>{t("logIn.Password")}</label>
                                <input
                                    type='password'
                                    placeholder={t("logIn.Placeholder.Password")}
                                    value={statelogin.password}
                                    onChange={(e) => {
                                        setLoginErrors({
                                            ...loginErrors,
                                            passError: ""
                                        });
                                        setIncorrectPass("");
                                        setStatelogin({ ...statelogin, password: e.target.value })
                                    }
                                    }
                                />
                                {loginErrors.passError && (
                                    <p className="login-form-error">
                                        {loginErrors.passError}
                                    </p>
                                )}
                                {!loginErrors.passError && incorrectPass && <p className="login-form-error">{incorrectPass}</p>}
                                {/* {!loginErrors.passError && incorrectPass && (
                                <p className="log-error">{incorrectPass}</p>
                            )} */}
                                {/* <p className='login-form-error'>Incorrect password</p> */}
                            </div>
                            <div className='login-radio-row'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <label className="container-checkbox">{t("logIn.Keep_me_signin")}
                                        <input type="checkbox"
                                            onChange={(e: any) => {
                                                setKeepMeLogin(true);
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                    <label className="container-checkbox">{t("logIn.Save_email_add")}
                                        <input type="checkbox"
                                            onChange={(e: any) => {
                                                setSaveEmail(true);
                                            }}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                            </div>
                            <div className='login-forgot-password w-100 text-center'>
                                <button onClick={() => { onHideLogin() }}> {t("logIn.Forgot_Password")}</button>
                            </div>
                            <div className='login-btn-modal w-100 text-center'>
                                <button onClick={login}> {t("logIn.Log_In")}</button>
                            </div>
                            <div className='have-account-row'>
                                <p>{t("logIn.Dont_have_acc")}<span className='cursor-pointer' onClick={() => { onHideSignup() }}>  {t("signUp.Sign_Up")} </span></p>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>


            <ForgotPass
                showForgot={forgotModal}
                onHideForgot={() => setForgotModal(false)}
            />

            <Signup
                showSignup={signupModal}
                onHideSignup={() => setSignupModal(false)}
                onShow={onShow}
                // onHideSignnew={() => setSignupModal(false)}
                onHideSignnew={closeSignup}

            />
        </>
    )
}

export default Login