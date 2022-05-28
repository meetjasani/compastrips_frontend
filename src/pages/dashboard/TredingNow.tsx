import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom'
import { ApiGet } from '../../helper/API/ApiData'


interface hostList {
    hosting_id: string
}

const TredingNow = () => {

    const { t } = useTranslation();

    const [data, setData] = useState<hostList[]>([])
    useEffect(() => {
        ApiGet("itinerary/getTrendingItinerary")
            .then((res: any) =>
                setData(res.data)
            )
    }, [])



    return (
        <div className='trending-now-section'>
            <div className='heading'>
                <h4> {t('Homepage.Popular_Destination')}</h4>
            </div>
            {data ? data.slice(0, 10).map((items: any, i: number) =>
                <div className='single-trending-row d-flex align-items-center'>
                    <div className='trending-number'>
                        <h4>{i + 1}</h4>
                    </div>
                    <Link to={`/itinerary?id=${items.id}`}>
                        <div className='trending-pro-content'>
                            <h5>{items.title}</h5>
                            <h6>{items.region}, {items.country}</h6>
                        </div>
                    </Link>

                </div>
            ) : ""}
        </div>
    )
}

export default TredingNow