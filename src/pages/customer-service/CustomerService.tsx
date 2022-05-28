import React, { useEffect, useState } from 'react'
import { Card, Tabs } from 'react-bootstrap'
import Accordion from 'react-bootstrap/Accordion'
import { Tab } from 'react-bootstrap'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight, faCaretLeft } from "@fortawesome/free-solid-svg-icons";
import Pagination from "react-js-pagination"
import { useTranslation } from 'react-i18next';
import { ApiGet } from '../../helper/API/ApiData';
import CustorServiceDetails from './CustorServiceDetails';
import ReactHtmlParser from 'react-html-parser';
import moment from 'moment';

interface notices {
    content: string,
    created_at: string,
    id: number,
    title: string,
    updated_at: string,
    view_count: number
}

interface noticeList {
    count: number;
    notices: notices[];
}
interface faq {
    answer: string;
    created_at: string;
    id: number;
    question: string;
    updated_at: string;
    view_count: number;
}
interface faqList {
    count: number;
    faq: faq[];
}


function CustomerService() {

    const { t } = useTranslation();

    const [value, setvalue] = useState("")
    const [pageNo, setPageNo] = useState<number>(1)
    const [faqPageNo, setFaqPageNo] = useState<number>(1)
    const [openNotice, setOpenNotice] = useState(false)
    const [noticeId, setNoticeId] = useState<number>()
    const [noticeData, setNoticeData] = useState<noticeList>({
        count: 0,
        notices: [{
            content: "",
            created_at: "",
            id: 0,
            title: "",
            updated_at: "",
            view_count: 0
        }]
    });

    const [show, setShow] = useState<any>([])
    const [faqData, setFaqData] = useState<faqList>({
        count: 0,
        faq: [{
            answer: "",
            created_at: "",
            id: 0,
            question: "",
            updated_at: "",
            view_count: 0
        }]
    })
    const [faqKeyword, setFaqKeyword] = useState<string>("")


    //For FAQ
    const getFaqData = () => {
        ApiGet(
            `general/faq?keyword=${faqKeyword}&per_page=${9}&page_number=${faqPageNo}`
        ).then((res: any) => {
            setFaqData(res.data);
        });
    };

    //For Notice
    const getNoticeData = () => {
        ApiGet(`general/notice?keyword=${value}&per_page=${10}&page_number=${pageNo}`)
            .then((res: any) => {
                setNoticeData(res.data)
            })
    }

    useEffect(() => {
        getNoticeData();
    }, [pageNo, openNotice]);

    useEffect(() => {
        getFaqData();
    }, [faqPageNo])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [openNotice]);


    const handlechange = (id: any) => {
        setShow(id)

    }

    return (
        <div className="cnotice-page">
            <div className="mini-container">
                <div className="CustomerService-title">
                    <h1 className="ServiceTitle">{t("Customer_Service.Customer_Service")}</h1>
                    <Tabs className="grid" defaultActiveKey="notice" transition={false}>
                        <Tab eventKey="notice" title={t("Customer_Service.Notice")}>
                            {!openNotice ?
                                <>
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
                                        <button onClick={() => getNoticeData()}><img src="./img/CustomerSearch.svg" alt="" />{t("Customer_Service.Search")}</button>
                                    </div>
                                    <div className="total-items">
                                        <h5>{t("Customer_Service.Total")}{noticeData.count}{t("Customer_Service.Items")}</h5>
                                    </div>
                                    <table>
                                        <tr className="th">
                                            <th className="th-no text-center">No</th>
                                            <th className="th-title text-center">{t("Customer_Service.Title")}</th>
                                            <th className="th-data text-center">{t("Customer_Service.Date")}</th>
                                            <th className="th-views text-center">{t("Customer_Service.Views")}</th>
                                        </tr>
                                        {noticeData.notices && noticeData.notices.map((items: notices, i: number) => {
                                            const title = items.title.replace(value, `<b>${value}</b>`)
                                            return (<tr className="td">
                                                <td className="td-no text-center">{(noticeData.count - ((pageNo - 1) * 10)) - i}</td>
                                                <td className="td-title" onClick={() => { setNoticeId(noticeData.notices[i].id); setOpenNotice(true) }}>{ReactHtmlParser(title)}</td>
                                                <td className="td-date text-center">{moment(items.created_at).format("YYYY.MM.DD HH:mm")}</td>
                                                <td className="td-viwes text-center">{items.view_count}</td>
                                            </tr>)
                                        })}
                                    </table>

                                    <div className="pagination-notice">
                                        <Pagination
                                            itemClass="page-item-custom"
                                            activeLinkClass="activepage"
                                            linkClass="page-link-custom"
                                            linkClassFirst="page-first-arrow"
                                            linkClassPrev="page-first-arrow"
                                            linkClassNext="page-first-arrow"
                                            linkClassLast="page-first-arrow"
                                            prevPageText={<img src='./img/singlePolygon.svg' />}
                                            firstPageText={<><img src="./img/doublePolygon.svg" /></>}
                                            lastPageText={<><img src='./img/DublePolygonRight.svg' /></>}
                                            nextPageText={<img src='./img/SinglePolygonRight.svg' />}
                                            activePage={pageNo}
                                            itemsCountPerPage={10}
                                            pageRangeDisplayed={10}
                                            totalItemsCount={noticeData.count}
                                            onChange={(e) => {
                                                setPageNo(e);
                                            }}
                                        />
                                    </div>
                                </>
                                :
                                <CustorServiceDetails setOpenNotice={setOpenNotice} noticeId={noticeId} getNoticeData={getNoticeData} noticeData={noticeData} />
                            }
                        </Tab>


                        <Tab eventKey="faq" title={t("Customer_Service.FAQ")}>
                            <div className="input d-flex">
                                <input
                                    name=""
                                    type="text"
                                    value={faqKeyword}
                                    placeholder={t("Customer_Service.Keyword")}
                                    // fromrowStyleclass=""
                                    // InputstyleClass="input-css"
                                    // lablestyleClass=""
                                    onChange={(e: any) => { setFaqKeyword(e.target.value) }}
                                />
                                <button onClick={() => { getFaqData() }} ><img src="./img/CustomerSearch.svg" alt="" />{t("Customer_Service.Search")}</button>
                            </div>
                            <div className="total-items">
                                <h5>{t("Customer_Service.Total")}{faqData?.count}{t("Customer_Service.Items")}</h5>
                            </div>
                            <div className="faq-table">
                                {faqData?.faq?.map((items: faq, i: number) => {
                                    const faqTitle = items.question.replace(faqKeyword, `<b>${faqKeyword}</b>`)
                                    return (

                                        <Accordion>
                                            <Card className="accordion-card">
                                                <Accordion.Toggle as={Card.Header} eventKey={items.id.toString()}>
                                                    <div className="card-img d-flex align-items-center">
                                                        <div className="Q-round">
                                                            <span>
                                                                Q
                                                            </span>
                                                        </div>
                                                        <div className='w-100' onClick={() => { handlechange(items.id) }}>
                                                            <p>{ReactHtmlParser(items.question)}</p>
                                                        </div>
                                                    </div>
                                                </Accordion.Toggle>
                                                {show === items.id &&
                                                    <Accordion.Collapse eventKey={items.id.toString()}>
                                                        <Card.Body className="faq-body">{items.answer}</Card.Body>
                                                    </Accordion.Collapse>
                                                }
                                            </Card>
                                        </Accordion>
                                    )
                                }
                                )}
                            </div>

                            <div className="pagination-notice">
                                <Pagination
                                    itemClass="page-item-custom"
                                    activeLinkClass="activepage"
                                    linkClass="page-link-custom"
                                    linkClassFirst="page-first-arrow"
                                    linkClassPrev="page-first-arrow"
                                    linkClassNext="page-first-arrow"
                                    linkClassLast="page-first-arrow"
                                    prevPageText={<img src='./img/singlePolygon.svg' />}
                                    firstPageText={<><img src="./img/doublePolygon.svg" /></>}
                                    lastPageText={<><img src='./img/DublePolygonRight.svg' /></>}
                                    nextPageText={<img src='./img/SinglePolygonRight.svg' />}
                                    activePage={faqPageNo}
                                    itemsCountPerPage={9}
                                    pageRangeDisplayed={10}
                                    totalItemsCount={faqData.count}
                                    onChange={(e) => {
                                        setFaqPageNo(e);
                                    }}
                                />
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default CustomerService
