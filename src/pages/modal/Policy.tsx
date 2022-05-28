import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import AuthStorage from '../../helper/AuthStorage';

interface Props {
    onHidePolicy?: () => void,
    showPolicy?: boolean,
}

const Policy: React.FC<Props> = ({
    onHidePolicy,
    showPolicy
}) => {
    const { t } = useTranslation();
    return (
        <div>
            <Modal
                show={showPolicy}
                centered
                dialogClassName="terms-modal"
            >
                <Modal.Body className='p-0'>
                    <div className='terms-modal-inner'>
                        <div className='custom-modal-header'>
                            <h5>{t("privacypolicy.Title")}</h5>
                        </div>

                        <div className='tearms-inner-content'>
                            <p className='mt-0'>{t("privacypolicy.Header")}
                                <br />
                                <br />
                                {t("privacypolicy.PolicyOne")}
                                <br />
                                {t("privacypolicy.PolicyTwo")}
                                {AuthStorage.getLang() === "ko"
                                    ?
                                    <>
                                        <br />
                                        {t("privacypolicy.PolicyThree")}
                                        <br />
                                        {t("privacypolicy.PolicyFour")}
                                    </>
                                    : ""}
                            </p>
                        </div>

                        <div className='tearms-Button'>
                            <button onClick={onHidePolicy}>{t("Privacy_Policy.Close")}</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Policy