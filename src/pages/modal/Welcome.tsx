import React, { useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

interface Props {
    onHideWelocome?: () => void,
    showWelcome?: boolean,
    onShow: any,
    hideWelcom: any

}

const Welcome: React.FC<Props> = ({
    onHideWelocome,
    showWelcome,
    onShow,
    hideWelcom
}) => {

    const { t } = useTranslation();


    const goLoging = () => {
        onShow()
        hideWelcom()
    }


    return (
        <div>
            <Modal
                show={showWelcome}
                centered
                dialogClassName="welcome-modal"
            >
                <Modal.Body className='p-0'>
                    <div className='welcome-modal-inner'>
                        <div className='custom-modal-header'>
                            <h5>{t("Welcome.Welcome")}</h5>
                        </div>

                        <div className='text-welcome-password'>
                            <h4> {t("Welcome.Hi")}</h4>
                            <p>{t("Welcome.Success")}</p>
                        </div>

                        <div className='welcome-btn-modal w-100 text-center'>
                            <button onClick={goLoging}>{t("logIn.Log_In")}</button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Welcome