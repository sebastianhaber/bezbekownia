import { Icon } from '@iconify/react';
import React, { useEffect } from 'react';
import reactDom from 'react-dom';
import { StyledNotification } from './FloatingNotification.styles';

const notificationContainer = document.getElementById('notification-container');

export default function FloatingNotification({children, onClose, notification}) {
  const notificationElement = document.createElement('div');
    useEffect(() => {
        notificationElement.id = 'notification';
        notificationContainer.appendChild(notificationElement);

        return () => {
            notificationContainer.removeChild(notificationElement);
        }
    }, [notificationElement]);

    return reactDom.createPortal(
        <StyledNotification type={notification.type}>
            <div className="exit" onClick={onClose}>
                <Icon icon="akar-icons:cross" />
            </div>
            {notification.message}
        </StyledNotification>,
        notificationElement
    )
}
