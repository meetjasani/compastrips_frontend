import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import HostPro from '../../components/HostPro';
import { ApiGet } from '../../helper/API/ApiData';
import { checkImageURL } from '../../helper/utils';

interface hostList {
    hosting_id: string
    avatar: string,
    country: string,
    name: string,
    nationality: string,
    region: string,
    itinerary_id: string
}
export interface hosting {
    date: string;
    end: string;
    participate_count: number;
    pax: number;
    start: string;
    type: string;
}

function PopulatHost() {

    const { t } = useTranslation();
    const history = useHistory();
    const [show, setShow] = useState(false);
    const [hostingId, setHostingId] = useState<string>("");

    const [data, setData] = useState<hostList[]>([])

    useEffect(() => {
        ApiGet("hosting/getPopularHost")
            .then((data: any) =>
                setData(data.data.host)
            )
    }, [])

    return (
        <>
            <div className='popular-host-section'>
                <div className='heading'>
                    <h4>{t('Homepage.Popular_Hosts')}</h4>
                </div>
                {data ? data.map((items: hostList, i: number) => (
                    <div className='popular-host-row d-flex align-items-center'
                        onClick={() => {
                            // history.push(`/itinerary?id=${items.itinerary_id}`)
                            setHostingId(items.hosting_id);
                            setShow(true);
                        }}
                    >
                        <div className='popular-host-img'>
                            <img src={items.avatar || "./img/Avatar.png"} alt="" />
                        </div>
                        <div className='popular-pro-content'>
                            <h5>{items.name}</h5>
                            <h6>{items.region}, {items.country}</h6>
                        </div>
                        <div className='popular-host-flag'>
                            <img src={checkImageURL(items.nationality)} alt="" style={{ width: '24px', height: '24px', borderRadius: '50%' }} />
                        </div>
                    </div>

                )) : ""}
            </div>
            {
                show && <HostPro
                    hostingId={hostingId}
                    show={show}
                    setShow={setShow}
                    data={data}

                >
                </HostPro>
            }
        </>
    )
}

export default PopulatHost