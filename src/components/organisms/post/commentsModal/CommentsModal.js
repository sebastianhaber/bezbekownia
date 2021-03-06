import { Icon } from '@iconify/react'
import React, { useContext, useEffect, useState } from 'react'
import Button from '../../../utils/Button'
import { StyledCommentsModal } from './CommentsModal.styles'
import UserImage from '../../../../assets/user-image.png'
import { Link } from 'react-router-dom'
import { API_IP } from '../../../../App'
import AppContext from '../../../../context/AppContext'
import Input from '../../../molecules/input/Input'
import { addLike, deleteComment, postComment, removeLike, submitReport } from '../../../../lib/auth'
import Loader from '../../../molecules/loader/Loader'
import ModalAgreeDisagree from '../../../molecules/modal-agree-disagree/ModalAgreeDisagree'
import ShareModal from '../ShareModal'
import { useQuery } from '@apollo/client'
import { GET_ONE_POST } from '../../../../queries/Queries'
import { toast } from 'react-toastify'

export default function CommentsModal({ externalData, closeModal }) {
    const [data, setData] = useState(externalData);
    const [comments, setComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState({
        page: 1,
        visible: 10,
        content: []
    });
    const [commentValue, setCommentValue] = useState('');
    const { user, posts } = useContext(AppContext);
    const [author, setAuthor] = useState(data.user);
    const [isDeleteModalActive, setDeleteModalActive] = useState(false);
    const [deletingComment, setDeletingComment] = useState({
        loading: {
            loadingText: 'Usuwanie',
            isLoading: false,
        },
        error: {
            message: 'Nie można usunąć komentarza. Spróbuj odświeżyć stronę.',
            isError: false,
        },
        deletingCommentID: null
    });
    const [shareModal, setShareModal] = useState(false);
    const [hashtags, setHashtags] = useState([]);
    const [shareHashtags, setShareHashtags] = useState({
        array: [],
        string: ''
    });
    const [liked, setLiked] = useState(false);
    const { data: gqlData, refetch } = useQuery(GET_ONE_POST, {
        variables: {
            slug: data.slug
        }
    })

    const handleCloseModal = () => {
        if (closeModal) closeModal();
    }
    const handleDeleteComment = (id) => {
        setDeleteModalActive(true);
        setDeletingComment({...deletingComment, deletingCommentID: id})
    }
    const handleUserAgreeToDeleteComment = async () => {
        if (user && user.id) {
            await deleteComment(deletingComment.deletingCommentID)
                .then(() => {
                    const filteredComments = comments.filter(comment => {
                        return comment.id !== deletingComment.deletingCommentID
                    });
                    setComments(filteredComments);
    
                    const slicedArray = filteredComments.slice(0, visibleComments.page * visibleComments.visible)
                    setVisibleComments({ content: slicedArray })
                    setDeletingComment({...deletingComment, deletingCommentID: null})
                    handleCloseAgreeModal();
                    toast.success('Usunięto komentarz.');
                    posts.map(post => {
                        if (post.id === data.id) {
                            post.comments = filteredComments
                            return true;
                        }
                        return false;
                    })
                })
                .catch(() => {
                    setDeletingComment({ ...deletingComment, error: { ...deletingComment.error, isError: true } })
                    toast.error(deletingComment.error);
                })
        }
    }
    const handleChange = (e) => {
        setCommentValue(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (user && user.id) {
            postComment(data.id, commentValue).then(() => {
                setCommentValue('');
                refetch();
            }).catch(()=>{
                toast.error('Wystąpił błąd podczas dodawania komentarza.')
            })
        }
    }
    const likePost = () => {
        if (user && user.id) {
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
                    refetch()
                    setLiked(false);
                }).catch(err => {
                    return console.log(err);
                })
            } else {
                addLike(data.id, user.id).then(async (res) => {
                    await refetch();
                }).catch(err => {
                    return console.log(err);
                })
            }
        }
    }
    const handleCheckMoreComments = () => {
        if (visibleComments.content.length < comments.length) {
            let difference = comments.length - visibleComments.content.length;
            let number = difference;
            if (difference > visibleComments.visible) number = visibleComments.visible;
            return <p className='loadmore' onClick={()=>handleLoadMoreComments()}>Załaduj więcej komentarzy ({number})</p>
        }
    }
    const handleLoadMoreComments = () => {
        const slicedArray = comments.slice(0, ++visibleComments.page * visibleComments.visible)
        setVisibleComments({...visibleComments, page: visibleComments.page++ ,content: slicedArray})
    }
    const handleCloseAgreeModal = () => {
        setDeletingComment({ ...deletingComment, error: { ...deletingComment.error, isError: false } })
        setDeleteModalActive(false)
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
    const handleReportPost = () => {
        if (user && user.id) {
            submitReport(data.id, user.id).then(() => {
                toast.success('Zgłoszono mema.')
            })
        }
    }

    useEffect(() => {
        if (user && user.id) {
            data.likes.find((like) => {
                if (parseInt(like.user.id) === user.id) {
                    setLiked(true);
                    return true;
                }
                setLiked(false);
                return false;
            });
        }
    }, [data, user])
    useEffect(() => {
        setComments(data.comments)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.comments])
    useEffect(() => {
        let content = data.comments.slice(0, visibleComments.visible).reverse()
        setVisibleComments({...visibleComments, content: content})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.comments])
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
            setHashtags(array.slice(0, 4))
        }
    }, [data])
    useEffect(() => {
        if (gqlData) {
            setData(gqlData.posts[0])
            setAuthor(gqlData.posts[0].user)
        }
    }, [gqlData])

    if (Object.keys(data).length === 0) return <Loader message='Pobieranie danych...' />
    
    return (
        <StyledCommentsModal>
            {shareModal && (
                <ShareModal data={data} hashtags={shareHashtags} onClose={()=>setShareModal(false)} />
            )}
            {isDeleteModalActive && (
                <ModalAgreeDisagree
                    title='Czy usunąć ten komentarz?'
                    subText='Tej czynności nie można confnąć.'
                    agreeText='Usuń'
                    onAgree={() => handleUserAgreeToDeleteComment()}
                    onClose={() => handleCloseAgreeModal()} />
            )}
            <div className="header">
                <div className="user-info">
                    <img src={(author.icon && `${API_IP}${author.icon.url}`) || UserImage} alt={author.username} />
                    <Link to={`/@${author.username}`} onClick={handleCloseModal} className="username">{author.username}</Link>
                </div>
                <div className="buttons">
                    <Button variant={liked ? `` : `dark`} onClick={likePost}>+{data.likes.length} byczku</Button>
                    <Button variant='dark' onClick={()=>handleOpenShareModal()}>
                        <Icon icon="akar-icons:arrow-forward-thick" />
                        <p>Udostępnij</p>
                    </Button>
                    <Button variant='dark' onClick={()=>handleReportPost()}>
                        <Icon icon="akar-icons:flag" />
                        <p>Zgłoś</p>
                    </Button>
                </div>
            </div>
            <div className="wrapper">
                <div className="image">
                    <img src={`${API_IP}` + data.image.url} alt={data.title} />
                </div>
                <section className="comment-section">
                    <div className="meme-data">
                        <p className="title">{ data.title }</p>
                        <ul className="hashtags">
                            {hashtags.map((hashtag, index) => (
                                <li key={index}><Link to={`/hashtag/${hashtag}`}>#{ hashtag.length > 15 ? `${hashtag.substring(0, 15)}...` : hashtag }</Link></li>
                            ))}
                        </ul>
                    </div>
                    <p className='section-title'>Komentarze</p>
                    {user ? (
                        <form onSubmit={handleSubmit}>
                            <Input className='withIcons'>
                                <div className="icon"><Icon icon="akar-icons:comment" /></div>
                                <input type="text" placeholder='Napisz komentarz' value={commentValue} onChange={handleChange} />
                                <button className="icon send"><Icon icon="akar-icons:send" /></button>
                            </Input>
                        </form>
                    ) : (
                        <p>Zaloguj się, by skomentować.</p>
                    )}
                    <div className="comments">
                        {!comments.length && (
                            <center><p>Brak komentarzy.</p></center>
                        )}
                        {visibleComments.content.map((comment, index) => (
                            <div key={index} className='comments_user'>
                                <div className="box">
                                    <div className="comment-author-image" style={{backgroundImage: `url(${comment.user.icon ? `${API_IP}${comment.user.icon.url}`: UserImage})`}}></div>
                                    <p className="content">
                                        <Link to={`/@${comment.user.username}`} onClick={handleCloseModal} className={(author.username === comment.user.username) ? `author logged` : `author`}>
                                            {comment.user.username}
                                        </Link>
                                        {comment.message}
                                    </p>
                                </div>
                                {user && ((user.username === comment.author) || user.isAdmin) && (
                                    <div className="delete" onClick={()=>handleDeleteComment(comment.id)}>
                                        <Icon icon="akar-icons:trash-can" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {handleCheckMoreComments()}
                    </div>
                </section>
            </div>
        </StyledCommentsModal>
    )
}
