import moment from 'moment';
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next';

interface Props {
    index?: number;
    items: any;
    showAcc: any;
    setShowAcc: any;
}

const According: React.FC<Props> = ({ items, index, showAcc, setShowAcc }) => {

    const { t } = useTranslation();
    const checkIsComplete = (date: string, endTime: string) => {
        let time = moment(
            moment(date).format("YYYY:MM:DD") + " " + endTime,
            "YYYY:MM:DD HH:mm"
        );
        return time.toDate() < moment(new Date(), "YYYY:MM:DD HH:mm").toDate();
    };

    useEffect(() => {
    }, [showAcc])

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
        }

        return date;
    }
    return (
        <div>
            <div className='single-accordian-itinery' onClick={() => {
                if (showAcc === items.id) {
                    setShowAcc(0)
                } else {
                    setShowAcc(items.id)
                }
            }}>
                <div className='name-with-des'>
                    <h5>{index}</h5>
                    <h4>{items.name}</h4>
                </div>
                <div className='droddown-according'>
                    <button ><img src="./img/acc-image.svg" alt="" className={showAcc === items.id ? "rotate" : "secRotate"} /></button>
                </div>
            </div>
            {showAcc === items.id &&
                <div className='show-acc'>
                    <div className='d-flex align-items-center showCity'>
                        <p>{t("Tour_Course_Details.City")}</p>
                        <span>{items.region ? items.region : "-"}</span>
                    </div>

                    <div>
                        <div className='d-flex align-items-center'>
                            <p>{t("Tour_Course_Details.Category")}</p>
                            <span> {items.category ? items.category : "-"}</span>
                        </div>
                        <div className='showAccImg d-flex'>
                            <p>{t("Tour_Course_Details.Photos")}</p>
                            <div className='showACCImageBox'></div>
                            {items.image.map((data: any) => <img src={data} alt="" style={{ width: '110px', height: '78px', borderRadius: '8px', marginRight: '10px' }} />)}
                        </div>
                    </div>

                    <div className='d-flex align-items-center showDate'>
                        <p>{t("Tour_Course_Details.Date")} </p>
                        {/* <span>{items.opening_date}</span> */}
                        {/* <span>{items.opening_date}</span> */}
                        <span>{setDate(items?.opening_date, items?.closing_date)}</span>
                    </div>

                    <div className='d-flex align-items-center showAbout'>
                        <p>{t("Tour_Course_Details.About")} </p>
                        <span>{items.summary ? items.summary : "-"}</span>
                    </div>

                    <div className='d-flex align-items-center showAddress'>
                        <p>{t("Tour_Course_Details.Address")} </p>
                        <span>{items.address ? items.address : "-"}</span>
                    </div>

                    <div className='d-flex align-items-center showUrl'>
                        <p>{t("Tour_Course_Details.URL")}  </p>
                        <span>{items.website ? items.website : "-"}</span>
                    </div>

                    <div className='d-flex align-items-center ShowPhone'>
                        <p>{t("Tour_Course_Details.Phone_Number")} </p>
                        <span>
                            {items.mobile ? items.mobile : "-"}
                        </span>
                    </div>

                    <div className='d-flex align-items-center'>
                        <p>{t("Tour_Course_Details.Nearest_Public_Trasportation")}</p>
                        <span>{items.n_p_transportation ? items.n_p_transportation : "-"}</span>
                    </div>
                </div>
            }
        </div>

    )
}

export default According