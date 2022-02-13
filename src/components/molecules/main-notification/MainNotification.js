import { Icon } from '@iconify/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

export default function MainNotification({ data, onClose }) {
    const [isHiding, setHiding] = useState(false);
    const [wasShown, setShown] = useState(false);

    const handleClose = () => {
        setHiding(true);
        setTimeout(() => {
            localStorage.setItem('notification-timestamp', Date.parse(data.updated_at))
            onClose();
        }, 200);
    }
    useEffect(() => {
        if (Object.keys(data).length !== 0) {
            if (localStorage.getItem('notification-timestamp') && (localStorage.getItem('notification-timestamp') === Date.parse(data.updated_at).toString())) {
                setShown(true);
            }
        }
    }, [data])

    if(Object.keys(data).length === 0) return null;
    if (data.message.length === 0) return null;
    if (wasShown) return null;

    return (
        <NotificationWrapper id='top-notification' isHiding={isHiding}>
            <div>
                <p>{ data.message }</p>
                <span onClick={()=>handleClose()}>
                    <Icon icon="akar-icons:cross" />
                </span>
            </div>
        </NotificationWrapper>
    )
}
const NotificationWrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 3;
    background-color: ${({ theme }) => theme.colors.accent.light};
    padding: 0.5rem 1rem;
    transition: transform .2s ease;
    ${({ isHiding }) => isHiding && `
        pointer-events: none;
        transform: translateY(100%);
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