import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ApiDelete, ApiPost } from "../../helper/API/ApiData";
import { useTranslation } from "react-i18next";
import Rating from "react-rating";
import moment from "moment";
import AuthStorage from "../../helper/AuthStorage";

interface tourCardProps {
  items: any;
  canlike: boolean;
  isCancled: boolean;
  itineraryCount: any
  UpdateCount: (UpdateCount: any) => void;
  setRefresh: (setRefresh: any) => void;
}

const TourCard: React.FC<any> = ({
  items,
  canlike,
  isCancled,
  UpdateCount,
  setRefresh,
}: tourCardProps) => {


  const [like, setLike] = useState(items.isLike);
  const [data, setData] = useState<any>(items);


  const { t } = useTranslation();

  //Like Function
  const [delayLike, setDelayLike] = useState(false);
  const Like = (id: any) => {

    setDelayLike(true);
    setData((prev: any) => {
      return {
        ...prev,
        isLike: !prev.isLike,
      };
    });
    // setLike((prev: boolean) => !prev);
    // if (!like) {
    //   UpdateCount((prev: number) => prev);
    // }
    // else {
    //   UpdateCount((prev: number) => prev);
    // }
    ApiPost(`itinerary/wishlist/${id}`, {})
      .then((res) => {
        setRefresh(Math.random());
        setDelayLike(false);
      });
  };

  const Remove = (participant_id: any) => {
    ApiDelete(`user/deleteItineraryUserApplied/${participant_id}`, {})
      .then((res) => {
        setRefresh(Math.random());
      })
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
    // return month[y] + " " + w + "," + z;
    return moment(x).locale(AuthStorage.getLang()).format("LL")
  };

  const changeTimeFormat = (time: string) => {
    if (time) {
      let Time = time.split(":");
      return Time[0] + ":" + Time[1];
    }
  };

  return (
    <div>
      <div className='single-card-tour'>
        {isCancled && (
          <div className="canceled-tour-card">
            <h1 className="font-34-bold">{t("My_Account.Hosting_Canceled")}</h1>
            <button
              // ButtonStyle="Remove-btn mt-32"
              onClick={() => Remove(items.participant_id)}
            >
              {t("My_Account.Remove")}
            </button>
          </div>
        )}
        <Link to={`/itinerary?id=${items?.id}&hostingId=${items.hosting_id}`}>
          {/* <div className='wishlistimg' style={{ backgroundImage: `url(${items?.image[0]})` }} ></div> */}
          <div className="wishlistimg">
            <img
              src={items?.image ? items?.image[0] : ""}
              className="w-100"
              style={{ height: '100%', borderRadius: '20px 0px 0px 20px' }}
              alt=""
            /></div>
        </Link>
        <div className=' card-box'>
          <div className='tour-card-data d-flex align-items-center justify-content-between'>
            <Link to={`/itinerary?id=${items.id}&hostingId=${items.hosting_id}`}>
              <h4>{items.title}</h4>
            </Link>
            <p className="font-18">
              {items.created_by_show}{" "}
              <span
                className={
                  items.creator === "Host"
                    ? "green-font font-18-bold"
                    : "blue-font font-18-bold"
                }
              >
                {items.creator_show}
              </span>
            </p>
          </div>

          <div className="d-flex align-items-center">
            <div>
              <div className='location-row d-flex align-items-center'>
                <img src="./img/location-card.svg" alt="" style={{ marginRight: '10px' }} />
                <p>{items.region}, {items.country}</p>
              </div>
              <div className='d-flex align-items-center star-row'>
                <div className='star-list'>
                  <Rating
                    emptySymbol={<img src="./img/star.svg" className="mr-1" alt="" style={{ width: '16px', height: '16px' }} />}
                    fullSymbol={<img src="./img/color-star.svg" className="mr-1" alt="" style={{ width: '16px', height: '16px' }} />}
                    initialRating={items.star}
                    readonly={true}
                    stop={5}
                  />
                </div>
                <div className="star-reviews">
                  <p className="font-16">
                    {items.star} ∙ {t("TourList.Reviews")}{" "}
                    {items.review_count}
                  </p>
                </div>
              </div>
            </div>

            <div className="tout-created ml-auto">
              <div className="download-heart-icon button d-flex">
                <div className="heart-div">
                  <input
                    type="checkbox"
                    id={data.id}
                    checked={data.isLike}
                    disabled={delayLike}
                    onClick={() => Like(data.id)}
                    // onClick={canlike ? () => Like(data.id) : () => { }}
                    className="instruments"
                  />
                  <label htmlFor={data.id} className={`text-white check`}>
                    {!(data.isLike) && (
                      <img
                        src="./img/Favourite.png"
                        className="TourFavImg"
                        alt=""
                      />
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="route-setting d-flex align-items-center">
            {items?.course?.map((tourtag: any) => (
              <p className="single-tag font-14">
                {tourtag.name}
                <span className="tooltiptext">{tourtag.name}</span>
              </p>

            ))}
          </div>

          {/* <div className='route-setting'>

            {items?.course?.map((tourtag: any, index: any) => (
              index < 10 &&
              <p>{tourtag.name.slice(0, 8)}...</p>

            ))}
          </div> */}

          <div className='date-with-host'>
            <div className='date-tour-card'>

              {items.creator === "Host"
                ?
                <h5>
                  {changeDateType(items.start_date)} {changeTimeFormat(items.start_time)} - {changeTimeFormat(items.end_time)}
                </h5>
                :
                <h5>
                  {changeDateType(items.start_date)} -{" "}
                  {changeDateType(items.end_date)}
                </h5>
              }
            </div>
            <div className='ml-auto tout-total-host'>
              <h6>
                <span>{items.host_count}</span> &nbsp;
                {t('My_Account.Hosts')}
              </h6>
            </div>
          </div>

        </div>
      </div>


      {/* <div className="card-box mb-40 custom-flex-margin d-md-flex tourcard-in-myaccount">
        {isCancled && (
          <div className="canceled-tour-card">
            <h1 className="font-34-bold">{t("My_Account.Hosting_Canceled")}</h1>
            <button
              // ButtonStyle="Remove-btn mt-32"
              onClick={() => Like(items.id)}
            >
              {t("My_Account.Remove")}
            </button>
          </div>
        )}
        <div className="p-0">
          <Link to={`/itinerary?id=${items.id}&hostingId=${items.hosting_id}`}>
            <div className="card-image-main">
              <img
                src={items?.image ? items?.image[0] : ""}
                className="w-100"
                alt=""
              />
            </div>
          </Link>
        </div>
        <div className="w-100 detailsCardsContainer">
          <div className="main-tour-card-data">
            <div className="d-md-flex w-100">
              <div className="tour-card-data">
                <Link to={`/itinerary?id=${items.id}&hostingId=${items.hosting_id}`}>
                  <h4 className="font-28-bold h-34">{items.title}</h4>
                </Link>
              </div>
              <div className="tour-created ml-auto ">
                <p className="font-18">
                  {items.created_by_show}{" "}
                  <span
                    className={
                      items.creator === "Host"
                        ? "green-font font-18-bold"
                        : "blue-font font-18-bold"
                    }
                  >
                    {items.creator_show}
                  </span>
                </p>
              </div>
            </div>

            <div className="d-flex align-items-center w-100">
              <div className="tour-card-address">
                <h4 className="font-18  mt-14">
                  <img src="./img/grayLocation.svg" className="mr-2" alt="" />
                  {items.region} , {items.country}
                </h4>
                <div className="d-flex align-items-center star-row">
                  <div className="star-list">
                    <Rating
                      emptySymbol={
                        <img
                          src="./img/star.svg"
                          className="mr-1"
                          alt=""
                          style={{ width: '16px', height: '16px' }}
                        />
                      }
                      fullSymbol={
                        <img src="./img/color-star.svg" className="mr-1" alt="" style={{ width: '16px', height: '16px' }} />
                      }
                      initialRating={items.star}
                      readonly={true}
                      stop={5}
                    />
                  </div>
                  <div className=" star-reviews">
                    <p className="font-16">
                      {items.star} ∙ {t("TourList.Reviews")}{" "}
                      {items.review_count}
                    </p>
                  </div>
                </div>
              </div>
              <div className="tout-created ml-auto">
                <div className="download-heart-icon button d-flex">
                  <div className="heart-div">
                    <input
                      type="checkbox"
                      id={items.id}
                      checked={like}
                      disabled={delayLike}
                      onClick={canlike ? () => Like(items.id) : () => { }}
                      className="instruments"
                    />
                    <label htmlFor={items.id} className={`text-white check`}>
                      {!like && (
                        <img
                          src="./img/Favourite.png"
                          className="w-20"
                          alt=""
                        />
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <div className="tages d-flex align-items-center">
              {items?.course?.map((tourtag: any) => (
                <p className="single-tag font-14">{tourtag.name}</p>
              ))}
            </div>

            <div className="d-md-flex w-100">
              <div className="tour-card-data-date">
                {items.creator === "Host" ? (
                  <h4 className="font-18">
                    {changeDateType(items.start_date)}{" "}
                    {changeTimeFormat(items.start_time)} -{" "}
                    {changeTimeFormat(items.end_time)}
                  </h4>
                ) : (
                  <h4 className="font-18">
                    {changeDateType(items.start_date)} -{" "}
                    {changeDateType(items.end_date)}
                  </h4>
                )}
              </div>
              <div className="tout-created-host ml-auto">
                <p className="font-18-bold">
                  <span>
                    {" "}
                    {items.host_count}
                    {t("TourList.People")}
                  </span>
                  {t("TourList.Host")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default TourCard;
