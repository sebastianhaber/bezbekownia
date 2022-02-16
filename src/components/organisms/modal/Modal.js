import { Icon } from '@iconify/react';
import React, { useEffect } from 'react'
import reactDom from 'react-dom'
import { ModalWrapper, Wrapper } from './Modal.styles';
import SimpleBar from 'simplebar-react'

const modalContainer = document.getElementById('modal-container');

export default function Modal({children, onClose, isCommentsModal = false}) {
    const modalElement = document.createElement('div');
    useEffect(() => {
        modalElement.id = 'modal';
        modalContainer.appendChild(modalElement);
        document.querySelector('html').classList.add('no-scroll');

        return () => {
            document.querySelector('html').classList.remove('no-scroll');
            modalContainer.removeChild(modalElement);
        }
    }, [modalElement]);

    return reactDom.createPortal(
        <Wrapper id='wrapper' isCommentsModal={isCommentsModal}>
            <div className="overlay" onClick={onClose}></div>
            <div className="exit" onClick={onClose}>
                <Icon icon="akar-icons:cross" />
            </div>
            <ModalWrapper isCommentsModal={isCommentsModal}>
                <SimpleBar forceVisible='y' id='simplebar'>
                    {children}
                </SimpleBar>
            </ModalWrapper>
        </Wrapper>,
        modalElement
    )
}
