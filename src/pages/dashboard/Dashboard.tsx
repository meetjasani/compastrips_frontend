import moment from 'moment';
import React, { useEffect, useState } from 'react'
import DatePicker, { registerLocale } from "react-datepicker";
import ko from "date-fns/locale/ko";
import { RootStateOrAny, useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import AuthStorage from '../../helper/AuthStorage';
import PopulatHost from './PopulatHost';
import TourList from './TourList';
import TredingNow from './TredingNow';
import * as QueryString from "query-string";
import { getUserData } from '../../redux/action/userDataAction';
import { useTranslation } from "react-i18next";
import ViewHost from '../viewhost/ViewHost';
import HostMyOwn from '../hostmyown/HostMyOwn';
import Login from '../modal/Login';
registerLocale("ko", ko);

function Dashboard() {
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [searchTerm, setSearchTerm] = useState<string>();
    const [modalShow, setModalShow] = useState(false);

    const location = useLocation();

    const history = useHistory();
    const { t } = useTranslation();

    const dispatch = useDispatch();
    const { is_loggedin } = useSelector((state: RootStateOrAny) => state?.login);

    const { userData } = useSelector((state: RootStateOrAny) => state.userData);

    const params = QueryString.parse(location.search);

    // dispatch(getUserData());
    useEffect(() => {
        // dispatch(getUserData());
        if (params.keyword || params.endDate || params.startDate) {
            if (params?.endDate) {
                setEndDate(new Date(params?.endDate.toString()));
            }
            if (params?.startDate) {
                setStartDate(new Date(params?.startDate.toString()));
            }
        }
        setSearchTerm(params?.keyword?.toString())

    }, []);

    //Homepage search filter  
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

    const ViewHost = () => {
        is_loggedin ? history.push("/viewhost") : setModalShow(true)
    }

    const hostown = () => {
        is_loggedin ? history.push("/hostitinerary") : setModalShow(true)
    }

    const dataGet = (data: any) => {
        setModalShow(data)
    }

    const onDatePickerClick = (id: string) => {
        // debugger;
        document.getElementById(id)?.click();
    }
    return (
        <div className='bg-home-page'>
            <div className=' hero-section ninetwenty-container'>

                {/* <img src="./img/heroshadow.svg" alt="" className='shadow-image' /> */}
                <div className='mini-container'>
                    <div className='hero-content'>
                        <h2>{t("Homepage.Hero.Title1")}</h2>
                        <h2 className='second-title-row'>{t("Homepage.Hero.Title2")}</h2>

                        <div className='search-bar'>
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
                                    <div className='d-flex align-items-center'>
                                        <h6> {t("Homepage.Hero.From")}</h6>
                                        <img src="./img/calender.svg" className='calender-image' onClick={() => { onDatePickerClick("startDate") }} alt="" />
                                    </div>

                                    <DatePicker
                                        id="startDate"
                                        selected={startDate}
                                        minDate={new Date()}
                                        onChange={(date: Date | null) => setStartDate(date)}
                                        dateFormat="EEE MM/dd"
                                        locale={AuthStorage.getLang()}
                                    />
                                </div>
                                <div className='to-calender d-flex align-items-center'>
                                    <div className='d-flex align-items-center'>
                                        <h6>{t("Homepage.Hero.Until")}</h6>
                                        <img src="./img/calender.svg" alt="" className='calender-image' onClick={() => { onDatePickerClick("endDate") }} />
                                    </div>
                                    <DatePicker
                                        id="endDate"
                                        selected={endDate}
                                        minDate={new Date()}
                                        onChange={(date: Date | null) => setEndDate(date)}
                                        dateFormat="EEE MM/dd"
                                        locale={AuthStorage.getLang()}
                                    />
                                </div>

                                <div className='d-flex align-items-center'>
                                    <button className='search-button-hero' onClick={() => Search()}>
                                        <img src="./img/search.svg" alt="" className='find-tour' />
                                        {t("Homepage.Hero.Find_Tours")}
                                    </button>
                                </div>


                            </div>
                        </div>
                        <div className='hero-content-btn'>
                            <button className='view-host-btn'
                                onClick={() => {
                                    ViewHost()
                                }}>
                                <img src="./img/user.svg" alt="" />
                                <span> {t("Homepage.Hero.View_Hosts")} </span>
                            </button>
                            <button className='host-my-own'
                                onClick={() => {
                                    hostown()
                                }}
                            >
                                <img src="./img/whiteClender.svg" alt="" />
                                <span> {t("Homepage.Hero.Host_MyOwn")}</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>

            <section className='bg-content'>
                <div className='ninetwenty-container '>
                    <div className='mini-container '>
                        <div className='d-flex justify-content-between'>
                            <div>
                                <TredingNow />
                                <PopulatHost />
                            </div>
                            <div>
                                <TourList />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Login
                show={modalShow}
                onHide={() => setModalShow(false)}
                onHideNew={dataGet}
                onShow=""
            />

        </div>
    )
}

export default Dashboard
