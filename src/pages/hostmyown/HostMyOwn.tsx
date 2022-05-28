import React, { useEffect, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import DatePicker from "react-datepicker";
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ApiGet, ApiPost } from '../../helper/API/ApiData';
import AuthStorage from '../../helper/AuthStorage';
import AddEventsAndPlaces from './AddEventsAndPlaces';
import { Modal } from 'react-bootstrap';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import Select from "react-select";


interface itineraryList {
    id: string;
    name: string;
    image: string[];
    region: string;
}

interface formData {
    title: string;
    aboutTour: string;
    startsAt: string;
    hostType: string;
    other: string;
    pax: string;
    introduction: string;
    transportation: string;
}

function HostMyOwn() {

    const { userData } = useSelector((state: RootStateOrAny) => state.userData);
    const { t } = useTranslation();
    const history = useHistory();

    const [hostingNotice, setHostingNotice] = useState(false);
    const [hostingDate, setHostingDate] = useState<Date | null>();
    const [hostTour, sethostTour] = useState(false);
    const [hostNotice, sethostNotice] = useState(false);
    const [hasDelete, sethasDelete] = useState(false);

    const [likeDelete, setlikeDelete] = useState(false);

    const pathname = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    //Checking Region
    const [regionErr, setRegionErr] = useState(false);
    const checkRegion = () => {
        setRegionErr(false);
        for (let i = 0; i < itineraryList.length - 1; i++) {
            if (itineraryList[i].region !== itineraryList[i + 1].region) {
                setRegionErr(true);
                break;
            }
        }
    };
    //Itinerary List
    const [itineraryList, setItineraryList] = useState<itineraryList[]>([]);
    const resetFormData = {
        title: "",
        aboutTour: "",
        startsAt: "",
        hostType: "Local",
        other: "",
        pax: "",
        introduction: "",
        transportation: "",
    };

    const [isOtherTrasport, setIsOtherTrasport] = useState(false);

    const [startDate, setStartDate] = useState<Date | null>(null)
    const [formData, setFormData] = useState<formData>(resetFormData);
    const [isDisabled, setIsDisabled] = useState(true);

    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("23:30");

    const [showTours, setShowTours] = useState<boolean>(false);
    //Time Dropdown
    const [days, setDays] = useState<any[]>([]);
    const [endT, setEndT] = useState<any[]>([]);
    const getDays = () => {
        let hours = [];
        let minutes = 0;
        let m = "0";
        let h = "0";

        for (let i = 0; i <= 24; i++) {
            for (let j = 0; j <= 1; j++) {
                if (i !== 24 && j < 30) {
                    if (minutes === 60) {
                        minutes = 0;
                    }

                    if (i < 10) {
                        h = "0" + i.toString();
                    } else {
                        h = i.toString();
                    }

                    if (minutes < 10) {
                        m = "0" + minutes.toString();
                    } else {
                        m = minutes.toString();
                    }

                    hours.push({
                        value: h.toString() + ":" + m.toString(),
                        label: h.toString() + ":" + m.toString(),
                    });
                    minutes += 30;
                }
            }
        }
        setDays(hours);
    };

    const getEndTime = () => {
        let end: any[] = [];
        let minutes = 0;
        let m = "0";
        let h = "0";
        let start_hour = startTime.split(":");

        for (let i = parseInt(start_hour[0]); i <= 23; i++) {
            for (let j = 0; j < 2; j++) {
                if (i < 10) {
                    h = "0" + i.toString();
                } else {
                    h = i.toString();
                }

                if (j === 0) {
                    minutes = 0;
                } else {
                    minutes = 30;
                }

                if (minutes < 10) {
                    m = "0" + minutes.toString();
                } else {
                    m = minutes.toString();
                }

                end.push({
                    value: h + ":" + m.toString(),
                    label: h.toString() + ":" + m.toString(),
                });
                if (start_hour[0] + ":" + start_hour[1] === h + ":" + m) {
                    end.pop();
                }
                minutes += 30;
            }
        }

        // for (let i = 0; i <= (parseInt(start_hour[0]) * 2) - 1; i++) {
        //   var el = end.shift();
        //   end.push(el)
        // }
        // if (start_hour[1] === '30') {
        //   el = end.shift()
        //   end.push(el)
        // }
        if (start_hour[1] === "30") {
            end.shift();
        }
        end.push({ value: "23:59", label: "23:59" });
        setEndT(end);
    };

    useEffect(() => {
        setEndT([]);
        setEndTime("");

        getEndTime();
    }, [startTime]);

    useEffect(() => {
        isAlreadyHosting();
        getDays();
        setIsDisabled(!validation());
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const sethostNoticeBtn = () => {
        sethostTour(false);
        sethostNotice(true);
    };

    //Creating Hosting
    const createHosting = (id: string) => {
        ApiPost("hosting/create", {
            type: formData.hostType,
            date: moment(hostingDate).format("YYYY-MM-DD"),
            start_time: startTime,
            end_time: endTime,
            location: formData.startsAt,
            transportation: isOtherTrasport
                ? formData.other
                : formData.transportation,
            pax: formData.pax,
            host_information: formData.introduction,
            itinerary_id: id,
        }).then((res: any) => { });
    };
    const handleSubmit = () => {
        ApiPost("itinerary/create", {
            title: formData.title,
            information: formData.aboutTour,
            disclosure: "OPEN",
            start_date: moment(hostingDate).format("YYYY-MM-DD"),
            end_date: moment(hostingDate).format("YYYY-MM-DD"),
            courses: itineraryList.map((x: { id: any }) => x.id),
            language: AuthStorage.getLang()
        }).then((res: any) => {
            createHosting(res.data.id);
            // setGeneratedID(res.data.id);
            sethostNoticeBtn();
            setFormData(resetFormData);
        });
    };


    // Trasportation

    const trasportOption = [
        { name: t("Host_Own.Options.Car") },
        { name: t("Host_Own.Options.Taxi") },
        { name: t("Host_Own.Options.Public_Transportation") },
    ];

    const onHostDatePickerClick = (id: string) => {
        document.getElementById(id)?.click();
    };

    const sethasDeleteBtn = () => {
        sethasDelete(true);
        setlikeDelete(false);
    };
    //Delete Itinerary
    const [deleteID, setDeleteID] = useState("");
    const deleteItinerary = (id: string) => {
        setItineraryList((prev: any[]) =>
            prev.filter((x: { id: string }) => x.id !== id)
        );
    };

    const [tourDetails, setTourDetails] = useState(false);
    const [tourCourse, setTourCourse] = useState<any>();

    const getTourById = (id: string) => {
        ApiGet(`itinerary/tourcourse/${id}`).then((res: any) =>
            setTourCourse(res.data)
        );
    };

    const [canHost, setCanHost] = useState(false);
    const isAlreadyHosting = () => {
        ApiGet("hosting/isAlreadyHosted").then((res: any) => {
            setCanHost(res?.data?.status);
        });
    };


    const validation = () => {
        let Err = {
            titleErr: false,
            aboutTourErr: false,
            startsAtErr: false,
            hostingDateErr: false,
            otherErr: false,
            paxErr: false,
            introductionErr: false,
            startTimeErr: false,
            endTimeErr: false,
            trasportationErr: false,
            emptyArray: false,
        };

        if (!formData.title) {
            Err.titleErr = true;
        }
        if (!formData.aboutTour) {
            Err.aboutTourErr = true;
        }
        if (!hostingDate) {
            Err.hostingDateErr = true;
        }
        if (!formData.introduction) {
            Err.introductionErr = true;
        }
        if (isOtherTrasport && !formData.other) {
            Err.otherErr = true;
        }
        if (!formData.pax || formData.pax === "0") {
            Err.paxErr = true;
        }
        if (!formData.startsAt) {
            Err.startsAtErr = true;
        }
        if (!formData.transportation) {
            Err.trasportationErr = true;
        }
        if (!startTime) {
            Err.startTimeErr = true;
        }
        if (!endTime) {
            Err.endTimeErr = true;
        }
        if (!itineraryList.length) {
            Err.emptyArray = true;
        }

        // setDataErr(Err);

        if (
            !Err.titleErr &&
            !Err.aboutTourErr &&
            !Err.hostingDateErr &&
            !Err.introductionErr &&
            !Err.otherErr &&
            !Err.paxErr &&
            !Err.startsAtErr &&
            !Err.trasportationErr &&
            !Err.startTimeErr &&
            !Err.endTimeErr &&
            !regionErr &&
            !Err.emptyArray
        ) {
            return true;
        }
        return false;
    };

    useEffect(() => {
        // validation();
        setIsDisabled(!validation());
    }, [formData, startTime, endTime, regionErr, isOtherTrasport, itineraryList]);

    return (
        <>
            <div className='ninetwenty-container'>
                <div className='mini-container'>
                    <div className='host-my-own-page'>
                        <div className='host-title-with-add'>
                            <div className='title-host-own'>
                                <h3>{t("Host_Own.Host_Own")}</h3>
                                <p>{t("Host_Own.Span")}</p>
                            </div>
                            <div className='add-btn-host'>
                                <button
                                    onClick={() => {
                                        setShowTours(true);
                                    }}>{t("Host_Own.Add")}
                                </button>
                            </div>
                        </div>

                        {itineraryList.length === 0 ? (
                            <div className='view-section-itinerary'>
                                <div className='add-places-sec'>
                                    <p> {t("Host_Own.Placeholder.Places_Events")}</p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className='mainAddEventBorder'>
                                    <div className="line -mt-10 mt-30"></div>
                                    {itineraryList?.map((data, i: number) => (
                                        <>
                                            <div className="d-flex align-items-center mt-40 EventHostMoreDelete">
                                                <div className="round-number">
                                                    <p>
                                                        {i + 1}
                                                    </p>
                                                </div>
                                                <div className='addEventTitle'>
                                                    <p className="font-20-normal color-dark">{data.name}</p>
                                                </div>
                                                <div className="ml-auto moreanddelete-btnbox">
                                                    <button
                                                        // ButtonStyle="more-details-btn font-14-normal"
                                                        className='more'
                                                        onClick={() => {
                                                            getTourById(data.id);
                                                            setTourDetails(true);
                                                        }}
                                                    >
                                                        {" "}
                                                        {t("Host_Own.More")}{" "}
                                                    </button>
                                                    <button
                                                        // ButtonStyle="delete-itinerary-btn"
                                                        className='delete'
                                                        onClick={() => {
                                                            setlikeDelete(true);
                                                            setDeleteID(data.id);
                                                        }}
                                                    >
                                                        {" "}
                                                        {t("Host_Own.Delete")}{" "}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    ))}
                                </div>

                                <div className="line mt-30"></div>
                            </>
                        )}

                        <div className="mt-40 host-itiimage d-flex flex-wrap">
                            {itineraryList?.map((data, i: number) => (
                                <>
                                    <img src={data?.image[0]} alt="" />
                                </>
                            ))}

                        </div>

                        <div className='title-and-tourabout'>
                            <div>
                                <label>{t("Host_Own.Title")}</label>
                                <input
                                    name="title"
                                    type='text'
                                    value={formData.title}
                                    placeholder={t("Host_Own.Placeholder.Title")}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                    }}
                                />
                            </div>
                            <div>
                                <label>{t("Host_Own.About_Tour")}</label>
                                <TextareaAutosize minRows={6}
                                    onChange={(e: any) => {
                                        handleChange(e);
                                    }}
                                    name="aboutTour"
                                    value={formData.aboutTour}
                                    placeholder={t("Host_Own.Placeholder.About_Tour")}
                                    maxLength={500} />
                            </div>
                        </div>

                        <div className='create-my-itinerary'>
                            <div className='profle-my-itinerary'>
                                <h5 className='profile-title'>{t("Host_Own.Profile")}</h5>
                                <div className='my-profile-intro d-flex align-items-center'>
                                    <div>
                                        <img src={userData.avatar || "./img/Avatar.png"} alt="" />
                                    </div>
                                    <div className='full-my-info'>
                                        <div className='name-gender d-flex align-items-center'>
                                            <h6>{t("Host_Own.Gender")}</h6>
                                            <p>{userData?.gender}</p>
                                        </div>
                                        <div className='name-gender  d-flex align-items-center'>
                                            <h6>{t("Host_Own.Age")}</h6>
                                            <p> {userData?.age_group}</p>
                                        </div>
                                        <div className='name-gender d-flex align-items-center'>
                                            <h6> {t("Host_Own.Nationality")}</h6>
                                            <p>{userData?.nationality}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className='HostType'>
                                    <h5>{t("Host_Own.Host_Type")}</h5>
                                    <div className='host-btn d-flex'>
                                        <div className="radio-btn">
                                            <label className="radio-btn-detail mb-0 ml-27">
                                                <input
                                                    type="radio"
                                                    name="hostType"
                                                    id="host-type"
                                                    value="Local"
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                    }}
                                                />
                                                {"Local Host" && (
                                                    <div className="radio-check p-0 m-0 text-center  h-56">
                                                        {t("Host_Own.Local_Host")}
                                                    </div>
                                                )}
                                            </label>
                                        </div>

                                        <div className="radio-btn ">
                                            <label className="radio-btn-detail mb-0 ml-27">
                                                <input
                                                    type="radio"
                                                    name="hostType"
                                                    id="host-type"
                                                    value="Travel"
                                                    onChange={(e: any) => {
                                                        handleChange(e);
                                                    }}
                                                />
                                                {"Local Host" && (
                                                    <div className="radio-check p-0 m-0 text-center">
                                                        {t("Host_Own.Travel_Host")}
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className='mainHostingDate d-flex justify-content-between align-itmes-center'>
                                        <h5>{t("Host_Own.Hosting_Date")}</h5>
                                        <p>{t("Host_Own.Single_Day_Hosting")}</p>
                                    </div>
                                    <div className='d-flex align-items-center mainBox'>
                                        <div className='HostSelectdate position-relative'>
                                            <img src='./img/HostDate.svg' alt=""
                                                onClick={() => {
                                                    onHostDatePickerClick("hostDate");
                                                }}
                                                className='position-absolute date-icon'
                                            />
                                            <DatePicker
                                                minDate={new Date()}
                                                autoComplete="off"
                                                selected={hostingDate}
                                                dateFormat="yyyy.MM.dd"
                                                placeholderText="YYYY-MM-DD"
                                                id="hostDate"
                                                locale={AuthStorage.getLang()}
                                                onChange={(date: Date | null) => {
                                                    setHostingDate(date);
                                                }}
                                            />
                                        </div>

                                        <div className='timeSelect d-flex align-items-center'>
                                            <Select
                                                options={days}
                                                name="startDate"
                                                isSearchable={false}
                                                onChange={(e: any) => {
                                                    setStartTime(e.value);
                                                }}
                                                placeholder="11:00"
                                                className='select'
                                            />

                                            <span className='divder'></span>

                                            <Select
                                                options={endT}
                                                value={{ value: endTime, label: endTime }}
                                                name="endDate"
                                                isSearchable={false}
                                                onChange={(e: any) => {
                                                    setEndTime(e.value);
                                                }}
                                                placeholder="21:00"
                                                className='select'
                                            />

                                        </div>

                                        <div className='location'>
                                            <input type='text'
                                                name="startsAt"
                                                value={formData.startsAt}
                                                placeholder={t("Host_Own.Placeholder.Start_At")}
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                }}
                                            />
                                        </div>
                                    </div>

                                    <div className="secMainTrasportation">
                                        <h5 >  {t("Host_Own.Transportation")}</h5>
                                        <div className='mainTransportation d-flex align-itmes-center'>

                                            <>
                                                {trasportOption.map((t) => (
                                                    <div className="radio-btn ">
                                                        <label className="radio-btn-detail">
                                                            <input
                                                                type="radio"
                                                                name="transportation"
                                                                id="transportation"
                                                                value={t.name}
                                                                onClick={(e: any) => {
                                                                    handleChange(e);
                                                                }}
                                                            />
                                                            {t.name && <div className="radio-check">{t.name}</div>}
                                                        </label>
                                                    </div>
                                                ))}
                                                <div className="radio-btn ">
                                                    <label className="radio-btn-detail">
                                                        <input
                                                            type="radio"
                                                            name="transportation"
                                                            id="transportation"
                                                            value="Other"
                                                            onClick={(e: any) => {
                                                                handleChange(e);
                                                            }}
                                                        />
                                                        {"Other" && (
                                                            <div className="radio-check">
                                                                {t("Host_Own.Options.Other")}
                                                            </div>
                                                        )}
                                                    </label>
                                                </div>
                                            </>
                                            {formData.transportation === "Other" && (
                                                <div className='trasporttaion'>
                                                    <input
                                                        type='text'
                                                        name="other"
                                                        value={formData.other}
                                                        placeholder={t("Host_Own.Placeholder.Other")}
                                                        onChange={(e: any) => {
                                                            handleChange(e);
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className='mainPax'>
                                        <h5>  {t("Host_Own.Pax_Number")} </h5>
                                        <div className='paxnumber'>
                                            <input
                                                type='text'
                                                name="pax"
                                                value={formData.pax.toString()}
                                                placeholder={t("Host_Own.Placeholder.Pax_Number")}
                                                onChange={(e: any) => {
                                                    const value = e.target.value;
                                                    const re = /^[0-9\b]+$/;

                                                    if (!value || value === "" || re.test(value)) {
                                                        handleChange(e);
                                                    }
                                                }}
                                                maxLength={1} />
                                            <span> {t("Host_Own.Pax")} </span>
                                        </div>
                                    </div>

                                    <div className='introducemain'>
                                        <h5>{t("Host_Own.Introduce_Yourself")}</h5>
                                        <div>
                                            <TextareaAutosize
                                                name="introduction"
                                                value={formData.introduction}
                                                placeholder={t("Host_Own.Placeholder.Introduce_Yourself")}
                                                onChange={(e: any) => {
                                                    handleChange(e);
                                                }}
                                                minRows={6}
                                                maxLength={500}
                                            />
                                        </div>
                                    </div>

                                    <div className='editorinfomation'>
                                        <h5>{t("Host_Own.Editor_Information")}</h5>
                                        <p>Created by <span className='host-green'>Host</span></p>
                                    </div>

                                    <div className='hostbtn'>
                                        <button className='cancle'
                                            onClick={() => {
                                                setFormData(resetFormData);
                                                history.push("/");
                                            }}> {t("Host_Own.Cancel")}</button>
                                        <button
                                            disabled={isDisabled}
                                            className='host'
                                            onClick={() => {
                                                !canHost ? setHostingNotice(true) : sethostTour(true);
                                            }}
                                        > {t("Host_Own.Host")}

                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <AddEventsAndPlaces
                set={setShowTours}
                value={showTours}
                setCourseList={setItineraryList}
                selectedCourse={itineraryList}
            />

            <Modal
                show={tourDetails}
                onHide={() => {
                    setTourDetails(false);
                }}
                dialogClassName="tour-details-modal"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header className="p-0" closeButton>
                    <Modal.Title id="tour-details-title">
                        <h6 className="font-30-bold color-dark h-40">
                            {t("Tour_Course_Details.Header")}
                        </h6>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="itinery_details_modal p-0">
                    <div className="tour-details-body">
                        <table className="tour-details-table">
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.City")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray h-28">
                                        {tourCourse?.region}
                                    </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.Category")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray h-28">
                                        {tourCourse?.category}
                                    </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.Name")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray h-28">
                                        {tourCourse?.name}
                                    </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.Photos")}
                                    </h6>
                                </th>
                                <td>
                                    <div className="upload-pic">
                                        {tourCourse?.image.map((data: any) => (
                                            <img src={data} alt="" style={{ width: '160px', height: '100px', marginRight: '10px' }} />
                                        ))}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.Date")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray h-28">
                                        {moment(tourCourse?.opening_date).format("YYYY-MM-DD")} - {moment(tourCourse?.closing_date).format("YYYY-MM-DD")}
                                    </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black about-th">
                                        {t("Tour_Course_Details.About")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray about-td">
                                        {tourCourse?.summary}
                                    </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.Address")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray h-28">
                                        {tourCourse?.address}
                                    </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.URL")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray h-28">
                                        {tourCourse?.website}
                                    </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.Phone_Number")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray h-28">
                                        {tourCourse?.mobile}
                                    </h6>
                                </td>
                            </tr>
                            <tr>
                                <th>
                                    <h6 className="font-16-bold color-black">
                                        {t("Tour_Course_Details.Nearest_Public_Trasportation")}
                                    </h6>
                                </th>
                                <td>
                                    <h6 className="font-16-normal color-darkgray h-28">
                                        {tourCourse?.n_p_transportation}
                                    </h6>
                                </td>
                            </tr>
                        </table>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                show={hostTour}
                onHide={() => {
                    sethostTour(false);
                }}
                dialogClassName="welcome-modal host-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className="p-0">
                    <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko "}>
                        <h3>{t("Host_Own.Host_Popup.Host")}</h3>
                    </div>
                    <div className="welcome-content host-tourInner mt-60">
                        <div className='hostBG'>
                            <div className={AuthStorage.getLang() === "en" ? 'text-center hostInnerTitle' : 'text-center hostInnerTitleko'}>
                                <p className="font-24-bold h-30 color-black">
                                    {t("Host_Own.Host_Popup.Title")}
                                </p>
                            </div>
                            <div className="mt-18"></div>

                            <div className={AuthStorage.getLang() === "en" ? "d-flex HostInnerSecContent" : "d-flex HostInnerSecContentko"}>
                                <div className={AuthStorage.getLang() === "en" ? "dots" : "dotsko"}>
                                    <FontAwesomeIcon icon={faCircle} />
                                </div>
                                &nbsp;
                                {AuthStorage.getLang() === "en" ?
                                    <div>
                                        <p>{t("Host_Own.Host_Popup.Point1")}</p>
                                    </div>
                                    :
                                    <div>
                                        <p>{t("Host_Own.Host_Popup.Point1")}<br />{t("Host_Own.Host_Popup.Point11")}</p>
                                    </div>
                                }
                            </div>

                            <div className={AuthStorage.getLang() === "en" ? "d-flex HostInnerThreeContent" : "d-flex HostInnerThreeContentko"}>
                                <div className={AuthStorage.getLang() === "en" ? "dots" : "dotsko"}>
                                    <FontAwesomeIcon icon={faCircle} />
                                </div>
                                &nbsp;

                                <div>
                                    <p>{t("Host_Own.Host_Popup.Point2")}</p>
                                </div>
                            </div>

                            <div className={AuthStorage.getLang() === "en" ? "d-flex HostInnerFourContent" : "d-flex HostInnerFourContentko"}>
                                <div className={AuthStorage.getLang() === "en" ? "dots" : "dotsko"}>
                                    <FontAwesomeIcon icon={faCircle} />
                                </div>
                                &nbsp;

                                <div>
                                    {AuthStorage.getLang() === "en" ?
                                        <p>{t("Host_Popup.Body3")}{t("Host_Popup.Body4")}</p>
                                        :
                                        <p>{t("Host_Popup.Body3")}<br />{t("Host_Popup.Body4")}</p>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
                <div className={AuthStorage.getLang() === "en" ? "d-flex justify-content-between mt-50 hostingBtnBox" : "d-flex justify-content-between mt-50 hostingBtnBoxko"}>
                    <div className="Cancle">
                        <button
                            // ButtonStyle="join-cancle-btn"
                            onClick={() => {
                                sethostTour(false);
                            }}
                        >
                            {t("Host_Own.Host_Popup.Cancel")}
                        </button>
                    </div>

                    <div className="Confirm">
                        <button
                            // ButtonStyle="join-apply-btn"
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            {t("Host_Own.Host_Popup.Host_Btn")}
                        </button>
                    </div>
                </div>
            </Modal>

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
                        <h3>{t("Host_Own.Notice_Popup.Notice")}</h3>
                    </div>
                    <div className="welcome-content host-tour-modal-notice mt-60">
                        <div className='HostInnerNotice text-center'>
                            <p className="">{t("Host_Own.Notice_Popup.Body")}</p>
                        </div>
                    </div>
                </Modal.Body>
                <div className="w-100 mt-50">
                    <div className="HostNoticeok">
                        <button
                            // ButtonStyle="app-sent-ok"
                            onClick={() => {
                                history.push("/");
                                sethostNotice(false);
                            }}
                        >
                            {t("Host_Own.Notice_Popup.OK")}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                show={likeDelete}
                onHide={() => {
                    setlikeDelete(false);
                }}
                dialogClassName="welcome-modal del-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className="p-0">
                    <div className="modal-signup-title ">
                        <h3 className="h-36">{t("Host_Own.Delete_Course.Title")}</h3>
                    </div>
                    <div className="HostDeleteContent">
                        <div className='DeleteContent'>
                            <p className="font-24-normal h-36 color-black mt-36 text-center">
                                {t("Host_Own.Delete_Course.Body")}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <div className="d-flex justify-content-between mt-40 HostDeleteBtnBox">
                    <div className="">
                        <button
                            // ButtonStyle="join-cancle-btn"
                            className="HostMyOwnCancle"
                            onClick={() => {
                                setlikeDelete(false);
                            }}
                        >
                            {t("Host_Own.Delete_Course.Cancel")}
                        </button>
                    </div>

                    <div className="">
                        <button
                            // ButtonStyle="join-apply-btn"
                            className='HostMyOwnDelete'
                            onClick={() => {
                                sethasDeleteBtn();
                                deleteItinerary(deleteID);
                            }}
                        >
                            {t("Host_Own.Delete_Course.Delete")}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                show={hasDelete}
                onHide={() => {
                    sethasDelete(false);
                }}
                dialogClassName="welcome-modal del-modal"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className="p-0">
                    <div className="modal-signup-title ">
                        <h3 className="h-36">{t("Host_Own.Delete_Course_Popup.Title")}</h3>
                    </div>
                    <div className="ConfDelete">
                        <div className='ConfDeleteContent'>
                            <p className="font-24-normal h-36 color-black mt-36 text-center">
                                {t("Host_Own.Delete_Course_Popup.Body")}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <div className="w-100 mt-40">
                    <div className="ConfirmDeleteBtn">
                        <button
                            // ButtonStyle="app-sent-ok w-240"
                            className='ConfOk'
                            onClick={() => {
                                sethasDelete(false);
                            }}
                        >
                            {t("Host_Own.Delete_Course_Popup.OK")}
                        </button>
                    </div>
                </div>
            </Modal>

            <Modal
                show={hostingNotice}
                onHide={() => {
                    setHostingNotice(false);
                }}
                dialogClassName="welcome-modal warning-demo"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className="p-0">
                    <div className={AuthStorage.getLang() === "en" ? "modal-signup-title " : "modal-signup-titleko "}>
                        <h3>{t("Host_Own.Already_Hosting.Title")}</h3>
                    </div>
                    <div className="wraningInner">
                        <div className='wraningContent'>
                            <p className="text-center color-black font-20-normal">
                                {t("Host_Own.Already_Hosting.T1")}
                                <br />
                                {t("Host_Own.Already_Hosting.T2")}
                            </p>
                        </div>
                    </div>
                </Modal.Body>
                <div className="w-100 mt-22">
                    <div className="warningBtn">
                        <button
                            // ButtonStyle="app-sent-ok"
                            onClick={() => {
                                setHostingNotice(false);
                            }}
                        >
                            {t("Host_Own.Already_Hosting.OK")}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default HostMyOwn