import Pagination from "react-js-pagination"
import { Image } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { useEffect, useState } from "react";
import { ApiGet, ApiPost } from "../../helper/API/ApiData";
// import InputField from "../../components/Inputfield";
// import CheckBox from "../../components/Checkbox";
import moment from "moment";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft, faAngleDoubleLeft, faAngleDoubleRight, faLaptopHouse } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import AuthStorage from "../../helper/AuthStorage";

interface regionProps {
    region: string
}

interface categoryProps {
    category: string
    isSelected: boolean
}

interface tourCardProps {
    count: number,
    data: [{
        address: string,
        always_open: boolean,
        category: string,
        closing_date: string,
        country: string,
        id: string,
        image: string[],
        mobile: string,
        n_p_transportation: string,
        name: string,
        opening_date: string,
        region: string,
        summary: string,
        website: string,
    }]
}

interface itineraryList {
    id: string,
    name: string,
    image: string[],
    region: string,
}


interface AddEventsProps {
    set: (set: boolean) => void;
    value: boolean;
    setCourseList: (setCourseList: itineraryList[]) => void;
    selectedCourse: itineraryList[];
}

let sameregion = ""
const AddEventsAndPlaces = ({ set, value, setCourseList, selectedCourse }: AddEventsProps) => {

    const { t } = useTranslation();

    const initial: any = {
        data: [{
            value: AuthStorage.getLang() === "en" ? "All" : "전체",
            label: `${t("Homepage.NavBar.All")}`
        }, {
            value: AuthStorage.getLang() === "en" ? "Only Locals Know" : "현지인만 아는",
            label: `${t("Homepage.NavBar.Local_Picks")}`
        }, {
            value: 'K-pop',
            label: `K-pop`
        }, {
            value: AuthStorage.getLang() === "en" ? "Festivals & Events" : "축제와 이벤트",
            label: `${t("Homepage.NavBar.Festivals")}`
        }, {
            value: AuthStorage.getLang() === "en" ? "Popular Destinations" : "인기명소",
            label: `${t("Homepage.NavBar.Popular")}`
        }
        ]
    }

    const [tourDetails, setTourDetails] = useState(false);

    const [tourIndex, setTourIndex] = useState<number>(0)
    const [hostingNotice, setHostingNotice] = useState(false);
    const [pageNo, setPageNo] = useState<number>(1)

    const selectedCountry = "South Korea"

    //Region
    const [region, setRegion] = useState<regionProps[]>([]);
    const [selectedReg, setSelectedReg] = useState<string>('');

    const getRegion = () => {
        ApiGet('itinerary/region')
            .then((res: any) => {
                setRegion(
                    [{ region: AuthStorage.getLang() === "en" ? "All" : "전체" },
                    ...res.data.region.map((x: any) => {
                        return { region: x.region };
                    })
                    ]
                );
            })
    }

    //Categories
    const [categories, setCategories] = useState<categoryProps[]>([])
    // const [selectedCategory, setSelectedCategory] = useState<string>('')

    const getCategory = () => {
        // ApiGet(`itinerary/category?name=${categories}`)
        //     .then((res: any) => {

        setCategories(
            initial.data.map((cat: any) => {
                return { category: cat.value, isSelected: false }
            })
        )

        // })
        ApiPost(`itinerary/tourcourse/filter?per_page=16&page_number=1`, {
            region: selectedReg,
            category: ''
        })
            .then((res: any) => {
                console.log("res.data", res.data);

                setTourCourse(res.data);
            })
    }

    useEffect(() => {
        getCategory();
    }, [selectedReg, AuthStorage.getLang()])

    useEffect(() => {
        getRegion();
    }, [AuthStorage.getLang()])



    //Itinerary List
    const [itinerary, setItinerary] = useState<itineraryList[]>([])


    // Tour courses details
    const [tourCourse, setTourCourse] = useState<tourCardProps>({
        count: 16,
        data: [{
            address: "",
            category: "",
            always_open: false,
            closing_date: "",
            country: "",
            id: "",
            image: [],
            mobile: "",
            n_p_transportation: "",
            name: "",
            opening_date: "",
            region: "",
            summary: "",
            website: "",
        }]
    })

    const tourCard = () => {
        ApiPost(`itinerary/tourcourse/filter?per_page=16&page_number=${pageNo}&keyword=${searchInput}`, {
            region: selectedReg,
            category: categories.filter(x => x.isSelected).map(y => y.category).join(",")
        })
            .then((res: any) => {
                setTourCourse(res.data);
            })
    }

    //For tour course checkbox options
    const setList = (e: React.ChangeEvent<HTMLInputElement>, iti: itineraryList) => {
        if (!itinerary.length) {
            sameregion = iti.region

            if (e.target.checked) {
                setItinerary(
                    [
                        ...itinerary,
                        iti
                    ]
                )
            }
        }

        if (itinerary.length) {
            if (sameregion === iti.region) {
                if (e.target.checked) {
                    setItinerary(
                        [
                            ...itinerary,
                            iti
                        ]
                    )
                }
                else {

                    setItinerary((prev) => prev.filter((x) => {
                        return x.id !== iti.id
                    }))
                }
            }
            else {
                setHostingNotice(true)
            }
        }
    }


    useEffect(() => {
        if (!itinerary.length) {
            sameregion = ""
        }
    }, [itinerary])

    useEffect(() => {
        tourCard();
    }, [categories, pageNo, value])


    //Search Filter
    const [searchInput, setSearchInput] = useState("");
    const Search = () => {
        tourCard()
    }

    //Checkbox selection
    const checkboxState = (e: React.ChangeEvent<HTMLInputElement>, selectedCat: categoryProps) => {
        setCategories(categories.map((category) => {
            if (category.category === selectedCat.category) {
                category.isSelected = e.target.checked
            }
            return category
        }))
    }


    // For selected Tour Courses
    useEffect(() => {
        setItinerary(selectedCourse);
    }, [selectedCourse, value])


    const setDate = (startDate: any, endDate: any) => {
        let date = "-";
        if (!startDate && !endDate) {
            date = "-";
        }
        else if (startDate && !endDate) {
            date = `${moment(startDate).format("YYYY.MM.DD")}`;
        }
        else {
            date = `${moment(startDate).format("YYYY.MM.DD")} - ${moment(endDate).format("YYYY.MM.DD")}`;
            // date = `${moment(startDate).format("YYYY.MM.DD") + " (" + moment(startDate).format("ddd") + ") " + moment(startDate).format("h:mm") + " - " + moment(endDate).format("h:mm")}`;
        }

        return date;
    }



    return (
        <>
            <Modal show={value} onHide={() => {
                setSelectedReg("");
                set(false);
                setItinerary([]);
                setSearchInput("");
            }}
                dialogClassName="tour-courses"
                aria-labelledby="example-custom-modal-styling-title"
            >

                <Modal.Body className="tour-course-modal p-0">
                    <div className="top-serach-tour">
                        <Modal.Header className="p-0">
                            <Modal.Title id="tour-course-title">
                                <h6 className="font-30-bold color-dark h-40">{t('Add_Place.Header')}</h6>
                                <img src="./img/ColorClose.svg" onClick={() => set(false)} style={{ cursor: 'pointer' }} />
                            </Modal.Title>
                        </Modal.Header>

                        <div className="mt-30">
                            <div className="d-flex align-items-center tour-courses-filter">
                                <div className="CountryTitle">
                                    <p className="country font-20-normal color-dark">{t('Add_Place.Country')}</p>
                                </div>
                                <div>
                                    <label className="country-p">{t('SouthKorea.South_Korea')}</label>
                                </div>
                            </div>

                            <div className="d-flex align-items-center tour-courses-filter mt-20">
                                <div className="CountryTitle">
                                    <p className="country font-20-normal h-30  color-dark mt-13">{t('Add_Place.City')}</p>
                                </div>

                                <div className="d-flex flex-wrap">
                                    {region.map((items: any) =>
                                        <div className="selectCity">
                                            <div className="radio-btn">
                                                <label className="radio-btn-detail ">
                                                    <input
                                                        type="radio"
                                                        name="city"
                                                        value={items.region}
                                                        onChange={(e) => {
                                                            setSelectedReg(e.target.value);
                                                            setCategories([]);
                                                            // setSelectedCategory('');
                                                        }} />
                                                    {items.region && <div className="radio-check font-16-normal color-darkgray">{items.region}</div>}
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="d-flex align-items-center tour-courses-filter-catagories mt-20">
                                <div>
                                    <div className="Catagories country">
                                        <p className="catagory font-20-normal color-dark">{t('Add_Place.Category')}</p>
                                        <p className="py-0 mb-0 catagory-span">{t('Add_Place.Span')}</p>
                                    </div>
                                </div>

                                <div className="categories d-flex align-itmes-center">
                                    {/* <button
                                        // ButtonStyle={categories.find(x => x.isSelected) ? "select-all-btn" : "select-all-btn-blue"}
                                        onClick={() => {
                                            setCategories(categories.map((category) => {
                                                category.isSelected = false;
                                                return category
                                            }));
                                        }}>{t('Add_Place.All')}</button> */}

                                    {categories.map((cat: any) =>
                                        <div className="selectCategory">
                                            <div className="radio-btn ">
                                                <label className="radio-btn-detail mb-0">
                                                    <input
                                                        type="checkbox"
                                                        name="city"
                                                        // value={cat.category}
                                                        checked={cat.isSelected}
                                                        onChange={(e: any) => {
                                                            checkboxState(e, cat);
                                                        }} />
                                                    {cat.category && <div className="radio-check font-16-normal">{cat.category}</div>}
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>


                        <div className="mt-40 tourSearchFilter d-flex align-items-center justify-content-between">
                            <input
                                name="itnerySearch"
                                value={searchInput}
                                // lablestyleClass=""
                                // InputstyleClass="search-input"
                                onChange={(e: any) => { setSearchInput(e.target.value) }}
                                placeholder={t('Add_Place.Keyword')}
                                type="text"
                            // fromrowStyleclass=""
                            />
                            <button
                                children={t('Add_Place.Search')}
                                // ButtonStyle="search-button"
                                onClick={Search}
                                className="search"
                            />
                        </div>
                        <div>
                        </div>

                    </div>

                    <div className="filter-results-div">
                        <div className="filter-result">
                            <h3 className="font-24-bold h-34">
                                {t('Add_Place.Results1')}&nbsp;
                                <span className="span-color-blue">{tourCourse?.count}</span>
                                {t('Add_Place.Results2')} &nbsp; ｜ &nbsp; {t('Add_Place.Selected1')}
                                <span className="span-color-blue">{itinerary.length}</span>&nbsp;
                                {t('Add_Place.Selected2')}
                            </h3>
                        </div>
                        <div className="">
                            <div className="d-flex flex-wrap modal-card-wrapper">
                                {tourCourse && tourCourse?.data?.map((cards, i) =>
                                    <div className={itinerary.map((x) => x.id).includes(cards.id) ? "modal-card b-red" : "modal-card b-trans"} onClick={() => { }} >
                                        <div className="position-relative tourCardContent">
                                            <div className="modal-card-content" onClick={() => { setTourIndex(i); setTourDetails(true) }}>
                                                <Image src={(cards?.image?.length == 0 || cards?.image?.[0] === "-" || cards?.image[0] == "undefined") ? "../../../img/download.png" : cards?.image?.[0]} alt="Tour Course Image" className="w-100 course-image" style={{ height: '140px', borderRadius: '20px 20px 0px 0px' }} />
                                                <div className="card-details">
                                                    <h3 className="font-18-bold color-dark h-28 over-hide">{cards.name}</h3>
                                                    <h4 className="font-16-normal color-gray h-20 over-hide">{cards.region} , {cards.country} </h4>
                                                    <h5 className="font-16-normal color-black mt-20">{cards.category}</h5>
                                                    {/* <h5 className="font-16-normal color-black mt-28">{cards.always_open ? "-" : setDate(cards.opening_date, cards.closing_date)}</h5> */}
                                                    <h5 className="font-16-normal color-black mt-28">{setDate(cards.opening_date, cards.closing_date)}</h5>
                                                </div>
                                            </div>
                                            <div className="checkboxes">
                                                <input
                                                    type="checkbox"
                                                    name="agree"
                                                    id="agree"
                                                    value="agree"
                                                    checked={itinerary.map(x => x.id).includes(tourCourse.data[i].id)}
                                                    onChange={(e: any) => {
                                                        const iti = { id: tourCourse.data[i].id, name: tourCourse.data[i].name, image: tourCourse.data[i].image, region: tourCourse.data[i].region }

                                                        setList(e, iti);
                                                    }}
                                                />
                                                <span className="CheckMark"></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {tourCourse.count > 3 ?
                            <div className="pagination-custom">
                                <Pagination
                                    itemClass="page-item-custom"
                                    activeLinkClass="activepage"
                                    linkClass="page-link-custom"
                                    linkClassFirst="page-first-arrow"
                                    prevPageText={<FontAwesomeIcon icon={faChevronLeft} />}
                                    firstPageText={<><FontAwesomeIcon icon={faAngleDoubleLeft} /></>}
                                    lastPageText={<><FontAwesomeIcon icon={faAngleDoubleRight} /></>}
                                    nextPageText={<FontAwesomeIcon icon={faChevronRight} />}
                                    activePage={pageNo}
                                    itemsCountPerPage={16}
                                    pageRangeDisplayed={10}
                                    totalItemsCount={tourCourse.count}
                                    onChange={(e: any) => {
                                        setPageNo(e);
                                    }}
                                />
                            </div>
                            : null}

                        <div className="d-flex align-itmes-center justify-content-center AddEventandPlace-btn">
                            <button
                                children={t('Add_Place.Cancel')}
                                className="cancle"
                                // ButtonStyle="host-own-cancel-btn w-280"
                                onClick={() => {
                                    set(false)
                                    setItinerary([]);
                                    setSelectedReg("");
                                }} />

                            <button
                                children={t('Add_Place.Add')}
                                className="host"
                                // ButtonStyle="host-btn w-280"
                                onClick={() => {
                                    setCourseList(itinerary);
                                    set(false);
                                    // setItinerary([]);
                                }} />
                        </div>
                    </div>
                </Modal.Body>
            </Modal>




            {/*Tour Course Details Modal */}
            <Modal show={tourDetails}
                onHide={() => { setTourDetails(false) }}
                dialogClassName="tour-details-modal"
                aria-labelledby="example-custom-modal-styling-title"
            >
                <Modal.Header className="p-0">
                    <Modal.Title id="tour-details-title">
                        <h6 className="font-30-bold color-dark h-40">{t('Tour_Course_Details.Header')}</h6>
                        <div className="TourClose" >
                            <img src="./img/ColorClose.svg" onClick={() => setTourDetails(false)} style={{ cursor: 'pointer' }} />
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="itinery_details_modal p-0">
                    {tourCourse.data && <div className="tour-details-body">
                        <table className="tour-details-table">
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.City')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray h-28">{tourCourse?.data[tourIndex]?.region + ", " + tourCourse?.data[tourIndex]?.country}</h6></td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.Category')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray h-28">{tourCourse?.data[tourIndex]?.category}</h6></td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.Name')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray h-28">{tourCourse?.data[tourIndex]?.name}</h6></td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.Photos')}</h6></th>
                                <td>
                                    <div className="upload-pic">
                                        {tourCourse?.data[tourIndex]?.image.map((data) =>
                                            < img src={(data == "-" || data == "undefined") ? "../../../img/download.png" : data} alt="" style={{ width: '160px', height: '100px', marginRight: '10px' }} />
                                            // < img src={data == "" ? data : "../../img/download.png"} alt="" style={{ width: '160px', height: '100px', marginRight: '10px' }} />
                                        )}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.Date')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray h-28">
                                    {
                                        setDate(tourCourse?.data[tourIndex]?.opening_date, tourCourse?.data[tourIndex]?.closing_date)
                                    }
                                </h6></td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black about-th">{t('Tour_Course_Details.About')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray about-td">{tourCourse?.data[tourIndex]?.summary}</h6></td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.Address')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray h-28">{tourCourse?.data[tourIndex]?.address}</h6></td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.URL')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray h-28">{tourCourse?.data[tourIndex]?.website}</h6></td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.Phone_Number')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray h-28">{tourCourse?.data[tourIndex]?.mobile}</h6></td>
                            </tr>
                            <tr>
                                <th><h6 className="font-16-bold color-black">{t('Tour_Course_Details.Nearest_Public_Trasportation')}</h6></th>
                                <td><h6 className="font-16-normal color-darkgray h-28">{tourCourse?.data[tourIndex]?.n_p_transportation}</h6></td>
                            </tr>
                        </table>
                    </div>}
                </Modal.Body>
            </Modal>

            <Modal
                show={hostingNotice}
                onHide={() => {
                    setHostingNotice(false);
                }}
                dialogClassName="welcome-modal addonly-one"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Body className="p-0">
                    <div className="modal-signup-title ">
                        <h3 className="color-dark h-36">{t('One_Time_Tour.Header')}</h3>
                    </div>
                    <div className=" mt-48 sameNoticeContent">
                        <div className="sameNoticeInner">
                            <p className="text-center color-black font-16-normal h-36">{t('One_Time_Tour.ParaGraph')}</p>
                        </div>

                    </div>
                </Modal.Body>
                <div className="w-100 mt-28">
                    <div className="AddNoticeBtn">
                        <button
                            // ButtonStyle="app-sent-ok w-240"
                            onClick={() => {
                                setHostingNotice(false);
                            }}
                        >
                            {t('One_Time_Tour.NotBtn')}
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default AddEventsAndPlaces;