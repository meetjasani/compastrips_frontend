import React from 'react'
import { useTranslation } from 'react-i18next'
import AuthStorage from '../../helper/AuthStorage';

function HostInfo() {

    const { t } = useTranslation();
    const hostList = [
        {
            name: "parth",
            surname: "makvana",
            age: 30,
            gender: "male",
            host: "Traveler host"
        }
    ]

    const paxhostList = [
        {
            name: "parth",
            surname: "makvana",
            age: 30,
            gender: "male",
            host: "local host"
        },
        {
            name: "parth",
            surname: "makvana",
            age: 30,
            gender: "female",
            host: "local host"
        },
    ]

    return (
        <div className='host-info-main'>
            {hostList.map((items) =>
                <div className='host-info-inner'>
                    <div className='single-local-host-inner'>
                        <div className='single-local-host-profile'>
                            <img src="./img/user-suah.svg" alt="" />
                            <div className='pro-tag-name'>
                                <div className='pro-name-suah'>
                                    <h3>{items.name} {items.surname}</h3>
                                    <img src="./img/flag.svg" alt="" />
                                </div>
                                <div className='pro-tag-suah'>
                                    {items.host === "local host"
                                        ?
                                        <div className='host-catrgory'><p>{items.host}</p></div>
                                        :
                                        <div className='travel-host-catrgory'><p>{items.host}</p></div>
                                    }
                                    {items.gender === "female"
                                        ?
                                        <div className='host-gender'><p>{items.gender}</p></div>
                                        :
                                        <div className='host-gender-male'><p>{items.gender}</p></div>
                                    }
                                    <div className='host-ages'>{AuthStorage.getLang() === "en" ? <p>{items.age}'{t("Age_Groups")}</p> : <p className="d-flex align-items-center">{items.age}<span>{t("Age_Groups")}</span></p>}</div>
                                </div>
                            </div>
                        </div>
                        <div className='hostinfo-join-btn'>
                            {/* ===  DONT DELETE === */}

                            {/* <label>Application Sent</label>
                            <label>Application Declined</label>
                            <label>Applicationn Accepted</label>
                            <label>Hosting Completed</label>
                            <button>Write a Review</button> */}

                            <button>Join</button>
                        </div>
                    </div>
                </div>
            )
            }

            <div className='about-itinery-info'>
                <div className='about-itinery-info-inner'>
                    <div className='single-row-about'>
                        <h3>Date {"&"} Time</h3>
                        <h4>2021.08.01 09:00 - 18:00</h4>
                    </div>
                    <div className='single-row-about'>
                        <h3>Starts at</h3>
                        <h4>Incheon Int’l Airport</h4>
                    </div>

                    <div className='single-row-about'>
                        <h3>Transportation</h3>
                        <h4>Airplane</h4>
                    </div>
                </div>
            </div>

            <div className='about-itinery-pargraph'>
                <p>Suah Hong is dedicated to giving you a rich experience in a comfortable environment. Join our tour if you are looking for a relaxing </p>
            </div>

            <div className='pax-list-host'>
                <div className='pax-list-inner'>
                    <div className='total-pax-joining'><p><span>10명</span>/10 pax</p></div>
                    {paxhostList.map((items) =>
                        <div className='single-pax-list'>
                            <div className='d-flex align-items-center'>
                                <img src="./img/user-suah.svg" alt="" className='pax-user-iamge' />
                                <h5>{items.name} {items.surname}</h5>
                            </div>
                            <div className='d-flex align-items-center'>
                                <img src="./img/flag.svg" alt="" className='pax-flag-imag' />
                                {items.gender === "female"
                                    ?
                                    <div className='host-gender'><p>{items.gender}</p></div>
                                    :
                                    <div className='host-gender-male'><p>{items.gender}</p></div>
                                }
                                <div className='host-ages'>{AuthStorage.getLang() === "en" ? <p>{items.age}'{t("Age_Groups")}</p> : <p className="d-flex align-items-center">{items.age}<span>{t("Age_Groups")}</span></p>}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div >
    )
}

export default HostInfo