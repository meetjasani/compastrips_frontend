
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import Select from 'react-select';
import moment from 'moment';
import { getCookie } from '../../helper/utils';
import Login from '../../pages/modal/Login';
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { getUserData, removeUserData } from '../../redux/action/userDataAction';
import AuthStorage from '../../helper/AuthStorage';
import { changeLoginState } from '../../redux/action/loginAction';
import { ApiPut } from '../../helper/API/ApiData';
import { toggleNotification } from '../../redux/action/userDataAction';
import { Badge, Dropdown, DropdownButton } from "react-bootstrap";
import Switch from "react-switch";
import DatePicker, { registerLocale } from "react-datepicker";
import { db } from '../../firebaseConfig';
import { getNotification } from '../../redux/action/notificationAction';
import NavbarCollapse from 'react-bootstrap/esm/NavbarCollapse';

const landropdown = [
    { value: '한국어(KR)', label: '한국어(KR)' },
    { value: 'English', label: 'English' },

];

const customStyles = {
    control: () => ({
        width: 132,
        height: 38,
        lineHeight: "38px",
        paddingLeft: "44px",
    }),
}

const Header = () => {
    const location = useLocation();
    const { t } = useTranslation();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state?.login);
    const { userData } = useSelector((state: RootStateOrAny) => state?.userData)
    const { user_name, avatar } = useSelector((state: RootStateOrAny) => state?.userData?.userData) || {
        user_name: "", avatar: ""
    };
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>();
    // Notification section
    const { notificationData } = useSelector((state: RootStateOrAny) => state.notification);
    const history = useHistory();
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [modalShow, setModalShow] = React.useState(false);
    const [langDropDown, setLangDropDown] = React.useState<any>({});
    const [badge, setShowBadge] = useState(false);

    useEffect(() => {
        if (userData && userData.hasOwnProperty("id")) {
            dispatch(getNotification(userData?.id));
        }
    }, [userData]);

    useEffect(() => {
        setShowBadge(notificationData.find((x: any) => !x?.data.seen) ? true : false)
    }, [notificationData])

    const redirect = (docId: string, itiID: string, hostingID: string, type: string) => {
        (async () => {
            await db.collection("notification").doc(docId).update({
                seen: true
            })

            if (type == "CANCEL") {
                if (location.pathname === "/itinerary") {
                    window.location.href = `/itinerary?id=${itiID}`;
                } else {
                    history.push(`/itinerary?id=${itiID}`);
                }
            } else {
                if (location.pathname === "/itinerary") {
                    window.location.href = `/itinerary?id=${itiID}&hostingId=${hostingID}`;
                } else {
                    history.push(`/itinerary?id=${itiID}&hostingId=${hostingID}`);
                }
            }

        })()

    }

    const dataGet = (data: any) => {
        setModalShow(data)
    }

    let dispatch = useDispatch()
    //For Language  DropDown Title Changing
    const [selectedLang, setSelectedLang] = useState("한국어(KR)");

    useEffect(() => {
        if (user_name === "" || user_name === undefined) {
            AuthStorage.getToken() && dispatch(getUserData())
        }
        let getLangLocal = localStorage.getItem("i18nextLng");
        if (getLangLocal === "en") {
            setLangDropDown(landropdown[1])
            // changeLanguage("en", "ENG(EN)");
        } else {
            // changeLanguage("ko", "한국어(KR)");
            setLangDropDown(landropdown[0])
        }
    }, []);




    const [temp, setTemp] = useState(false);

    // useEffect(() => {

    // }, [langDropDown])


    const changeLanguage = (lang: string, name: string) => {
        // setSelectedLang(name)
        i18next.changeLanguage(lang)
        localStorage.setItem("i18nextLng", lang);
        let getLangLocal = localStorage.getItem("i18nextLng");
        if (getLangLocal === "en") {
            setLangDropDown(landropdown[1])
            // changeLanguage("en", "ENG(EN)");
        } else {
            // changeLanguage("ko", "한국어(KR)");
            setLangDropDown(landropdown[0])
        }

        if (temp) {
            let currentPath = location.pathname + location.search;
            window.location.href = currentPath;
            // console.log("window.location.href", window.location.href);

        } else {
            window.location.reload();
        }
        setTemp(true)
    }
    //------------

    const dataGets = () => {
        setModalShow(true)
    }

    const logout = () => {
        dispatch(changeLoginState(false));
        dispatch(removeUserData());
        AuthStorage.deauthenticateUser();
        history.push("/");
    }
    const chatNotification = () => {
        ApiPut("user/notification", {}).then((res: any) => {
            dispatch(toggleNotification(res?.data?.data?.state));
        });
    };

    const Search = () => {

        let searchParam =
            "?keyword=" +
            (searchTerm ? searchTerm : "") +
            "&startDate=" +
            (startDate ? moment(startDate).format("YYYY-MM-DD") : "") +
            "&endDate=" +
            (endDate ? moment(endDate).format("YYYY-MM-DD") : "");
        history.push({
            pathname: "/",
            search: searchParam,
        });
    };

    useEffect(() => {
        const header: any = document.getElementById("SmallHeader");
        const scrollCallBack: any = window.addEventListener("scroll", () => {
            if (window.pageYOffset > 350 && location.pathname === '/') {
                header.classList.add("d-block");

            } else {
                header.classList.remove("d-block");
            }
        });
        return () => {
            window.removeEventListener("scroll", scrollCallBack);
        };
    }, [location])

    const onDatePickerClick = (id: string) => {
        document.getElementById(id)?.click();
    }
    return (
        <>
            <div className={location.pathname === "/" ? "ninetwenty-container logout-header" : "ninetwenty-container logout-color-header"}>
                <div className='mini-container'>

                    <div className='logout-header-inner'>
                        <div className='d-flex align-items-center justify-content-between'>
                            <div className='logo' onClick={() => history.push("/")}>
                                {location.pathname === "/" ? <img src="./img/logo.svg" alt="" /> : <img src="./img/color-logo.svg" alt="" />}
                            </div>

                            <div className={location.pathname === "/" ? "fixed-top-header d-none" : "fixed-top-header"} id="SmallHeader">
                                {/* <div className='fixed-top-header' id="SmallHeader"> */}
                                <div className={location.pathname === "/" ? "search-bar header-search-bar" : "search-bar header-search-bar header-search-bar-shadow"}>
                                    {/* <div className='search-bar header-search-bar'> */}
                                    <div className='search-bar-inner'>
                                        <div className='find-city-location'>
                                            <input type="text"
                                                placeholder={t("Homepage.Hero.Search_Placeholder")}
                                                value={searchTerm}

                                                onChange={(e) => {
                                                    setSearchTerm(e.target.value);
                                                }}
                                            />
                                            <img src="./img/location.svg" alt="" className='location-icon' />
                                        </div>
                                        <div className='from-calender d-flex align-items-center'>
                                            <h6> {t("Homepage.Hero.From")}</h6>
                                            <img src="./img/calender.svg" alt="" className='calender-image' onClick={() => { onDatePickerClick("startDate1") }} />
                                            {/* <DatePicker selected={startDate} onChange={(date: Date) => setStartDate(date)} /> */}
                                            <DatePicker
                                                id="startDate1"
                                                selected={startDate}
                                                minDate={new Date()}
                                                onChange={(date: Date | null) => setStartDate(date)}
                                                dateFormat="EEE MM/dd"
                                                locale={AuthStorage.getLang()}
                                            />
                                        </div>
                                        <div className='to-calender d-flex align-items-center'>
                                            <h6>{t("Homepage.Hero.Until")}</h6>
                                            <img src="./img/calender.svg" alt="" className='calender-image' onClick={() => { onDatePickerClick("endDate1") }} />
                                            <DatePicker
                                                id="endDate1"
                                                selected={endDate}
                                                minDate={new Date()}
                                                onChange={(date: Date | null) => setEndDate(date)}
                                                dateFormat="EEE MM/dd"
                                                locale={AuthStorage.getLang()}
                                            />
                                        </div>

                                        <div className='d-flex align-items-center'>
                                            <button className='header-search-button-hero' onClick={() => Search()}>
                                                <img src="./img/search.svg" alt="" className='find-tour' />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='right-button d-flex align-items-center'>
                                <div className={location.pathname === "/" ? "login-btn" : "login-color-btn"}>
                                    {
                                        is_loggedin ?
                                            <>
                                                <Dropdown>
                                                    <Dropdown.Toggle className="bg-transparent profilenote-btn" style={{ width: '26px', margin: '0 auto' }}>
                                                        <div className="position-relative" style={{ width: '26px', margin: '0 auto' }}>
                                                            <img src={avatar || "./img/Avatar.png"} alt="" className='user-image-login' />
                                                            {badge && <Badge className="position-absolute note-badge" ></Badge>}
                                                        </div>
                                                    </Dropdown.Toggle>

                                                    {notificationData.length > 0 &&
                                                        <Dropdown.Menu className="note-dropmenu notification" style={{
                                                            height: 'fit-content',
                                                            overflowY: 'auto',
                                                            maxHeight: '330px',

                                                        }}>


                                                            {notificationData.map((x: any) => (
                                                                <Dropdown.Item>
                                                                    <>
                                                                        {x.data.seen &&
                                                                            (<p className="mb-0 notification-font-normal" key={x.id} onClick={() => redirect(x.id, x.data.itinerary_id, x.data.hosting_id, x.data.type)}>
                                                                                {AuthStorage.getLang() === "en" ? x.data.msg : x.data.msg_ko}
                                                                            </p>
                                                                            )
                                                                        }
                                                                        {!x.data.seen &&

                                                                            (<p className="mb-0 notification-font-bold" key={x.id} onClick={() => redirect(x.id, x.data.itinerary_id, x.data.hosting_id, x.data.type)}>
                                                                                {AuthStorage.getLang() === "en" ? x.data.msg : x.data.msg_ko}
                                                                            </p>
                                                                            )
                                                                        }
                                                                    </>
                                                                </Dropdown.Item>
                                                            ))}

                                                        </Dropdown.Menu>
                                                    }
                                                </Dropdown>

                                                <Dropdown>

                                                    <Dropdown.Toggle className="d-flex profile-drop">
                                                        <h2 className={location.pathname === "/" ? "text-white user-name-login" : "user-name-login"}>{ }
                                                            {AuthStorage.getLang() === "en"
                                                                ? userData?.user_name?.length <= 8 ? user_name?.slice(0, 8) : user_name?.slice(0, 7) + ".."
                                                                : userData?.user_name?.length <= 4 ? user_name?.slice(0, 4) + "님" : user_name?.slice(0, 3) + ".." + "님"
                                                            }
                                                        </h2>
                                                        <h5
                                                            className={
                                                                location.pathname === "/"
                                                                    ? "text-white font-13-bold profile-w-70"
                                                                    : "font-13-bold color-black profile-w-70"
                                                            }
                                                        >
                                                            {/* {userData?.user_name > 7
                                                                ? userData?.user_name.slice(0, 7) + "..."
                                                                : userData?.user_name} */}
                                                        </h5>
                                                        <img
                                                            className="arrows-dropdown"
                                                            src={
                                                                location.pathname === "/"
                                                                    ? "./img/downarrowhite.svg"
                                                                    : "./img/downarrow.svg"
                                                            }
                                                            alt=""
                                                        />
                                                    </Dropdown.Toggle>

                                                    <Dropdown.Menu className=" profile-drop-link">
                                                        <Dropdown.Item className='active'>
                                                            <Link
                                                                to="/profile"
                                                                // to=""
                                                                className={
                                                                    location.pathname === "/profile"
                                                                        ? " profile-drop-link-a"
                                                                        : "profile-drop-link-normal active"
                                                                }
                                                            >
                                                                {t("Header.DropDown.My_Account")}
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Link
                                                                to="/myhosting"
                                                                // to=""
                                                                className={
                                                                    location.pathname === "/myhosting"
                                                                        ? " profile-drop-link-a"
                                                                        : "profile-drop-link-normal"
                                                                }
                                                            >
                                                                {t("Header.DropDown.My_Hosting")}
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Link
                                                                to="/appliedhosting"
                                                                // to=""
                                                                className={
                                                                    location.pathname === "/appliedhosting"
                                                                        ? " profile-drop-link-a"
                                                                        : "profile-drop-link-normal"
                                                                }
                                                            >
                                                                {t("Header.DropDown.Applied_Hosting")}
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Link
                                                                to="/wishlist"
                                                                className={
                                                                    location.pathname === "/wishlist"
                                                                        ? " profile-drop-link-a"
                                                                        : "profile-drop-link-normal"
                                                                }
                                                            >
                                                                {t("Header.DropDown.Wishlist")}
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            <Link
                                                                to="/edit-profile"
                                                                className={
                                                                    location.pathname === "/edit-profile"
                                                                        ? " profile-drop-link-a"
                                                                        : "profile-drop-link-normal"
                                                                }
                                                            >
                                                                {t("Header.DropDown.Edit_Profile")}
                                                            </Link>
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={logout}>
                                                            <Link to="#/action-3">{t("Header.DropDown.Log_Out")}</Link>
                                                        </Dropdown.Item>
                                                        <div className="d-flex mt-30 chatbox ">
                                                            <div className='d-flex align-items-center ChatBoxInner w-100'>
                                                                <div>
                                                                    <p className="mb-0 font-16-bold color-dark h-28">{t("Chat.Chat")}</p>
                                                                </div>
                                                                <div className="ml-auto d-flex align-items-center" style={{ height: '18px', lineHeight: '18px' }}>
                                                                    <p className="on-off mb-0">
                                                                        <span>{userData?.notification ? "on" : "off"}</span>
                                                                    </p>

                                                                    <Switch
                                                                        onChange={chatNotification}
                                                                        checked={userData?.notification}
                                                                        boxShadow="0px 1px 3px rgba(0, 0, 0, 0.6)"
                                                                        activeBoxShadow="0px 0px 1px 3px rgba(0, 0, 0, 0.2)"
                                                                        uncheckedIcon={false}
                                                                        checkedIcon={false}
                                                                        onColor="#E7E7E7"
                                                                        onHandleColor="#42B6E6"
                                                                        handleDiameter={16}
                                                                        height={8}
                                                                        width={26}
                                                                        className="chat-toggle"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Dropdown.Menu>
                                                </Dropdown>
                                            </>
                                            :
                                            <button onClick={() => setModalShow(true)} style={{ width: '92px' }}>{t("logIn.Log_In")}</button>
                                    }

                                </div>
                                <div className={` d-flex align-items-center ${location.pathname === "/" ? "change-language" : "change-color-language"}`}>
                                    <img src={location.pathname === "/" ? "./img/world.svg" : "./img/color-world.svg"} alt="" className='world-image' />
                                    <Select
                                        options={landropdown}
                                        defaultValue={langDropDown}
                                        value={langDropDown}
                                        styles={customStyles}
                                        isSearchable={false}
                                        onChange={(e: any) => {

                                            if (e.value == "English") {

                                                setLangDropDown(e)
                                                changeLanguage("en", "English(EN)")

                                            } else {

                                                // setLangDropDown(e)
                                                changeLanguage("ko", "한국어(KR)")
                                            }
                                        }}
                                    />

                                    <img src={location.pathname === "/" ? "./img/dropdown.svg" : "./img/color-dropdown.svg"} alt="" className='dropdown-image' />

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >

            <Login
                show={modalShow}
                onHide={() => setModalShow(false)}
                onHideNew={dataGet}
                onShow={dataGets}
            />

        </>
    )
}

export default Header
