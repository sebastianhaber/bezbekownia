import { Icon } from '@iconify/react';
import React from 'react';
import { FacebookMessengerShareButton, FacebookShareButton, TwitterShareButton } from 'react-share';
import styled from 'styled-components';
import { APP_URL } from '../../../App';
import Modal from '../modal/Modal';

export default function ShareModal({onClose, data, hashtags}) {
    return (
        <Modal onClose={onClose}>
            <div className='top'>
                <h1 className="heading">Udostępnij</h1>
                <p>Wybierz socialmedia</p>
            </div>
            <Share>
                <li>
                    <FacebookShareButton
                        url={`${APP_URL}/meme/${data.slug}`}
                        quote={data.title}
                        hashtag={hashtags.string}>
                        <Icon icon="akar-icons:facebook-fill" /> Facebook
                    </FacebookShareButton>
                </li>
                <li>
                    <FacebookMessengerShareButton url={`${APP_URL}/meme/${data.slug}`}>
                        <Icon icon="bi:messenger" /> Messenger
                    </FacebookMessengerShareButton>
                </li>
                <li>
                    <TwitterShareButton
                        url={`${APP_URL}/meme/${data.slug}`}
                        title={data.title}
                        hashtags={hashtags.array}>
                        <Icon icon="akar-icons:twitter-fill" /> Twitter
                    </TwitterShareButton>
                </li>
            </Share>
        </Modal>
  )
}
const Share = styled.ul`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: flex-start;
    height: 300px;
    li{
        width: 100%;
        padding: .5rem;
        border: 1px solid transparent;
        border-radius: 1rem;
        &:hover{
            border-color: ${({theme}) => theme.colors.gray};
        }
    }
    button{
        display: flex;
        justify-content: center;
        align-items: center;
        gap: 1rem;
        svg{
            width: 100%;
            height: 100%;
        }
    }
`;
