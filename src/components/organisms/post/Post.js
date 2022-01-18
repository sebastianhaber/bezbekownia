import { Icon } from '@iconify/react';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react/cjs/react.development';
import { API_IP } from '../../../App';
import AppContext from '../../../context/AppContext';
import Modal from '../modal/Modal';
import CommentsModal from './commentsModal/CommentsModal';
import { Wrapper } from './Post.styles'

export default function Post({ data }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const { user } = useContext(AppContext);
    let hashtags = data.hashtags;

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

    useEffect(() => {
        if (user) {
            data.likes.map(like => {
                if (like.user === user.id) {
                    setLiked(true);
                    return true;
                }
                return false;
            })
            console.log('data', data);
        }
    }, [user, data])

    return (
        <Wrapper>
            {modalOpen && (
                <Modal isCommentsModal onClose={()=>handleCloseModal()}>
                    <CommentsModal data={data} setLiked={setLiked} liked={liked} closeModal={()=>handleCloseModal()} />
                </Modal>
            )}
            <Link to={`/meme/${data.slug}`}><img src={`${API_IP}${data.image.url}`} loading='lazy' alt={data.title} /></Link>
            <div className="header">
                <div className="meta">
                    <div className="title">{data.title}</div>
                    <div className="author"><Link to={`/@${data.user.username}`}>by <b>{ data.user.username }</b></Link></div>
                </div>
                <ul className="hashtags">
                    {hashtags.map((hashtag, index) => (
                        <li key={index}><Link to={`/hashtag/${hashtag.value.trim()}`}>#{ hashtag.value.trim() }</Link></li>
                    ))}
                </ul>
            </div>
            <div className="footer">
                <div className="button comments" onClick={()=>handleOpenCommentsModal()}>
                    <Icon icon="akar-icons:comment" />
                </div>
                <div className={liked ? `likes liked` : `likes`}>
                    +{data.likes.length} byczku
                </div>
                <div className="button more">
                    <Icon icon="akar-icons:more-vertical" />
                    <ul>
                        <li><Icon icon="akar-icons:arrow-forward-thick" /> Udostępnij</li>
                        <li><Icon icon="akar-icons:trash-can" /> Usuń</li>
                        <li><Icon icon="akar-icons:flag" /> Zgłoś</li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    )
}
