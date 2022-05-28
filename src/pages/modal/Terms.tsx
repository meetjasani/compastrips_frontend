import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

interface Props {
    onHideTerms?: () => void,
    showTerms?: boolean,
}

const Terms: React.FC<Props> = ({
    onHideTerms,
    showTerms
}) => {

    const { t } = useTranslation();
    return (
        <div>
            <Modal
                show={showTerms}
                centered
                dialogClassName="terms-modal"
            >
                <Modal.Body className='p-0'>
                    <div className='terms-modal-inner'>
                        <div className='custom-modal-header'>
                            <h5>{t("Terms_Of_Use.Title")}</h5>
                        </div>

                        <div className='tearms-inner-content'>
                            <h4 className='text-center'>{t("Terms_Of_Use.Artical_1")}</h4>
                            <p>{t("Terms_Of_Use.Body_Title")}<br />
                                {t("Terms_Of_Use.Body")}</p>
                        </div>

                        <div className='tearms-Button'>
                            <button onClick={onHideTerms}>{t("Terms_Of_Use.Close")}</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Terms