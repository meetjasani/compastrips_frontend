import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import HostPro from '../../components/HostPro';
import { ApiGet, ApiPost } from '../../helper/API/ApiData';
import { checkImageURL } from '../../helper/utils';

interface hostprops {
  items: any;
  searchHosts: any;
  setCountData: any;
  hostingGet: any;
  setRefresh: (setRefresh: any) => void;
}

const HostCard: React.FC<any> = ({ items, searchHosts, setRefresh, setCountData, hostingGet }: hostprops) => {



  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [hostingId, setHostingId] = useState<string>("");
  const [like, setLike] = useState(items.isLike);
  const [delayLike, setDelayLike] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean>(false);


  const Like = (id: any) => {
    setIsLiked(!isLiked);
    setDelayLike(true);
    ApiPost(`user/wishlist/${id}`, {})
      .then((res) => {
        searchHosts()
        hostingGet()
        // setRefresh(Math.random());
      })
      .catch((err) => {
      });
  };

  return (
    <>
      <div className="w-100 whistlist-host">
        <div className="host d-flex align-items-center" onClick={() => {
          // history.push(`/itinerary?id=${items.itinerary_id}`)
          setHostingId(items.hosting_id);
          setShow(true);
        }}>
          <div>
            <img src={items.avatar || "./img/Avatar.png"} alt="" style={{ width: '54px', height: '54px', borderRadius: '50%' }} />
          </div>
          <div className="ml-20 w-100 mainWishUserContent d-flex align-items-center">
            <div>
              <div className="d-flex align-items-center">
                <div className="d-flex align-items-center img-join-host h-36 ">
                  <h5 className="font-20-bold color-dark mr-18">
                    {items.user_name}
                  </h5>
                  &nbsp;
                  <img src={checkImageURL(items.nationality)} alt="flag" style={{ width: '19.79px', height: '19.98px', borderRadius: '50%' }} />
                </div>
              </div>

              <div className="host-info mt-14 d-flex align-items-center">
                <div
                  className={
                    items.host_type === "Local"
                      ? "local-host-bg hots-tags"
                      : "travel-host-bg hots-tags"
                  }
                >
                  <p className="info">{items.host_type === "Local" ? t("Local_Host") : t("Traveler_Host")}</p>
                </div>
                <div className="wishHost">
                  <p className="info">{items.gender === "MALE" ? t("Male") : t("Female")}</p>
                </div>
                <div className="wishHost">
                  <p className="info">{items.age_group}{t("Age_Groups")}</p>
                </div>
              </div>

              {/* <div className="d-flex whishlist-hostpro ml-auto">
                <div className="tout-created ml-auto">
                  <div className="download-heart-icon button">
                    <div className="heart-div">
                      <input
                        type="checkbox"
                        id="id2"
                        checked={true}
                        className="instruments"
                      />
                      <label
                        htmlFor="id2"
                        className="text-white check mb-0"
                      >
                        {false && <img src="./img/Favourite.png" alt="" className='wishFavourite' />}
                      </label>
                    </div>
                  </div>
                </div>
              </div> */}

            </div>

            <div className="d-flex whishlist-hostpro ml-auto">
              <div className="d-flex whishlist-hostpro ml-auto" onClick={(e: any) => { e.stopPropagation(); }}>
                <div className="tout-created ml-auto">
                  <div className="download-heart-icon button">
                    <div className="heart-div">

                      {/* <label
                      htmlFor={items.id}
                      className="text-white check mb-0"
                    > */}
                      <input
                        type="checkbox"
                        id={items.id}
                        checked={items.isLike}
                        disabled={delayLike}
                        // onClick={canlike ? () => Like(items.id) : () => { }}
                        className="instruments"
                      />
                      <label htmlFor={items.id} className={`text-white check`} onClick={() => Like(items.id)}>
                        {!items.isLike && (
                          <img
                            src="./img/Favourite.png"
                            className="TourFavImg"
                            alt=""
                          />
                        )}
                      </label>
                      {/* {false && <img src="./img/Favourite.png" alt="" className='wishFavourite' />} */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      {
        show && <HostPro
          hostingId={hostingId}
          show={show}
          setShow={setShow}
          data=""

        >
        </HostPro>
      }
    </>
  )
}

export default HostCard
