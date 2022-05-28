import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import According from '../../common/According';
import { ApiGet, ApiPost } from '../../helper/API/ApiData';
import * as QueryString from "query-string";
import { useTranslation } from 'react-i18next';
import { RootStateOrAny, useSelector } from 'react-redux';
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Rating from 'react-rating';


function Event(props: any) {

    const [clicked, setClicked] = useState("0");
    const [photoIndex, setPhotoIndex] = useState<number>(0);
    const [showAcc, setShowAcc] = useState<any>([]);

    const [data, setData] = useState<any>([]);
    const [review, setReview] = useState<any>([]);
    const [isOpen, setIsOpen] = useState(false);

    let lastElement = data?.courses?.slice(-1);


    const { t } = useTranslation();
    const history = useHistory()

    const { is_loggedin } = useSelector((state: RootStateOrAny) => state?.login);
    const params = QueryString.parse(history.location.search);

    useEffect(() => {
        getItinerary();
    }, []);

    const handleToggle = (index: any) => {

        if (clicked === index) {
            return setClicked("0");
        }
        setClicked(index);

    };

    const getItinerary = () => {
        ApiGet(`itinerary/itinerary-course/${params.id}`)
            .then((data: any) =>
                setData(data.data)
            )
            .catch(() => setData([]));
        ApiGet(`itinerary/review-by-itinerary/${params.id}`)
            .then((data: any) => setReview(data.data))
            .catch(() => setReview([]));
    };

    //Like function
    const [delayLike, setDelayLike] = useState(false);
    const Like = (id: any) => {
        setDelayLike(true);
        setData((prev: any) => {
            return {
                ...prev,
                like: !prev.like,
            };
        });

        ApiPost(`itinerary/wishlist/${id}`, {})
            .then((res) => {
                setDelayLike(false);
            })
            .catch((err) => {
                // console.log("Fail", err);
            });
    }
    return (
        <div className='ninetwenty-container'>
            <div className='mini-container'>
                <div className=''>
                    {/* <div className='images-main d-flex'>
                        <div className='main-images position-relative'>
                            <img src={data.images && data.images[0]} alt="" />
                            <button
                                className="itinerary-viewAll-btn"
                                onClick={() => {
                                    setIsOpen(true);
                                }}
                            >
                                View All {data.images && data.images.length} Photos
                            </button>
                        </div>
                        <div className='small-main-images'>
                           
                            <img src={data.images && data.images[1]} alt="" />
                            {(data?.images && data?.images[2]) ?
                                <img src={data?.images && data?.images[2]} alt="" /> : ""
                            }
                            {(data?.images && data?.images[3]) ?
                                <img src={data?.images && data?.images[3]} alt="" /> : ""
                            }
                            {(data?.images && data?.images[4]) ?
                                <img src={data?.images && data?.images[4]} alt="" /> : ""
                            }
                        </div>

                        {isOpen && (
                            <Lightbox
                                mainSrc={data.images[photoIndex]}
                                nextSrc={data.images[(photoIndex + 1) % data.images.length]}
                                prevSrc={
                                    data.images[
                                    (photoIndex + data.images.length - 1) %
                                    data.images.length
                                    ]
                                }
                                imageTitle={photoIndex + 1 + "/" + data.images.length}
                                onCloseRequest={() => {
                                    setIsOpen(false);
                                }}
                                onMovePrevRequest={() => {
                                    setPhotoIndex(
                                        (photoIndex + data.images.length - 1) %
                                        data.images.length
                                    );
                                }}
                                onMoveNextRequest={() => {
                                    setPhotoIndex((photoIndex + 1) % data.images.length);
                                }}
                            />
                        )}
                    </div> */}

                    <div className='d-flex justify-content-between event-info-main-inner'>
                        <div className='event-info-inner'>

                            <div className='title-single-event d-flex justify-content-between'>
                                <h3>{data.title}</h3>

                                <>
                                    <div className='heart-section'>
                                        {/* <img src="./img/blank-heart.svg" alt="" /> */}
                                        <input
                                            type="checkbox"
                                            checked={data.like}
                                            disabled={delayLike}
                                            onClick={is_loggedin === true ? () => Like(data.id) : () => { }}
                                            id={data.id}
                                            className="instruments"
                                        />
                                        <label
                                            htmlFor={data.id}
                                            className={is_loggedin ? `text-white check` : `text-white`}
                                        >
                                            {!(data.like) && <img src="./img/Favourite.png" alt="" />}
                                        </label>
                                        {/* <img src="./img/heart.svg" alt="" /> */}
                                    </div>
                                </>
                            </div>

                            <div className='location-single-event'>
                                <img src="./img/location-card.svg" alt="" />
                                <span>{data.region}, {data.country}</span>
                            </div>

                            <div className='star-single-event'>
                                {/* <img src="./img/color-star.svg" alt="" />
                                <img src="./img/color-star.svg" alt="" />
                                <img src="./img/color-star.svg" alt="" />
                                <img src="./img/color-star.svg" alt="" />
                                <img src="./img/star.svg" alt="" /> */}
                                <Rating
                                    className='ratingStar'
                                    emptySymbol={
                                        <img src="./img/star.svg" className="mr-1" alt="" />
                                    }
                                    fullSymbol={<img src="./img/color-star.svg" className="mr-1" alt="" />}
                                    initialRating={props?.reviews.star}
                                    readonly={true}
                                    stop={5}

                                />
                            </div>

                            <p className='createdby'>
                                {data.created_by_show}&nbsp;<span className={data.creator_show === "Host" ? "host-green" : "compastrips-span"}>{data.creator_show}</span>
                            </p>
                            <div className='itenery-accordin'>
                                <div className='accordian-itinery-title'>
                                    <h3>{t('Itinerary_Desc.Itinerary')}</h3>
                                </div>
                                <div className='accordian-itinery'>
                                    {data.courses &&
                                        data.courses.map((items: any, i: number) => (
                                            // setShowAcc([...showAcc, { items.id:false}])
                                            <According items={items} index={i + 1} showAcc={showAcc} setShowAcc={setShowAcc} />
                                        ))}
                                </div>
                            </div>

                            <div className='about-tour-event'>
                                <h5>{t('Itinerary_Desc.About_the_tour')}</h5>
                                <h6>{data.info}</h6>
                            </div>

                            <div className='schedule-tour'>
                                <h5>{t('Itinerary_Desc.Schedule')}</h5>
                                <div className='d-flex align-items-center flex-wrap'>
                                    {data.courses &&
                                        data.courses.map((item: any, i: number) => (
                                            <h6>{item.name} &nbsp; {data?.courses?.length === i + 1 ? " " : "→"} &nbsp;</h6>
                                        ))}
                                </div>

                                <ul>
                                    <li>{t('Host_Details.Schedule1')}</li>
                                    <li>{t('Host_Details.Schedule2')}</li>
                                </ul>
                            </div>

                            {/* <div className='total-review-about'>
                                <div className='review-title'>
                                    <h3>Reviews <span>19</span></h3>
                                </div>
                                <div className='d-flex align-items-center total-rating-with-star'>
                                    <div className='total-per-rating'>
                                        <h4>4.0</h4>
                                    </div>
                                    <div className='tour-rating'>
                                        <img src="./img/color-star.svg" alt="" />
                                        <img src="./img/color-star.svg" alt="" />
                                        <img src="./img/color-star.svg" alt="" />
                                        <img src="./img/color-star.svg" alt="" />
                                        <img src="./img/star.svg" alt="" />
                                    </div>
                                </div>

                                <div className='host-review-row'>
                                    <div className='single-host-review'>
                                        <div className='usre-review-info'>
                                            <img src="./img/user-suah.svg" alt="" />
                                            <div className='review-date-name'>
                                                <h4>Suah Hong</h4>
                                                <h5>December 2020</h5>
                                            </div>
                                        </div>
                                        <div className='rating-with-single'>
                                            <img src="./img/color-star.svg" alt="" />
                                            <h5>4.0 Very Good</h5>
                                        </div>
                                        <div className='readmore-content'>

                                            <ReadMore>I was able to relax my busy mind at the templestay. I’d want to come here again! Thank you for a wonderful tour. Everything.. I was able to relax my busy mind at the templestay. I’d want to come here again! Thank you for a wonderful tour. Everything </ReadMore>
                                        </div>
                                    </div>


                                    <div className='single-host-review'>
                                        <div className='usre-review-info'>
                                            <img src="./img/user-suah.svg" alt="" />
                                            <div className='review-date-name'>
                                                <h4>Suah Hong</h4>
                                                <h5>December 2020</h5>
                                            </div>
                                        </div>
                                        <div className='rating-with-single'>
                                            <img src="./img/color-star.svg" alt="" />
                                            <h5>4.0 Very Good</h5>
                                        </div>
                                        <div className='readmore-content'>

                                            <ReadMore>I was able to relax my busy mind at the templestay. I’d want to come here again! Thank you for a wonderful tour. Everything.. I was able to relax my busy mind at the templestay. I’d want to come here again! Thank you for a wonderful tour. Everything </ReadMore>
                                        </div>
                                    </div>


                                    <div className='single-host-review'>
                                        <div className='usre-review-info'>
                                            <img src="./img/user-suah.svg" alt="" />
                                            <div className='review-date-name'>
                                                <h4>Suah Hong</h4>
                                                <h5>December 2020</h5>
                                            </div>
                                        </div>
                                        <div className='rating-with-single'>
                                            <img src="./img/color-star.svg" alt="" />
                                            <h5>4.0 Very Good</h5>
                                        </div>
                                        <div className='readmore-content'>

                                            <ReadMore>I was able to relax my busy mind at the templestay. I’d want to come here again! Thank you for a wonderful tour. Everything.. I was able to relax my busy mind at the templestay. I’d want to come here again! Thank you for a wonderful tour. Everything </ReadMore>
                                        </div>
                                    </div>


                                    <div className='single-host-review'>
                                        <div className='usre-review-info'>
                                            <img src="./img/user-suah.svg" alt="" />
                                            <div className='review-date-name'>
                                                <h4>Suah Hong</h4>
                                                <h5>December 2020</h5>
                                            </div>
                                        </div>
                                        <div className='rating-with-single'>
                                            <img src="./img/color-star.svg" alt="" />
                                            <h5>4.0 Very Good</h5>
                                        </div>
                                        <div className='readmore-content'>

                                            <ReadMore>I was able to relax my busy mind at the templestay. I’d want to come here again! Thank you for a wonderful tour. Everything.. I was able to relax my busy mind at the templestay. I’d want to come here again! Thank you for a wonderful tour. Everything </ReadMore>
                                        </div>
                                    </div>
                                </div>
                            </div> */}
                        </div>

                        {/* <div className=''>
                            <HostList />
                            <HostInfo />
                        </div> */}

                    </div>

                </div>
            </div>
        </div>

    )
}

export default Event