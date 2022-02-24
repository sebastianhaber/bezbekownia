import { Icon } from '@iconify/react'
import React from 'react'
import { toast } from 'react-toastify'
import Modal from '../../organisms/modal/Modal'
import Button from '../../utils/Button'
import { Wrapper } from './ModalAgreeDisagree.styles'

export default function ModalAgreeDisagree({onClose, onAgree, title, subText, agreeText, errorText}) {
    return (
        <Modal onClose={onClose}>
            {errorText && toast.error(errorText)}
            <Wrapper>
                <div className="icon"><Icon icon='akar-icons:triangle-alert' /></div>
                <div className="heading">{title}</div>
                <p className="sub gray">{ subText }</p>
                <div className="buttons">
                    <Button variant='red' onClick={onAgree}>{agreeText}</Button>
                    <Button variant='ghost' onClick={onClose}>Anuluj</Button>
                </div>
            </Wrapper>
        </Modal>
    )
}
