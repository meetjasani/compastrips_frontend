import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import Select from 'react-select';
import { ApiGetNoAuth, ApiPostNoAuth } from '../../helper/API/ApiData';
import AuthStorage from '../../helper/AuthStorage';
import Policy from './Policy';
import Terms from './Terms';
import Welcome from './Welcome';

interface selectOption {
    value: string;
    label: string;
}

interface countryRes {
    data: any;
    message: string;
    status: number;
}
interface Props {
    onHideSignup?: () => void,
    showSignup?: boolean,
    onShow: any,
    onHideSignnew: any

}

const Signup: React.FC<Props> = ({
    onHideSignup,
    showSignup,
    onShow,
    onHideSignnew
}) => {

    const resetForm = {
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        nationality: "",
        gender: "",
        bDay: "",
        bMonth: "",
        bYear: "",
        countryCode: "",
        verificationCode: "",
        agreeTerms: false,
        tremsOfUse: false,
    };

    const resetFormError = {
        firstNameError: "",
        lastNameError: "",
        userNameError: "",
        emailError: "",
        passwordError: "",
        confirmPassError: "",
        phoneNumberError: "",
        nationalityError: "",
        genderError: "",
        bDayError: "",
        countryCodeError: "",
        verificationError: "",
        bMonthError: "",
        bYearError: "",
        agreeTerms: "",
    };
    const { t } = useTranslation();

    const genderoptions = [
        { value: "MALE", label: t("signUp.Placeholder.Male") },
        { value: "FEMALE", label: t("signUp.Placeholder.Female") },
    ];

    const [state, setState] = useState(resetForm);
    const [formError, setFormError] = useState(resetFormError);

    const [sendVCode, setSendVCode] = useState(false);
    const [signuppopup, setsignuppopup] = useState(false);
    const [welcome, setwelcome] = useState(false);
    const [userName, setUserName] = useState("");

    const [nationality, setNationality] = useState<selectOption[]>([]);
    const [countryCode, setCountryCode] = useState<selectOption[]>([]);

    const [terms, setTerms] = useState(false);
    const [termsOfUse, settermsOfUse] = useState(false);
    const [privacyAndCookis, setPrivacyAndCookis] = useState(false);

    const [isSubmited, setIsSubmited] = useState(false);
    const [isVerified, setIsVerified] = useState(false);

    //Count Down Timer
    const [start, setStart] = useState(false);
    const [otpErr, setOtpErr] = useState("");
    const [incorrectOTP, setIncorrectOTP] = useState("");
    const [showCountDown, setShowCountDown] = useState(false)

    const [welcomeModal, setWelcomeModal] = useState(false);
    const [termsModal, setTermsModal] = useState(false);
    const [policyModal, setPolicyModal] = useState(false);

    const [over, setOver] = useState(false);
    const [[m, s], setTime] = useState([parseInt("3"), parseInt("0")]);

    const tick = () => {
        if (over) return;
        if (m === 0 && s === 0) {
            setOver(true);
            setOtpErr(`${t('signUp.Errors.Time_excede')}`);
        } else if (s === 0) {
            setTime([m - 1, 59]);
        } else {
            setTime([m, s - 1]);
        }
    };

    // const reset = () => {
    //     setTime([parseInt("3"), parseInt("0")]);
    //     setOver(false);
    // };

    useEffect(() => {
        if (start) {
            const timerID = setInterval(() => tick(), 1000);
            return () => clearInterval(timerID);
        }
    });

    const [termPopup, setTermPopup] = useState(false);
    const [privacyPolicy, setPrivacyPolicy] = useState(false);

    const validateForm = () => {

        let errors = {
            firstNameError: "",
            lastNameError: "",
            userNameError: "",
            emailError: "",
            passwordError: "",
            confirmPassError: "",
            phoneNumberError: "",
            nationalityError: "",
            genderError: "",
            bDayError: "",
            countryCodeError: "",
            verificationError: "",
            bMonthError: "",
            bYearError: "",
            agreeTerms: "",
        };

        if (!state.firstName) {
            errors.firstNameError = `${t("signUp.Errors.First_Name")}`;
        }
        if (!state.lastName) {
            errors.lastNameError = `${t("signUp.Errors.Last_Name")}`;
        }

        if (!state.userName) {
            errors.userNameError = `${t("signUp.Errors.Username")}`;
        }


        const validEmail: any = new RegExp("^[a-z0-9._:$!%-]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");

        if (!validEmail.test(state.email)) {
            errors.emailError = `${t("signUp.Errors.Email")}`;
        }

        const validPassword: any = new RegExp(
            "^(?=.*[a-z])(?=.*[0-9])(?=.{8,16})"
        );

        if (!validPassword.test(state.password)) {
            errors.passwordError = `${t("signUp.Errors.Password")}`;
        }

        if (state.password !== state.confirmPassword) {
            errors.confirmPassError = `${t("signUp.Errors.Confirm_Password")}`;
        }

        if (!state.confirmPassword) {
            errors.confirmPassError = `${t("signUp.Errors.Confirm_Password")}`;
        }

        if (!state.phoneNumber) {
            errors.phoneNumberError = `${t("signUp.Errors.Phone_Number")}`;
        }

        if (!state.nationality) {
            errors.nationalityError = `${t("signUp.Errors.Country")}`;
        }

        if (!state.gender) {
            errors.genderError = `${t("signUp.Errors.Gender")}`;
        }

        if (!state.bDay) {
            errors.bDayError = `${t("signUp.Errors.DOB")}`;
        }

        if (!state.bMonth) {
            errors.bMonthError = `${t("signUp.Errors.DOB")}`;
        }

        if (!state.bYear) {
            errors.bYearError = `${t("signUp.Errors.DOB")}`;
        }

        if (!state.countryCode) {
            errors.countryCodeError = "Select country code";
        }

        if (!isVerified || !state.verificationCode) {
            errors.verificationError = `${t("signUp.Errors.Phone_Number")}`;
        }

        if (isVerified) {
            errors.verificationError = "";
        }

        if (!terms) {
            errors.agreeTerms = `${t('signUp.Errors.TermErr')}`;
        }

        setFormError(errors);

        if (
            !errors.firstNameError &&
            !errors.lastNameError &&
            !errors.userNameError &&
            !errors.emailError &&
            !errors.passwordError &&
            !errors.confirmPassError &&
            !errors.phoneNumberError &&
            !errors.nationalityError &&
            !errors.genderError &&
            !errors.bDayError &&
            !errors.verificationError &&
            !errors.confirmPassError &&
            !errors.agreeTerms
        ) {
            return true;
        }

        return false;
    }
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        })
    };




    // Calander Dropdown
    const months = [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "4", label: "4" },
        { value: "5", label: "5" },
        { value: "6", label: "6" },
        { value: "7", label: "7" },
        { value: "8", label: "8" },
        { value: "9", label: "9" },
        { value: "10", label: "10" },
        { value: "11", label: "11" },
        { value: "12", label: "12" },
    ];

    //For year list
    const [years, setYears] = useState([{}])
    const getYears = () => {
        const currentYear = new Date().getFullYear();
        let years = [];
        for (let i = currentYear; i >= (currentYear - 100); i--) {
            years.push({ value: i.toString(), label: i.toString() })
        }
        setYears(years)
    }

    //For date list
    const [days, setDays] = useState<selectOption[]>([])

    const getDays = () => {

        let lastDate = new Date(+state.bYear, +state.bMonth, 0).getDate();

        let monthsDeys = []
        for (let i = 1; i <= lastDate; i++) {
            monthsDeys.push({ value: i.toString(), label: i.toString() })
        }
        setDays(monthsDeys);
    }

    useEffect(() => {
        setDays([])
        setState({
            ...state,
            bDay: "",
        })

        if (!state.bMonth || !state.bYear) {
            return
        }

        getDays();
    }, [state.bMonth, state.bYear])

    useEffect(() => {
        getCountryData();
        getYears();
        // setLocalEmail();

    }, []);

    const reset = () => {
        setTime([parseInt("3"), parseInt("0")]);
        setOver(false);
    };

    //------------------

    // OTP Send
    const sendOTP = () => {
        setSendVCode(true);
        setShowCountDown(true);
        setStart(true);
        setOtpErr("");
        reset();
        ApiPostNoAuth("user/otp-send", {
            mobile: state.countryCode + state.phoneNumber,
        });
    }

    //For Terms and Condition
    const changeTerm = (type: string) => {
        if (type === 'terms') {
            if (terms === false) {
                setTerms(true)
                settermsOfUse(true);
                setPrivacyAndCookis(true);
            } else {
                setTerms(false)
                settermsOfUse(false);
                setPrivacyAndCookis(false);
            }
        }
        if (type === 'termsOfUse') {
            if (termsOfUse === false) {
                settermsOfUse(true)
            } else {
                settermsOfUse(false)
                setTerms(false)
            }
        }
        if (type === 'privacyAndCookis') {
            if (privacyAndCookis === false) {
                setPrivacyAndCookis(true)
            } else {
                setPrivacyAndCookis(false)
                setTerms(false)
            }
        }
    }

    useEffect(() => {
        if (isVerified) {
            validateForm();
        }
    }, [isVerified])

    //Mobile Number Verification
    const mobileVerification = () => {
        ApiPostNoAuth("user/otp-verify", {
            mobile: state.countryCode + state.phoneNumber,
            code: state.verificationCode,
        })
            .then((res) => {
                setIncorrectOTP("");
                setIsVerified(true);
                setOver(true);
                setShowCountDown(false);
            })
            .catch((error) => {
                setIncorrectOTP(error);
                // setOver(true);
            });
    };

    //Sign Up---------
    const SignUp = async () => {
        setIsSubmited(true);
        // debugger
        if (!validateForm()) {
            return;
        }
        ApiPostNoAuth("user/auth/signup", {
            first_name: state.firstName,
            last_name: state.lastName,
            user_name: state.userName,
            email: state.email,
            password: state.password,
            gender: state.gender,
            nationality: state.nationality,
            mobile: `${state.countryCode} ${state.phoneNumber}`,
            dob: `${state.bYear}-${state.bMonth}-${state.bDay}`,
            is_verified: isVerified,
        })
            .then((res) => {
                setUserName(state.userName);
                setState(resetForm);
                setwelcome(true);
                setsignuppopup(false);
                setFormError(resetFormError);
                setIsVerified(false);
                setSendVCode(false);
                setWelcomeModal(true);
                onHideSignnew()

            })

            .catch((error) => {
                setIsVerified(false);
            });
    };
    //---------

    //Country Data
    const getCountryData = async () => {
        try {
            const res = (await ApiGetNoAuth("general/country")) as countryRes;

            setNationality(
                res.data.map((x: any) => {
                    return {
                        value: x.name,
                        label: x.name,
                    };
                })
            );
            setCountryCode(
                res.data.map((x: any) => {
                    return {
                        value: `${x.code.toString()}`,
                        label: `(${x.code.toString()}) ${x.name}`,
                    };
                })
            );
        } catch (error) {
            console.log(error);
        }
    };
    //---------------

    const goLoging = () => {
        onShow()
        onHideSignnew()
    }

    const hideWelcom = () => {
        setWelcomeModal(false)
    }

    return (
        <>
            <Modal
                show={showSignup}
                centered
                dialogClassName="signup-modal"
            >
                <div className='modal-close-button' onClick={onHideSignup}>
                    <img src="./img/close.svg" alt="" />
                </div>

                <Modal.Body className='p-0'>
                    <div className='signup-modal-inner'>
                        <div className='custom-modal-header'>
                            <h5>{t("signUp.Sign_Up")}</h5>
                        </div>
                        <div className='signup-modal-content'>
                            <div className='single-input position-relative'>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <div className='position-relative'>
                                        <label>{t("signUp.Name")}</label>
                                        <div className='two-inputs'>
                                            <input
                                                type='text'
                                                placeholder={t("signUp.Placeholder.First_Name")}
                                                value={state.firstName}
                                                name="firstName"
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                }}
                                            />
                                        </div>
                                        {isSubmited && formError.firstNameError && (
                                            <p className="signup-form-error">
                                                {formError.firstNameError}
                                            </p>
                                        )}
                                        {/* <p className='signup-form-error'>Enter your first name</p> */}
                                    </div>
                                    <div className='position-relative'>
                                        <label></label>
                                        <div className='two-inputs'>
                                            <input
                                                type='text'
                                                placeholder={t("signUp.Placeholder.Last_Name")}
                                                value={state.lastName}
                                                name="lastName"
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                }}
                                            />
                                        </div>
                                        {isSubmited && formError.lastNameError && (
                                            <p className="signup-form-error">
                                                {formError.lastNameError}
                                            </p>
                                        )}
                                        {/* <p className='signup-form-error'>Enter your last name</p> */}
                                    </div>
                                </div>
                            </div>
                            <div className='single-input position-relative'>
                                <label>{t("signUp.Username")}</label>
                                <input
                                    type='text'
                                    placeholder={t("signUp.Placeholder.Username")}
                                    value={state.userName}
                                    name='userName'
                                    onChange={(e: any) => {
                                        handleChange(e);
                                    }}
                                />
                                {isSubmited && formError.userNameError && (
                                    <p className={`${AuthStorage.getLang() == 'en' ? ' password-two-error' : ''} login-form-error`}>
                                        {formError.userNameError}
                                    </p>
                                )}
                                {/* <p className='login-form-error'>Enter your username</p> */}
                            </div>
                            <div className='single-input position-relative'>
                                <label>{t("signUp.Email")}</label>
                                <input
                                    type='email'
                                    placeholder={t("signUp.Placeholder.Email")}
                                    value={state.email}
                                    name="email"
                                    onChange={(e: any) => {
                                        handleChange(e);
                                    }}
                                />
                                {isSubmited && formError.emailError && (
                                    <p className="login-form-error ">
                                        {formError.emailError}
                                    </p>
                                )}
                                {/* <p className='login-form-error'>Enter a valid email address</p> */}
                            </div>
                            <div className='single-input position-relative'>
                                <label>{t("signUp.Password")}</label>
                                <input type='password'
                                    placeholder={t("signUp.Placeholder.Password")}
                                    value={state.password}
                                    name="password"
                                    onChange={(e: any) => {
                                        handleChange(e);
                                    }}
                                />
                                {isSubmited && formError.passwordError && (
                                    <p className={`${AuthStorage.getLang() == 'en' ? ' password-two-error' : ''} login-form-error`}>
                                        {formError.passwordError}
                                    </p>
                                )}
                                {/* <p className='login-form-error password-two-error'>Password must be between 8-16 characters and a combination of letters and numbers</p> */}
                            </div>
                            <div className='single-input position-relative'>
                                <label>{t("signUp.Confirm_Password")}</label>
                                <input
                                    type='password'
                                    placeholder={t("signUp.Placeholder.Confirm_Password")}
                                    value={state.confirmPassword}
                                    name="confirmPassword"
                                    onChange={(e: any) => {
                                        handleChange(e);
                                    }}
                                />
                                {isSubmited && formError.confirmPassError && (
                                    <p className="login-form-error">
                                        {formError.confirmPassError}
                                    </p>
                                )}
                                {/* <p className='login-form-error'>Password does not match</p> */}
                            </div>

                            <div className='single-input dropdown-signup position-relative'>
                                <label>{t("signUp.Country")}</label>
                                <Select
                                    // options={nationalitydropdown}
                                    options={nationality}
                                    name="nationality"
                                    placeholder={t("signUp.Placeholder.Country")}
                                    isSearchable={false}
                                    onChange={(e: any) =>
                                        setState({
                                            ...state,
                                            nationality: e.value,
                                        })
                                    }

                                />
                                {isSubmited && formError.nationalityError && (
                                    <p className="login-form-error">
                                        {formError.nationalityError}
                                    </p>
                                )}
                                {/* <p className='login-form-error'>Select your nationality</p> */}
                            </div>

                            <div className='single-input dropdown-signup position-relative'>
                                <label>{t("signUp.Gender")}</label>
                                <Select
                                    options={genderoptions}
                                    name="gender"
                                    isSearchable={false}
                                    placeholder={t("signUp.Placeholder.Gender")}
                                    onChange={(e: any) =>
                                        setState({
                                            ...state,
                                            gender: e.value,
                                        })
                                    }

                                />
                                {isSubmited && formError.genderError && (
                                    <p className="login-form-error">{formError.genderError}</p>
                                )}
                                {/* <p className='login-form-error'>Select your gender</p> */}
                            </div>

                            <div className='single-input dropdown-signup position-relative'>
                                <label>{t("signUp.DOB")}</label>
                                <div className='d-flex align-items-center justify-content-between  date-of-birth'>
                                    <Select
                                        name="bYear"
                                        // select={state.bYear}
                                        options={years}
                                        placeholder="YYYY"
                                        isSearchable={false}
                                        onChange={(e: any) =>
                                            setState({
                                                ...state,
                                                bYear: e.value,
                                            })
                                        }
                                    />
                                    <Select
                                        name="bMonth"
                                        options={months}
                                        placeholder="MM"
                                        isSearchable={false}
                                        onChange={(e: any) => {
                                            setState({
                                                ...state,
                                                bMonth: e.value
                                            })
                                        }
                                        }
                                    />
                                    <Select
                                        name="bDay"
                                        options={days}
                                        placeholder="DD"
                                        isSearchable={false}
                                        onChange={(e: any) =>
                                            setState({
                                                ...state,
                                                bDay: e.value,
                                            })
                                        }
                                    />
                                    {/* <Select
                                        name="bDay"
                                        value={{ value: state.bDay, label: state.bDay }}
                                        options={days}
                                        placeholder="DD"
                                        onChange={(e: any) =>
                                            setState({
                                                ...state,
                                                bDay: e.value,
                                            })
                                        }
                                    /> */}
                                </div>

                                {isSubmited &&
                                    (formError.bDayError ||
                                        formError.bMonthError ||
                                        formError.bYearError) ? (
                                    <p className="login-form-error">{formError.bDayError}</p>
                                ) : null}
                                {/* <p className='login-form-error'>Enter your date of birth</p> */}
                            </div>


                            <div className='single-input dropdown-signup position-relative'>
                                <label>{t("signUp.Phone_Number")}</label>
                                <div className='d-flex align-items-center justify-content-between position-relative phone-verify'>
                                    <Select
                                        placeholder={t("signUp.Placeholder.Select")}
                                        isDisabled={isVerified}
                                        options={countryCode}
                                        isSearchable={false}
                                        name="countryCode"
                                        onChange={(e: any) =>
                                            setState({
                                                ...state,
                                                countryCode: e.value,
                                            })
                                        }
                                    />
                                    <input
                                        type='text'
                                        name='phoneNumber'
                                        placeholder={t("signUp.Placeholder.Phone_Number")}
                                        className='input-verify'
                                        value={state.phoneNumber}
                                        disabled={isVerified}
                                        maxLength={10}
                                        onChange={(e: any) => {

                                            const value = e.target.value;
                                            const re = /^[0-9\b]+$/;

                                            if (!value || value === "" || re.test(value)) {
                                                handleChange(e);
                                            }
                                        }}
                                    />

                                    <button
                                        disabled={state.phoneNumber.length < 9 || isVerified || !state.countryCode}
                                        onClick={() => {
                                            sendOTP();
                                        }}
                                    >  {sendVCode
                                        ? `${t('signUp.Resend')}`
                                        : `${t("signUp.Send_Verification_Code")}`}</button>
                                </div>
                                <div className='position-relative'>
                                    <input
                                        name="verificationCode"
                                        type='text'
                                        value={state.verificationCode}
                                        placeholder={t("signUp.Placeholder.Verification_Code")}
                                        className='v-code'
                                        onChange={(e: any) => {
                                            const value = e.target.value;
                                            const re = /^[0-9\b]+$/;

                                            if (!value || value === "" || re.test(value)) {
                                                handleChange(e);
                                            }
                                        }}
                                        maxLength={6}
                                    />
                                    <div className="otp-countdown">
                                        {showCountDown && <p>{`${m.toString().padStart(1, "0")}:${s.toString().padStart(2, "0")}`}</p>}
                                        <div className="countdown-err otp-countdown-error">
                                            {over ? otpErr : ""}
                                        </div>
                                    </div>
                                </div>
                                {state.verificationCode && sendVCode && !over && (
                                    <button
                                        onClick={mobileVerification}
                                        className="verify-signup"
                                    >
                                        {t("signUp.Verify")}
                                    </button>
                                )}
                                {isSubmited && !incorrectOTP && formError.verificationError && (
                                    <p className="login-form-error">
                                        {formError.verificationError}
                                    </p>
                                )}
                                {incorrectOTP && (
                                    <p className="login-form-error">{incorrectOTP}</p>
                                )}
                                {/* <p className='login-form-error'>Please verify your phone number</p>
                            <p className='login-form-error login-form-error-right'>Verification has been completed.</p> */}
                            </div>

                            <div className='accept-term-condition d-flex  align-items-center'>
                                <div>
                                    <label className="signup-checkbox">
                                        <input
                                            type="checkbox"
                                            name="agree"
                                            onChange={(e: any) => { changeTerm('terms') }}
                                            checked={terms}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className='tearms-content'>
                                    <p>{t("signUp.Terms.Agree")}</p>
                                </div>

                            </div>

                            <div className='divider-signup'></div>

                            <div className='accept-term-condition d-flex mt-0 align-items-center'>
                                <div>
                                    <label className="signup-checkbox">
                                        <input
                                            type="checkbox"
                                            name="agreeTerms"
                                            onChange={(e: any) => { changeTerm('termsOfUse') }}
                                            checked={termsOfUse}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className='tearms-content'>
                                    <p>{t("signUp.Terms.Term_of_use")}</p>
                                </div>
                                <div className='more-btn ml-auto'>
                                    <button className='' onClick={() => setTermsModal(true)}>{t("signUp.Placeholder.More")}</button>
                                </div>
                            </div>

                            <div className={AuthStorage.getLang() === "en" ? "accept-condition d-flex  align-items-center" : "accept-term-condition d-flex align-items-center"}>
                                {/* <div className='accept-condition d-flex  align-items-center'> */}
                                <div>
                                    <label className="signup-checkbox">
                                        <input
                                            type="checkbox"
                                            name="tremsOfUse"
                                            onChange={(e: any) => { changeTerm('privacyAndCookis') }}
                                            checked={privacyAndCookis}
                                        />
                                        <span className="checkmark"></span>
                                    </label>
                                </div>
                                <div className='tearms-content'>
                                    <p>{t("signUp.Terms.Privacy_and_Cookie")}</p>
                                </div>
                                <div className='more-btn ml-auto'>
                                    <button className='' onClick={() => setPolicyModal(true)}>{t("signUp.Placeholder.More")}</button>
                                </div>
                                {/* {isSubmited && formError.agreeTerms && (
                                    <p className="login-form-error">
                                        {formError.agreeTerms}
                                    </p>
                                )} */}
                            </div>

                            <div className='signup-btn-modal w-100 text-center'>
                                <button type='button'
                                    onClick={() => {
                                        // debugger;
                                        SignUp();
                                    }}
                                > {t("signUp.Sign_Up")}</button>
                            </div>
                            <div className='have-account-row'>
                                <p>{t("signUp.Placeholder.Already_have_account")}<span className='cursor-pointer' onClick={goLoging}>  {t("logIn.Log_In")} </span></p>
                            </div>

                        </div>
                    </div>
                </Modal.Body>
            </Modal>


            <Welcome
                showWelcome={welcomeModal}
                onHideWelocome={() => setWelcomeModal(false)}
                hideWelcom={hideWelcom}
                onShow={onShow}
            />


            <Terms
                showTerms={termsModal}
                onHideTerms={() => setTermsModal(false)}
            />

            <Policy
                showPolicy={policyModal}
                onHidePolicy={() => setPolicyModal(false)}
            />

        </>
    )
}

export default Signup