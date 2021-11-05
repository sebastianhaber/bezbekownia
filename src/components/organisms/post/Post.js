import { Icon } from '@iconify/react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { API_IP } from '../../../App';
import Modal from '../modal/Modal';
import CommentsModal from './commentsModal/CommentsModal';
import { Wrapper } from './Post.styles'

export default function Post({ data }) {
    const [modalOpen, setModalOpen] = useState(false);
    const hashtags = data.hashtags;
    const hashtagsArray = hashtags.split(',');

    const handleOpenCommentsModal = () => {
        document.querySelector('html').classList.add('no-scroll');
        setModalOpen(true)
         setTimeout(() => {
            document.getElementById('wrapper').classList.remove('hide');
        }, 100);
    }
    const handleCloseModal = () => {
        document.getElementById('wrapper').classList.add('hide');
        document.querySelector('html').classList.remove('no-scroll');

        setTimeout(() => {
            setModalOpen(false)
        }, 500);
    }

    return (
        <Wrapper>
            {modalOpen && (
                <Modal isCommentsModal onClose={()=>handleCloseModal()}>
                    <CommentsModal data={data} />
                </Modal>
            )}
            <Link to='/meme'><img src={`http://${API_IP}:1337` + data.image.url} alt={data.title} /></Link>
            <div className="header">
                <div className="meta">
                    <div className="title">{data.title}</div>
                    <div className="author"><Link to={`/` + data.user.username}>by <b>{ data.user.username }</b></Link></div>
                </div>
                <ul className="hashtags">
                    {hashtagsArray.map((hashtag, index) => (
                        <li key={index}><Link to={`/hashtag/${hashtag.trim()}`}>#{ hashtag.trim() }</Link></li>
                    ))}
                </ul>
            </div>
            <div className="footer">
                <div className="button comments" onClick={()=>handleOpenCommentsModal()}>
                    <Icon icon="akar-icons:comment" />
                </div>
                <div className="likes">
                    +{data.likes.length} byczku
                </div>
                <div className="button more">
                    <Icon icon="akar-icons:more-vertical" />
                </div>
            </div>
        </Wrapper>
    )
}
