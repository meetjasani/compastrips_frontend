import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ApiGet } from '../../helper/API/ApiData'


interface noticeData {
    content: string,
    created_at: string,
    id: number,
    title: string
}


const CustorServiceDetails: React.FC<any> = (props: any) => {

    const [data, setData] = useState<noticeData>();
    const [value, setvalue] = useState("")

    const { t } = useTranslation();

    //Get Notice by Id
    useEffect(() => {
        ApiGet(`general/notice/${props.noticeId}`)
            .then((res: any) => {
                setData(res.data);
            })
    }, [props.noticeId])


    return (
        <div>
            <div className="cnotice-single-page cnotice-page">
                <div className="mini-container">
                    <div className="CustomerService-title2">
                        <div className="input d-flex align-items-center">
                            <input
                                name=""
                                type="text"
                                value={value}
                                placeholder={t("Customer_Service.Keyword")}
                                // fromrowStyleclass=""
                                // InputstyleClass="input-css"
                                // lablestyleClass=""
                                onChange={(e: any) => { setvalue(e.target.value) }}
                            />
                            <button onClick={() => props.getNoticeData()}><img src="./img/CustomerSearch.svg" alt="" />{t("Customer_Service.Search")}</button>
                        </div>
                        <div className="total-items">
                            <h5>{t("Customer_Service.Total")}{props.noticeData.count}{t("Customer_Service.Items")}</h5>
                        </div>
                        <div className="detail-title">
                            <h2>{data?.title}</h2>
                            <p>{moment(data?.created_at).format("YYYY-MM-DD")}</p>
                        </div>
                        <div className="detail-text">
                            <p>{data?.content}</p>
                        </div>
                        <div className="black-border"></div>
                        <div className="detail-button">
                            <button onClick={() => { props.setOpenNotice(false) }} >Back</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CustorServiceDetails