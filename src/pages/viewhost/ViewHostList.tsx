import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import HostPro from "../../components/HostPro";
import { ApiGet } from "../../helper/API/ApiData";
import AuthStorage from "../../helper/AuthStorage";
import { checkImageURL } from "../../helper/utils";
// import HostPro from "../../components/HostPro";

interface hostList {
  age_group: string;
  avatar: string;
  country_flag: string;
  gender: string;
  name: string;
  nationality: string;
  type: string;
  hosting_id: string;
}

interface viewHostListProps {
  hostType: string[];
  gender: string[];
  ageGroup: string[];
}
interface course {
  courses: string[];
  image: string;
}

export interface hosting {
  date: string;
  end: string;
  participate_count: number;
  pax: number;
  start: string;
  type: string;
}


interface itinerary {
  id: string;
  country: string;
  region: string;
  title: string;
}

interface review {
  like: number;
  review: number;
  star: string;
}

interface user {
  age: string;
  avatar: string;
  flag: string;
  gender: string;
  id: string;
  name: string;
  user_name: string;
  like: boolean;
  nationality: string;
}
export interface hostingList {
  course: course;
  hosting: hosting;
  itinerary: itinerary;
  review: review;
  user: user;
}

const ViewHostList = (props: viewHostListProps) => {
  const [hosts, setHosts] = useState<hostList[]>([]);
  const [hostingId, setHostingID] = useState<string>("");

  const { hostType, gender, ageGroup } = props;


  useEffect(() => {
    ApiGet(
      `hosting/hosts?host=${hostType.length === 1 ? hostType[0] : ""}&gender=${gender.length === 1 ? gender[0] : ""
      }&age=${ageGroup.join(",")}`
    ).then((res: any) => {
      setHosts(res.data);
    });
  }, [props]);

  const [welcome, setWelcome] = useState(false);


  //for translation
  const { t } = useTranslation();

  return (
    <div>
      <div className='host-list-main-sidebar'>
        <div className='list-main-sidebar-inner'>
          {hosts.map((items: any, i: number) =>
            <div className='single-local-host' onClick={() => {
              setHostingID(items.hosting_id);
              setWelcome(true);
            }}>
              <div className='single-local-host-inner'>
                <div className='single-local-host-profile'>
                  <img src={items.avatar || "./img/Avatar.png"} alt="" />
                  <div className='pro-tag-name'>
                    <div className='pro-name-suah'>
                      <h3>{items.user_name}</h3>
                      {/* <h3>{items.name} {items.surname}</h3> */}
                      {/* <img src={items.avatar ? items.avatar : "./img/flag.svg"} alt="" /> */}
                      <img src={checkImageURL(items?.nationality)} alt="" />
                    </div>
                    <div className='pro-tag-suah'>
                      {items.type === "Local"
                        ?
                        <div className='host-catrgory'><p>{items.type === "Local" ? t("Local_Host") : ""}</p></div>
                        :
                        <div className='travel-host-catrgory'><p>{items.type === "Travel" ? t("Traveler_Host") : ""}</p></div>
                      }

                      {items.gender === "FEMALE"
                        ?
                        <div className='host-gender'><p>{t("Female")}</p></div>
                        :
                        <div className='host-gender-male'><p>{t("Male")}</p></div>
                      }
                      <div className='host-ages'>
                        {AuthStorage.getLang() === "en" ? <p>{items.age_group}'{t("Age_Groups")}</p> : <p className="d-flex align-items-center">{items.age_group}<span>{t("Age_Groups")}</span></p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {
        welcome && <HostPro
          hostingId={hostingId}
          show={welcome}
          setShow={setWelcome}
        >
        </HostPro>
      }

    </div>
  );
};

export default ViewHostList;
