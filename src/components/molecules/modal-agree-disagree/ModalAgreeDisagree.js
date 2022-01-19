import React from 'react'
import Modal from '../../organisms/modal/Modal'
import Button from '../../utils/Button'
import { Wrapper } from './ModalAgreeDisagree.styles'

export default function ModalAgreeDisagree({onClose, onAgree, title, agreeText, errorText}) {
    return (
        <Modal onClose={onClose}>
            <Wrapper>
                <div className="heading">{title}</div>
                <p className='error'>{errorText}</p>
                <div className="buttons">
                    <Button onClick={onClose}>Anuluj</Button>
                    <Button variant='ghost' onClick={onAgree}>{agreeText}</Button>
                </div>
            </Wrapper>
        </Modal>
    )
}
