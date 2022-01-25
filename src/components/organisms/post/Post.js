import { Icon } from '@iconify/react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { FacebookIcon, FacebookMessengerIcon, FacebookMessengerShareButton, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share';
import { useContext, useEffect } from 'react/cjs/react.development';
import { API_IP, APP_URL } from '../../../App';
import AppContext from '../../../context/AppContext';
import { deletePost } from '../../../lib/auth';
import ModalAgreeDisagree from '../../molecules/modal-agree-disagree/ModalAgreeDisagree';
import Modal from '../modal/Modal';
import CommentsModal from './commentsModal/CommentsModal';
import { Share, Wrapper } from './Post.styles'

export default function Post({ data, removePostFromArray }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [liked, setLiked] = useState(false);
    const [isHudVisible, setHudVisible] = useState(true);
    const { user, fetchPosts } = useContext(AppContext);
    const [isDeleteModalActive, setDeleteModalActive] = useState(false);
    const [deletingError, setDeletingError] = useState({
        isError: false,
        message: 'Nie można usunąć mema. Spróbuj ponownie załadować stronę.'
    })
    const navigate = useNavigate();
    const [hashtags, setHashtags] = useState({
        array: [],
        string: ''
    })

    const handleOpenCommentsModal = () => {
        document.querySelector('html').classList.add('no-scroll');
        setModalOpen(true)
    }
    const handleCloseModal = () => {
        document.querySelector('html').classList.remove('no-scroll');
        setModalOpen(false)
    }
    const handleToggleHud = (image) => {
        if (isHudVisible) {
            image.target.className = 'z-index'
        } else {
            image.target.className = ''
        }
        setHudVisible(prevState => !prevState)
    }
    const handleNavigateTo = () => {
        navigate(`/meme/${ data.slug }`)
    }
    const handleBeforeDeletingPost = () => {
        if (user && ((user.id === data.user.id) || user.isAdmin)) {
            setDeleteModalActive(true);
        }
    }
    const handleDeletePost = () => {
        deletePost(data.id).then(() => {
            handleCloseAgreeModal();
            fetchPosts();
            if (removePostFromArray) {
                removePostFromArray(data.id);
            }
            // todo: delete all likes and comments which are assigned to this post from db
        })
    }
    const handleCloseAgreeModal = () => {
        setDeleteModalActive(false);
        setDeletingError({...deletingError, isError: false})
    }

    useEffect(() => {
        if (user && user.id) {
            data.likes.map(like => {
                if (like.user === user.id) {
                    setLiked(true);
                    return true;
                }
                return false;
            })
        } else {
            setLiked(false);
        }
    }, [user, data])
    const handleOpenShareModal = () => {
        setShareModal(true)
        let hashtagArray = [];
        let hashtagString = '';

        data.hashtags.map(hashtag => {
            hashtagArray.push(`${hashtag.value}`)
            return true;
        })
        hashtagString = '#' + hashtagArray.join(', #')

        setHashtags({
            array: hashtagArray,
            string: hashtagString
        })
    }

    return (
        <Wrapper>
            
            {isDeleteModalActive && (
                <ModalAgreeDisagree
                    title='Czy na pewno chcesz usunąć mema?'
                    agreeText='Usuń'
                    errorText={deletingError.isError && deletingError.message}
                    onAgree={() => handleDeletePost()}
                    onClose={() => handleCloseAgreeModal()} />
            )}
            {modalOpen && (
                <Modal isCommentsModal onClose={()=>handleCloseModal()}>
                    <CommentsModal data={data} setLiked={setLiked} liked={liked} closeModal={()=>handleCloseModal()} />
                </Modal>
            )}
            {shareModal && (
                <Modal onClose={() => setShareModal(false)}>
                    <div className='top'>
                        <h1 className="heading">Udostępnij</h1>
                        <p>Wybierz serwis</p>
                    </div>
                    <Share>
                        <FacebookShareButton
                            url={`${APP_URL}/meme/${data.slug}`}
                            quote={data.title}
                            hashtag={data.hashtags[0] && hashtags.string}>
                            <FacebookIcon round />
                        </FacebookShareButton>
                        <FacebookMessengerShareButton url={`${APP_URL}/meme/${data.slug}`}>
                            <FacebookMessengerIcon round />
                        </FacebookMessengerShareButton>
                        <TwitterShareButton
                            url={`${APP_URL}/meme/${data.slug}`}
                            title={data.title}
                            hashtags={hashtags.array}>
                            <TwitterIcon round />
                        </TwitterShareButton>
                    </Share>
                </Modal>
            )}
            <img
                src={`${API_IP}${data.image.url}`}
                loading='lazy' alt={data.title}
                onClick={handleToggleHud}
                onDoubleClick={() => handleNavigateTo()}
            />
            <div className="header">
                <div className="meta">
                    <div className="title">{data.title}</div>
                    <div className="author"><Link to={`/@${data.user.username}`}>by <b>{ data.user.username }</b></Link></div>
                </div>
                <ul className="hashtags">
                    {data.hashtags.map((hashtag, index) => (
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
                        <li onClick={()=> handleOpenShareModal()}><Icon icon="akar-icons:arrow-forward-thick" /> Udostępnij</li>
                        {user && ((user.id === data.user.id) || user.isAdmin) && <li onClick={()=>handleBeforeDeletingPost()}><Icon icon="akar-icons:trash-can" /> Usuń</li>}
                        <li><Icon icon="akar-icons:flag" /> Zgłoś</li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    )
}
