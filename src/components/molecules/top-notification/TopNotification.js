import { Icon } from '@iconify/react';
import { useState } from 'react';
import styled from 'styled-components';

export default function TopNotification({ message, onClose }) {
    const [isHiding, setHiding] = useState(false);

    const handleClose = () => {
        setHiding(true);
        setTimeout(() => {
            onClose();
        }, 200);
    }
    if (message.length === 0) return null;

    return (
        <NotificationWrapper id='top-notification' isHiding={isHiding}>
            <div>
                <p>{ message }</p>
                <span onClick={()=>handleClose()}>
                    <Icon icon="akar-icons:cross" />
                </span>
            </div>
        </NotificationWrapper>
    )
}
const NotificationWrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    transform: translateY(60px);
    width: 100%;
    z-index: 3;
    background-color: ${({ theme }) => theme.colors.accent.light};
    padding: 1rem;
    transition: opacity .2s ease;
    ${({ isHiding }) => isHiding && `
        opacity: 0;
        pointer-events: none;
    `}
    div{
        display: flex;
        justify-content: space-between;
        text-align: center;
        gap: 0.5rem;
        margin: 0 auto;
        max-width: 1440px;
        font-size: 14px;
    }
    span{
        display: grid;
        place-items: center;
        padding: 0 .5rem;
        svg{
            font-size: 1rem;
            cursor: pointer;
        }
    }
`;