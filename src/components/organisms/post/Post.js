import { Icon } from '@iconify/react';
import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { API_IP } from '../../../App';
import AppContext from '../../../context/AppContext';
import { addLike, deletePost, removeLike, submitReport } from '../../../lib/auth';
import ModalAgreeDisagree from '../../molecules/modal-agree-disagree/ModalAgreeDisagree';
import Modal from '../modal/Modal';
import CommentsModal from './commentsModal/CommentsModal';
import { Wrapper } from './Post.styles'
import ShareModal from './ShareModal';
import axios from 'axios';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify'

export default function Post({ data, removePostFromArray }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [shareModal, setShareModal] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likePending, setLikePending] = useState(false);
    const [isHudVisible, setHudVisible] = useState(true);
    const { user, refetch } = useContext(AppContext);
    const [isDeleteModalActive, setDeleteModalActive] = useState(false);
    const [deletingError, setDeletingError] = useState({
        isError: false,
        message: 'Nie można usunąć mema. Spróbuj ponownie załadować stronę.'
    })
    const navigate = useNavigate();
    const [hashtags, setHashtags] = useState([])
    const [shareHashtags, setShareHashtags] = useState({
        array: [],
        string: ''
    })

    const handleOpenCommentsModal = () => {
        setModalOpen(true)
    }
    const handleCloseModal = () => {
        refetch();
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
        navigate(`/meme/${data.slug}`)
    }
    const handleBeforeDeletingPost = () => {
        if (user && ((user.id === parseInt(data.user.id)) || user.isAdmin)) {
            setDeleteModalActive(true);
        }
    }
    const handleDeletePost = () => {
        const token = Cookies.get('token');

        deletePost(data.id).then(() => {
            handleCloseAgreeModal();
            refetch();
            if (removePostFromArray) {
                removePostFromArray(data.id);
            }
            axios.delete('/upload/files/' + data.image.id, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }).then(()=>{
                toast.success(`Usunięto mema: ${data.title} 🙄`);
            })
        })
    }
    const handleCloseAgreeModal = () => {
        setDeleteModalActive(false);
        setDeletingError({ ...deletingError, isError: false })
    }
    const handleReportPost = () => {
        submitReport(data.id, user.id).then(() => {
            toast.success('Zgłoszono mema.');
        })
    }
    const handleLike = () => {
        if (user && user.id) {
            if(likePending) return false;

            setLikePending(true)
            let likeId;
            const hasLiked = data.likes.find((like, index) => {
                if (parseInt(like.user.id) === user.id) {
                    likeId = like.id;
                    return true;
                }
                return false;
            });

            if (hasLiked) {
                removeLike(likeId).then((res) => {
                    refetch();
                    setLiked(false);
                    setLikePending(false)
                }).catch(err => {
                    return setLikePending(false)
                })
            } else {
                addLike(data.id, user.id).then(async (res) => {
                    await refetch();
                    setLikePending(false)
                }).catch(err => {
                    setLikePending(false)
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
                    if (parseInt(like.user.id) === user.id) {
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
            let array = data.hashtags.split("#")
            array.map((hashtag, index) => {
                if (!hashtag.length) {
                    return array.splice(index, 1)
                }
                return false;
            })
            setHashtags(array.slice(0, 4))
        }
    }, [data])

    return (
        <Wrapper>
            {isDeleteModalActive && (
                <ModalAgreeDisagree
                    title='Czy usunąć tego mema?'
                    subText='Tej czynności nie można confnąć.'
                    agreeText='Usuń'
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
                        <li key={index}><Link to={`/hashtag/${hashtag}`}>#{ hashtag.length > 15 ? `${hashtag.substring(0, 15)}...` : hashtag }</Link></li>
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
                        {user && ((user.id === parseInt(data.user.id)) || user.isAdmin) && <li onClick={()=>handleBeforeDeletingPost()}><Icon icon="akar-icons:trash-can" /> Usuń</li>}
                        <li onClick={()=>handleReportPost()}><Icon icon="akar-icons:flag" /> Zgłoś</li>
                    </ul>
                </div>
            </div>
        </Wrapper>
    )
}
