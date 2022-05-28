import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useHistory, useLocation } from 'react-router-dom';
import Tabs from '../../common/Tabs';
import { ApiPost } from '../../helper/API/ApiData';
import * as QueryString from "query-string";
import moment from 'moment';
import AuthStorage from '../../helper/AuthStorage';
import Rating from 'react-rating';
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';

interface itineraryList {
    country: string
    image: string[]
    course: string[]
    created_by_show: string
    creator_show: string
    creator: string
    end_date: Date
    end_time?: string
    host_count: number
    id: string
    isLike: boolean
    region: string
    review_count: number
    star: number
    start_date: Date
    start_time?: string
    title: string
}
function TourList() {

    const history = useHistory();
    const location = useLocation();
    const [data, setData] = useState<itineraryList[]>([]);

    const { t } = useTranslation();

    const { is_loggedin } = useSelector((state: RootStateOrAny) => state.login)

    const [activeTab, setActiveTab] = useState("All");

    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState<number>(1);

    const [hasMore, setHasMore] = useState(false);
    const observer = useRef<any>();


    const tabsList = [{
        value: 'All',
        label: `${t("Homepage.NavBar.All")}`
    }, {
        value: AuthStorage.getLang() === "en" ? "Only Locals know" : "현지인만 아는",
        label: `${t("Homepage.NavBar.Local_Picks")}`
    }, {
        value: 'K-pop',
        label: `K-pop`
    }, {
        value: 'Festivals & Events',
        label: `${t("Homepage.NavBar.Festivals")}`
    }, {
        value: AuthStorage.getLang() === "en" ? "Popular Destination" : "인기명소",
        label: `${t("Homepage.NavBar.Popular")}`
    }]


    // const tabsList = ["All", "Only Locals Know", "K-pop", "Festivals & Events", "Popular Destinations"];

    const filterData = (state: any) => {
        setActiveTab(state);
        if (state === "All") {
            setData([]);
        } else {
            // setData(data.filter((x) => x.reqStatus === state));
        }
    };

    useEffect(() => {
        setPage(1);
    }, [location])

    useEffect(() => {
        getSearchedItinerary()
    }, [activeTab, page, location]);

    let searchParam = QueryString.parse(history.location.search);
    //search


    const returnCategoryActiveData = (ActiveTab: any) => {

        let category = ''
        let category_ko = ''
        if (AuthStorage.getLang() == "en") {
            switch (ActiveTab) {
                case "All":
                    category = 'All'
                    category_ko = "전체"
                    break;

                case "Popular Destination":
                    category = 'Popular Destination'
                    category_ko = "인기명소"
                    break;

                case "Only Locals know":
                    category = 'Only Locals know'
                    category_ko = "현지인만 아는"
                    break;

                case "Festivals & Events":
                    category = 'Festivals & Events'
                    category_ko = "축제와 이벤트"
                    break;

                case "K-pop":
                    category = 'K-pop'
                    category_ko = "K-pop"
                    break;

                default:
                    break;
            }
        } else {
            switch (ActiveTab) {
                case "전체":
                    category = 'All'
                    category_ko = "전체"
                    break;

                case "인기명소":
                    category = 'Popular Destination'
                    category_ko = "인기명소"
                    break;

                case "현지인만 아는":
                    category = 'Only Locals know'
                    category_ko = "현지인만 아는"
                    break;

                case "축제와 이벤트":
                    category = 'Festivals & Events'
                    category_ko = "축제와 이벤트"
                    break;

                case "K-pop":
                    category = 'K-pop'
                    category_ko = "K-pop"
                    break;

                default:
                    break;
            }
        }

        return {
            category: category,
            category_ko: category_ko
        }
    }

    const getSearchedItinerary = () => {
        if (searchParam) {
            setLoading(true);
            // setErr(false);

            let ActiveTab = `${activeTab}` == "All" ? { category: "", category_ko: "" } : returnCategoryActiveData(activeTab)
            ApiPost(`itinerary/getItineraryOnHome?page_number=${page}&per_page=10`, {
                search_term: searchParam?.keyword,
                start_date: searchParam?.startDate,
                end_date: searchParam?.endDate,
                category: ActiveTab?.category,
                category_ko: ActiveTab?.category_ko,
            })
                .then((res: any) => {
                    setData((prev: any[]) => {
                        if (res.data.itinerary > 0 || page > 1) {
                            return [...prev, ...res.data.itinerary];
                        } else {
                            return [...res.data.itinerary];
                        }
                    });
                    setHasMore(res.data.itinerary.length > 0);
                    setLoading(false);
                })
                .catch((e: any) => {
                    // setErr(true);
                });
        }
    }

    const changeDateType = (date: string) => {

        const x = new Date(date);
        const y = x.getMonth();
        const w = x.getDate();
        const z = x.getFullYear().toString();
        const month = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
        ];

        // return month[y] + " " + w + ", " + z;
        return moment(x).locale(AuthStorage.getLang()).format("LL");
    };

    const changeTimeFormat = (time: string) => {
        let Time = time.split(":");
        return Time[0] + ":" + Time[1];
    }

    //Like function
    const [delayLike, setDelayLike] = useState(false);
    const Like = (id: any) => {
        setDelayLike(true);
        localLike(id);
        ApiPost(`itinerary/wishlist/${id}`, {})
            .then((res) => {
                setDelayLike(false);
            })
            .catch((err) => {
                console.log("Fail", err);
            });
    };

    const localLike = (itineraryId: string) => {
        setData(
            data.map((itinerary: any) => {
                if (itinerary.id === itineraryId) {
                    itinerary.isLike = !itinerary.isLike;
                }
                return itinerary;
            })
        );
    };

    const lastTourListRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setPage((prev) => prev + 1);
                }
            });

            if (node) observer.current.observe(node);
        },
        [loading, hasMore]
    );

    const Search = async (tab: string) => {
        setData([]);
        setPage(1);
        setActiveTab(tab);
    };

    const getitinerary = () => {
        sessionStorage.setItem('scrollPosition', window.scrollY.toString())

    }

    useEffect(() => {
        if (data.length) {
            const scrollPosition = sessionStorage.getItem('scrollPosition');
            if (scrollPosition) {
                window.scrollTo(0, parseInt(scrollPosition, 10));
                sessionStorage.removeItem('scrollPosition');
            }
        }
    }, [data]);

    return (
        <div className='tour-list-section'>
            <div>
                <div>
                    <Tabs
                        ulClassName="tab-ul-class"
                        liClassName="tab-li-class"
                    >
                        {tabsList.map((tab, i) => {

                            return (
                                <p
                                    className={activeTab === tab.value ? "tab-card-active" : "tab-card"}
                                    // onClick={() => filterData(tab.value)}
                                    onClick={() => { AuthStorage.getLang() === "en" ? Search(tab.value) : Search(tab.value) }}
                                >
                                    {`${tab.label}`}
                                </p>
                            );
                        })}

                    </Tabs>
                </div>

                {/* old code */}

                {/* <ul className="tab-links">
                    <li onClick={() => Search("")}>
                        <h4
                            className={
                                activeTab === ""
                                    ? "font-18-bold active h-27"
                                    : "font-18-normal color-dark  h-27"
                            }
                        >
                            {t("Homepage.NavBar.All")}
                        </h4>
                    </li>
                    <li onClick={() => { AuthStorage.getLang() === "en" ? Search("Only Locals know") : Search("현지인만 아는") }}>
                        <h4
                            className={
                                activeTab === (AuthStorage.getLang() === "en" ? "Only Locals know" : "현지인만 아는")
                                    ? "font-18-bold active  h-27"
                                    : "font-18-normal color-dark  h-27"
                            }
                        >
                            {t("Homepage.NavBar.Local_Picks")}
                        </h4>
                    </li>
                    <li onClick={() => Search("K-pop")}>
                        <h4
                            className={
                                activeTab === "K-pop"
                                    ? "font-18-bold active  h-27"
                                    : "font-18-normal color-dark  h-27"
                            }
                        >
                            K-pop
                        </h4>
                    </li>
                    <li onClick={() => Search("Festivals & Events")}>
                        <h4
                            className={
                                activeTab === "Festivals & Events"
                                    ? "font-18-bold active  h-27"
                                    : "font-18-normal color-dark  h-27"
                            }
                        >
                            {t("Homepage.NavBar.Festivals")}
                        </h4>
                    </li>
                    <li onClick={() => { AuthStorage.getLang() === "en" ? Search("Popular Destination") : Search("인기명소") }}>
                        <h4
                            className={
                                activeTab === (AuthStorage.getLang() === "en" ? "Popular Destination" : "인기명소")
                                    ? "font-18-bold active  h-27"
                                    : "font-18-normal color-dark  h-27"
                            }
                        >
                            {t("Homepage.NavBar.Popular")}
                        </h4>
                    </li>
                </ul> */}

                {/* /----------------- */}
            </div>
            <div className="content-card-tout-list">
                {data &&
                    data.map((item: any, index: any) => (
                        <div className='single-card-tour' ref={data.length === index + 1 ? lastTourListRef : null}>
                            <div className='likes-heart'>
                                {/* <input type="checkbox" id="heart" /> */}
                                <input
                                    type="checkbox"
                                    id={item.id}
                                    disabled={delayLike}
                                    checked={item.isLike}
                                    onClick={is_loggedin ? () => Like(item.id) : () => { }}
                                    className="instruments"
                                />
                                {/* <label htmlFor="heart">
                                </label> */}
                                <label
                                    htmlFor={item.id}
                                    className={is_loggedin ? `text-white check` : `text-white`}
                                >

                                    {!item.isLike && <img src="./img/Favourite.png" className="w-20 liked-heart" alt="" />}
                                </label>
                            </div>
                            {/* <div className='bg-image-tour' style={{ backgroundImage: `url(${item?.image.sort()[0]})` }}></div> */}
                            <Link to={`/itinerary?id=${item.id}`} onClick={() => {
                                getitinerary()
                            }}>
                                <div className='bg-image-tour' style={{ backgroundImage: `url(${item?.image[0]})` }} ></div>
                            </Link>
                            {/* <div className='bg-image-tour' ><img src={item?.image.sort()[0]} className="w-100" alt="" /></div> */}
                            <div className='single-card-tour-inner'>
                                <div className='title-row'>
                                    <h4>{item.title}</h4>
                                    <h5>Created by <span className={item.creator_show === "Host" ? "host-green" : "compastrips-span"}>{item.creator_show}</span></h5>
                                </div>
                                <div className='location-row'>
                                    <img src="./img/location-card.svg" alt="" />
                                    <p>{item.region}, {item.country}</p>
                                </div>
                                <div className='tour-star-list'>
                                    <div className='tour-rating'>
                                        {/* <img src="./img/color-star.svg" alt="" />
                                        <img src="./img/color-star.svg" alt="" />
                                        <img src="./img/color-star.svg" alt="" />
                                        <img src="./img/color-star.svg" alt="" />
                                        <img src="./img/star.svg" alt="" /> */}
                                        <Rating
                                            emptySymbol={<img src="./img/star.svg" className="mr-1" alt="" />}
                                            fullSymbol={<img src="./img/color-star.svg" className="mr-1" alt="" />}
                                            initialRating={item.star}
                                            readonly={true}
                                            stop={5}
                                        />
                                    </div>
                                    <div className='total-rating-content'>
                                        <p>{item.star} ∙ {t('TourList.Reviews')} {item.review_count}{" "}</p>
                                    </div>
                                </div>

                                <div className='route-setting'>
                                    {/* {item?.course?.map((tourtag: any) => (
                                        <p>{tourtag.name}</p>
                                    ))} */}
                                    {/* {item?.course?.map((tourtag: any, index: any) => (
                                        index < 10 &&
                                        <p>{tourtag.name}</p> || index === 10 &&
                                        <p>.......</p>
                                    ))} */}
                                    {item?.course?.map((tourtag: any, index: any) => (
                                        index < 10 &&
                                        <p>
                                            {tourtag.name}
                                            <span className="tooltiptext">{tourtag.name}</span>
                                        </p>
                                        // || index === 10 && <p>.......</p> || index > 10 && ""
                                    ))}
                                </div>

                                <div className='date-with-host'>
                                    <div className='date-tour-card'>
                                        {/* <h5>{item.start_date}</h5>
                                        <h5>&nbsp;-&nbsp;</h5>
                                        <h5>{item.end_date}</h5> */}
                                        {item.creator === "Host"
                                            ?
                                            <h5>
                                                {changeDateType(item.start_date)} {changeTimeFormat(item.start_time)} - {changeTimeFormat(item.end_time)}
                                            </h5>
                                            :
                                            <h5>
                                                {changeDateType(item.start_date)} -{" "}
                                                {changeDateType(item.end_date)}
                                            </h5>
                                        }
                                    </div>
                                    <div className='ml-auto tout-total-host'>
                                        <h6>
                                            <span>{item.host_count}</span> &nbsp;
                                            {t('My_Account.Hosts')}
                                        </h6>
                                    </div>
                                </div>

                            </div>
                        </div>
                    ))}
            </div>
        </div>

    )
}

export default TourList