import React, { useState, useEffect, useRef } from "react";
import { Button } from "react-bootstrap";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useLocation, useHistory } from "react-router-dom";
import * as QueryString from "query-string";
import { ApiGet } from "../../helper/API/ApiData";
import HostList from "./HostList";
import Reviews from "./Reviews";
// import UserHostList from "./UserHostList";
import HostProfile from "./HostProfile";
// import ApplicationPax from "./ApplicationPax";
import { RootStateOrAny, useSelector } from "react-redux";
import Event from "./Event";
import UserHostList from "./UserHostList";
import ApplicationPax from "./ApplicationPax";

interface user {
  age_group: string;
  avatar: string;
  dob: string;
  first_name: string;
  flag: string;
  gender: string;
  hostWishlist: any[];
  id: string;
  last_name: string;
  like: boolean;
  nationality: string;
}
interface hostingUser {
  date: string;
  end_time: string;
  host_information: string;
  id: string;
  location: string;
  participate_count: number;
  pax: number;
  req_status: string;
  start_time: string;
  status: string;
  transportation: string;
  type: string;
  user: user;
}

const ItineraryDetails = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState<number>(0);
  const [data, setData] = useState<any>([]);
  const [review, setReview] = useState<any>([]);
  const [refresh, setRefresh] = useState(0);
  const [refreshHost, setRefreshHost] = useState(0);
  const [hostingUser, setHostingUser] = useState<hostingUser[]>([]);
  const [isCompas, setIsCompas] = useState<string>("");
  const [refreshPax, setRefreshPax] = useState(0);
  const [refreshReview, setRefreshReview] = useState<number>(0);
  const [host, setHost] = useState<any>();
  const [isJoined, setIsJoined] = useState<string>();

  const [isHostingCompleted, setIsHostingCompleted] = useState(false);

  const [showHostProfile, setShowHostProfile] = useState(false);

  const { userData } = useSelector((state: RootStateOrAny) => state.userData);

  const history = useHistory();
  const params = QueryString.parse(history.location.search);

  const focus = useRef(null);
  const topFocus = useRef(null);

  const pathname = useLocation();


  useEffect(() => {
    window.scrollTo(0, 0);
    getHostingUser();

    if (history.action === "POP") {
      setIsCompas("");
      return;
    }
  }, [pathname, refreshPax]);

  const getItinerary = () => {
    ApiGet(`itinerary/itinerary-course/${params.id}`)
      .then((data: any) => {
        data.data.images = data.data?.images;
        setData(data.data);
      })
      .catch(() => setData([]));
    ApiGet(`itinerary/review-by-itinerary/${params.id}`)
      .then((data: any) => setReview(data.data))
      .catch(() => setReview([]));
  };
  useEffect(() => {
    ApiGet(`itinerary/review-by-itinerary/${params.id}`)
      .then((data: any) => setReview(data.data))
      .catch(() => setReview([]));
  }, [refreshReview]);

  const getHostingUser = () => {
    ApiGet(`hosting/host-itinerary/${params.id}`).then((res: any) => {
      setHostingUser(res.data);
      setHost(res?.data.filter((x: any) => x?.user?.id === userData?.id)[0]);
    })
  };

  useEffect(() => {
    getHostingUser();
  }, [refreshHost, userData]);

  useEffect(() => {
    getItinerary();
    getHostingUser();
  }, []);

  return (
    // <div className="mt-211 tour-single-page">
    <div className='ninetwenty-container'>
      <div className='mini-container'>
        <div className='event-info-page'>
          <div className='images-main d-flex'>
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

              {(data?.images && data?.images[1]) ?
                <img src={data.images && data.images[1]} alt="" /> : ""
              }
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
          </div>

          <div className="main-container">
            <div className="d-flex">
              <div className="w-740">
                <Event reviews={review ? review : null} />
                {(!(
                  hostingUser[0]?.user.id === userData?.id &&
                  hostingUser[0]?.status !== "COMPLETED"
                ) ||
                  (hostingUser.map((x) => x.user.id).includes(userData?.id) &&
                    hostingUser.filter((x) => x.user.id === userData?.id)[0]
                      ?.status === "COMPLETED")) && (review?.recentReview?.length !== 0) && (
                    <Reviews reviews={review ? review : null} />
                  )}
              </div>

              <div ref={topFocus} className="ml-auto">
                {data.creator === "Compastrips" && isCompas === "" ? (
                  <>
                    <HostList
                      focus={focus}
                      showHostProfile={showHostProfile}
                      setShowHostProfile={setShowHostProfile}
                      data={data}
                      refreshHost={refreshHost}
                      setIsCompas={setIsCompas}
                      setRefreshPax={setRefreshPax}
                      refresh={refresh}
                      setIsJoined={setIsJoined}
                      setIsHostingCompleted={setIsHostingCompleted}
                      setRefreshHost={setRefreshHost}
                    />
                  </>
                ) : (
                  (data.creator === "Host" || isCompas) && (
                    <>
                      <UserHostList
                        setRefreshReview={setRefreshReview}
                        refresh={refresh}
                        isCompas={isCompas}
                        setIsHostingCompleted={setIsHostingCompleted}
                      />
                    </>
                  )
                )}
              </div>
            </div>
          </div>

          {host && host?.status !== "COMPLETED" && (
            <div className="w-100">
              <ApplicationPax
                refreshHost={refreshHost}
                setRefresh={setRefresh}
                hostingID={hostingUser.find((x) => x.user.id === userData?.id)?.id}
                refreshPax={refreshPax}
                isHostingCompleted={isHostingCompleted}
              />
            </div>
          )}

          <div className="mini-container">
            {showHostProfile ? (
              <div ref={focus}>
                <HostProfile
                  topFocus={topFocus}
                  setRefreshHost={setRefreshHost}
                  setShowHostProfile={setShowHostProfile}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};

export default ItineraryDetails;
