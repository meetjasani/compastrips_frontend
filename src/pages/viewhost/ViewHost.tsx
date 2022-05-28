import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom';
import { ApiGet } from '../../helper/API/ApiData';
import ViewHostList from './ViewHostList';


const ViewHost = () => {

    const { t } = useTranslation();

    const [hostType, setHostType] = useState<string[]>([]);
    const [gender, setGender] = useState<string[]>([]);
    const [ageGroup, setAgeGroup] = useState<string[]>([]);

    const handleCheckbox = (e: any) => {
        switch (e.target.name) {
            case "hosttype":
                if (e.target.checked) {
                    setHostType([...hostType, e.target.value]);
                } else {
                    setHostType((prev) =>
                        prev.filter((currItem) => currItem !== e.target.value)
                    );
                }
                break;
            case "gender":
                if (e.target.checked) {
                    setGender([...gender, e.target.value]);
                } else {
                    setGender((prev) =>
                        prev.filter((currItem) => currItem !== e.target.value)
                    );
                }
                break;
            case "agegrup":
                if (e.target.checked) {
                    setAgeGroup([...ageGroup, e.target.value]);
                } else {
                    setAgeGroup((prev) =>
                        prev.filter((currItem) => currItem !== e.target.value)
                    );
                }
                break;
        }
    };

    const pathname = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return (
        <div className='view-host-section'>
            <div className='ninetwenty-container'>
                <div className='mini-container'>
                    <div className='view-host-inner'>
                        <h3 className='title-view-host'>{t('ViewHost.Header')}</h3>
                        <div className='view-host-section-list'>
                            <div className='filter-tab-view-host'>
                                <div className='single-tab-host'>
                                    <h5>{t('ViewHost.Host_Type')}</h5>
                                    {/* <button className='active-button' name="hosttype" onChange={(e: any) => handleCheckbox(e)}>{t('ViewHost.Local_Host')}</button> */}
                                    {/* <input
                                        className="radiobutton"
                                        type="checkbox"
                                        id="hosttype"
                                        value="Local"
                                        name="hosttype"
                                        onChange={(e: any) => handleCheckbox(e)}
                                    /> */}

                                    <div className="btn-1 mt-20">
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="hosttype"
                                            value="Local"
                                            name="hosttype"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="hosttype" className="radio-label">
                                            {t('ViewHost.Local_Host')}
                                        </label>
                                    </div>


                                    {/* <button className='button' name="hosttype" onChange={(e: any) => handleCheckbox(e)}>{t('ViewHost.Traveler_Host')}</button> */}


                                    <div className='btn-1 mt-20'>
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="travelerHost"
                                            value="Travel"
                                            name="hosttype"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="travelerHost" className="radio-label">
                                            {t('ViewHost.Traveler_Host')}
                                        </label>
                                    </div>

                                    {/* <input
                                        className="radiobutton"
                                        type="checkbox"
                                        id="travelerHost"
                                        value="Travel"
                                        name="hosttype"
                                        onChange={(e: any) => handleCheckbox(e)}
                                    /> */}
                                </div>

                                <div className='single-tab-host-gender'>
                                    <h5>{t('ViewHost.Gender')}</h5>
                                    <div className="btn-3 mt-20">
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="hosttype"
                                            value="MALE"
                                            name="gender"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="hosttype" className="radio-label">
                                            {t('ViewHost.Male')}
                                        </label>
                                    </div>

                                    <div className="btn-4 mt-20">
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="travelerHost"
                                            value="FEMALE"
                                            name="gender"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="travelerHost" className="radio-label">
                                            {t('ViewHost.Female')}
                                        </label>
                                    </div>
                                </div>

                                <div className='single-tab-host-age'>
                                    <h5>{t('ViewHost.Age_Group')}</h5>
                                    <div className="btn-5 mt-20">
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="hosttype"
                                            value="20"
                                            name="agegrup"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="hosttype" className="radio-label">
                                            {t('ViewHost.20s')}
                                        </label>
                                    </div>

                                    <div className="btn-6 mt-14">
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="travelerHost"
                                            value="30"
                                            name="agegrup"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="travelerHost" className="radio-label">
                                            {t('ViewHost.30s')}
                                        </label>
                                    </div>

                                    <div className="btn-7 mt-14">
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="hosttype"
                                            value="40"
                                            name="agegrup"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="hosttype" className="radio-label">
                                            {t('ViewHost.40s')}
                                        </label>
                                    </div>

                                    <div className="btn-8 mt-14">
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="travelerHost"
                                            value="50"
                                            name="agegrup"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="travelerHost" className="radio-label">
                                            {t('ViewHost.50s')}
                                        </label>
                                    </div>

                                    <div className="btn-9 mt-14">
                                        <input
                                            className="radiobutton"
                                            type="checkbox"
                                            id="hosttype"
                                            value="60"
                                            name="agegrup"
                                            onChange={(e: any) => handleCheckbox(e)}
                                        />
                                        <label htmlFor="hosttype" className="radio-label mb-5">
                                            {t('ViewHost.60s')}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* <div className='host-list-main-sidebar'>
                                <div className='list-main-sidebar-inner'>
                                    {hostList.map((items) =>
                                        <div className='single-local-host'>
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
                                                            <div className='host-ages'><p>{items.age}</p></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div> */}
                            <ViewHostList
                                hostType={hostType}
                                gender={gender}
                                ageGroup={ageGroup}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewHost