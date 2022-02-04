import { Icon } from '@iconify/react';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react/cjs/react.development';
import { API_IP, FLOATING_NOTIFICATION_INITIALS } from '../../../App';
import AppContext from '../../../context/AppContext';
import { addLike, deletePost, removeLike, submitReport } from '../../../lib/auth';
import ModalAgreeDisagree from '../../molecules/modal-agree-disagree/ModalAgreeDisagree';
import Modal from '../modal/Modal';
import FloatingNotification from '../../molecules/floating-notification/FloatingNotification';
import CommentsModal from './commentsModal/CommentsModal';
import { Wrapper } from './Post.styles'
import ShareModal from './ShareModal';
import axios from 'axios';
import Cookies from 'js-cookie';

export default function Post({ data, removePostFromArray }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [liked, setLiked] = useState(false);
    const [isHudVisible, setHudVisible] = useState(true);
    const { user, fetchPosts, posts } = useContext(AppContext);
    const [isDeleteModalActive, setDeleteModalActive] = useState(false);
    const [deletingError, setDeletingError] = useState({
        isError: false,
        message: 'Nie można usunąć mema. Spróbuj ponownie załadować stronę.'
    })
    const [floatingNotification, setFloatingNotification] = useState(FLOATING_NOTIFICATION_INITIALS)
    const navigate = useNavigate();
    const [hashtags, setHashtags] = useState([])
    const [shareHashtags, setShareHashtags] = useState({
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
        fetchPosts();
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
        navigate(`/meme/${data.slug}`)
    }
    const handleBeforeDeletingPost = () => {
        if (user && ((user.id === data.user.id) || user.isAdmin)) {
            setDeleteModalActive(true);
        }
    }
    const handleDeletePost = () => {
        const token = Cookies.get('token');

        deletePost(data.id).then(() => {
            handleCloseAgreeModal();
            fetchPosts();
            if (removePostFromArray) {
                removePostFromArray(data.id);
            }
            axios.delete('/upload/files/' + data.image.id, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            })
        })
    }
    const handleCloseAgreeModal = () => {
        setDeleteModalActive(false);
        setDeletingError({ ...deletingError, isError: false })
    }
    const handleReportPost = () => {
        submitReport(data.id, user.id).then(() => {
            setFloatingNotification({
                isActive: true,
                message: 'Zgłoszono mema.',
                type: 'success'
            })
        })
    }
    const handleLike = () => {
        if (user && user.id) {
            let likedIndex, likeId;
            const hasLiked = data.likes.find((like, index) => {
                if (like.user === user.id) {
                    likeId = like.id;
                    likedIndex = index;
                    return true;
                }
                return false;
            });

            if (hasLiked) {
                removeLike(likeId).then((res) => {
                    data.likes.splice(likedIndex, 1);
                    posts.map((post, i) => {
                        if (post.id === data.id) {
                            posts[i] = data;
                            return true;
                        }
                        return false;
                    })
                    setLiked(false);
                }).catch(err => {
                    return console.log(err);
                })
            } else {
                addLike(data.id, user.id).then(async (res) => {
                    await fetchPosts();
                }).catch(err => {
                    return console.log(err);
                })
            }
        }
    }
    const handleOpenShareModal = () => {
        setShareModal(true)
        let hashtagArray = [];
        let hashtagString = '';

        hashtags.map(hashtag => {
            hashtagArray.push(`${hashtag}`)
            return true;
        })
        hashtagString = '#' + hashtagArray.join(', #')

        setShareHashtags({
            array: hashtagArray,
            string: hashtagString
        })
    }
    const refreshData = () => {
        if (user && user.id) {
            if (data.likes.length > 0) {
                data.likes.find((like) => {
                    if (like.user === user.id) {
                        setLiked(true);
                        return true;
                    }
                    setLiked(false);
                    return false;
                });
            }
        }
    }
    useEffect(() => {
        refreshData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, user])
    useEffect(() => {
        if (data.hashtags) {
            let array = data.hashtags
                .replaceAll(" ", "")
                // eslint-disable-next-line no-useless-escape
                .replace(/[`~!@$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').split("#");
            array.map((hashtag, index) => {
                if (hashtag.length === 0) {
                    return array.splice(index, 1)
                }
                return false;
            })
            setHashtags(array)
        }
    }, [data])

    return (
        <Wrapper>
            {floatingNotification.isActive && (
                <FloatingNotification notification={floatingNotification} onClose={()=>setFloatingNotification(false)} />
            )}
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
                    <CommentsModal
                        externalData={data}
                        closeModal={() => handleCloseModal()} />
                </Modal>
            )}
            {shareModal && (
                <ShareModal data={data} hashtags={shareHashtags} onClose={()=>setShareModal(false)} />
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
                    {hashtags.map((hashtag, index) => (
                        <li key={index}><Link to={`/hashtag/${hashtag}`}>#{ hashtag }</Link></li>
                    ))}
                </ul>
            </div>
            <div className="footer">
                <div className="button comments" onClick={()=>handleOpenCommentsModal()}>
                    <Icon icon="akar-icons:comment" />
                </div>
                <div className={liked ? `likes liked` : `likes`} onClick={()=>handleLike()}>
                    +{data.likes.length} byczku
                </div>
                <div className="button more">
                    <Icon icon="akar-icons:more-vertical" />
                    <ul>
                        <li onClick={()=> handleOpenShareModal()}><Icon icon="akar-icons:arrow-forward-thick" /> Udostępnij</li>
                        {user && ((user.id === data.user.id) || user.isAdmin) && <li onClick={()=>handleBeforeDeletingPost()}><Icon icon="akar-icons:trash-can" /> Usuń</li>}
                        <li onClick={()=>handleReportPost()}><Icon icon="akar-icons:flag" /> Zgłoś</li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    )
}
