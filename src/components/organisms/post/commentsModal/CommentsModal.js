import { Icon } from '@iconify/react'
import React, { useContext, useEffect, useState } from 'react'
import Button from '../../../utils/Button'
import { StyledCommentsModal } from './CommentsModal.styles'
import UserImage from '../../../../assets/user-image.png'
import { Link } from 'react-router-dom'
import { API_IP } from '../../../../App'
import AppContext from '../../../../context/AppContext'
import Input from '../../../molecules/input/Input'
import { addLike, deleteComment, postComment, removeLike } from '../../../../lib/auth'
import axios from 'axios'
import Loader from '../../../molecules/loader/Loader'
import ModalAgreeDisagree from '../../../molecules/modal-agree-disagree/ModalAgreeDisagree'

export default function CommentsModal({ data, closeModal, liked, setLiked }) {
    const [comments, setComments] = useState([]);
    const [visibleComments, setVisibleComments] = useState({
        page: 1,
        visible: 10,
        content: []
    });
    const [commentValue, setCommentValue] = useState('');
    const { user, posts } = useContext(AppContext);
    const [author, setAuthor] = useState({});
    const [error, setError] = useState({
        status: false,
        message: 'Nie można znaleźć nazwy użytkownika.'
    });
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

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        (async () => {
            await axios.get(`/users?username=${data.user.username}`, {
                signal: signal
            })
                .then(res => {
                    if (res.data.length > 0) {
                        setAuthor(res.data[0]);
                    } else {
                        setError({ ...error, status: true })
                    }
                })
        })();
        return () => controller.abort();
    }, [error, data.user])
    useEffect(() => {
        setComments(data.comments.reverse())
    }, [data])
    useEffect(() => {
        setVisibleComments({...visibleComments, content: data.comments.reverse().slice(0, visibleComments.visible)})
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data.comments])

    const handleCloseModal = () => {
        if(closeModal) closeModal();
    }
    const handleDeleteComment = (id) => {
        setDeleteModalActive(true);
        setDeletingComment({...deletingComment, deletingCommentID: id})
    }
    const handleUserAgreeToDeleteComment = async () => {
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
            })
    }
    const handleChange = (e) => {
        setCommentValue(e.target.value);
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();
        const newComment = {
            author: user.username,
            user: user.id,
            created_at: date,
            updated_at: date,
            message: commentValue,
            post: data.id,
        }
        postComment(data.id, commentValue).then(() => {
            setComments([newComment, ...comments])
            setVisibleComments({
                ...visibleComments, content: [newComment, ...visibleComments.content]
            })
            setCommentValue('');
            posts.map(post => {
                if (post.id === data.id) {
                    post.comments = [newComment, ...comments]
                    return true;
                }
                return false;
            })
        })
    }
    const likePost = () => {
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
                // data.likes.splice(likedIndex, 1);
                console.log(res)
                updatePost('remove', likedIndex)
            })
        } else {
            
            addLike(data.id, user.id).then((res) => {
                console.log(res)
                // data.likes.push(likeObject);
                updatePost('add')
            })
        }
    }
    const updatePost = (action, index) => {
        const date = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString();

        const likeObject = {
            post: data.id,
            user: user.id,
            created_at: date,
            updated_at: date,
            value: 1,
        }
        if (action === 'add') {
            data.likes.push(likeObject);
        } else {
            data.likes.splice(index, 1);
        }
        // refreshowac posty bo sie nic nie odswieza
        posts.map((post, i) => {
            if (post.id === data.id) {
                posts[i] = data;
                console.log('new post', posts[i])
                console.log('data', data)

                // console.log('data', data)
                return true;
            }
            return false;
        })
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
    if (error.status) {
        return <Loader message={error.message} />
    }
    return (
        <StyledCommentsModal>
            {isDeleteModalActive && (
                <ModalAgreeDisagree
                    title='Czy na pewno chcesz usunąć komentarz?'
                    agreeText='Usuń'
                    errorText={deletingComment.error.isError && deletingComment.error.message}
                    onAgree={() => handleUserAgreeToDeleteComment()}
                    onClose={() => handleCloseAgreeModal()} />
            )}
            <div className="header">
                <div className="user-info">
                    <img src={(author.image && `${API_IP}${author.image?.url}`) || UserImage} alt={author.username} />
                    <Link to={`/@${author.username}`} onClick={handleCloseModal} className="username">{author.username}</Link>
                </div>
                <div className="buttons">
                    <Button variant={liked ? `` : `dark`} onClick={likePost}>+{data.likes.length} byczku</Button>
                    <Button variant='dark'>
                        <Icon icon="akar-icons:arrow-forward-thick" />
                        <p>Udostępnij</p>
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
                            {data.hashtags.map((hashtag, index) => (
                                <li key={index}><Link to={`/hashtag/${hashtag.value.trim()}`}>#{ hashtag.value.trim() }</Link></li>
                            ))}
                        </ul>
                    </div>
                    <p className='section-title'>Komentarze</p>
                    {user ? (
                        <form onSubmit={handleSubmit}>
                            <Input>
                                <div className="icon"><Icon icon="akar-icons:comment" /></div>
                                <input type="text" placeholder='Napisz komentarz' value={commentValue} onChange={handleChange} />
                                <button className="icon send"><Icon icon="akar-icons:send" /></button>
                            </Input>
                        </form>
                    ) : (
                        <p>Zaloguj się, by skomentować.</p>
                    )}
                    <div className="comments">
                        {comments.length === 0 && (
                            <center><p>Brak komentarzy.</p></center>
                        )}
                        {visibleComments.content.map((comment, index) => (
                            <div key={index} className='comments_user'>
                                <div className="box">
                                    <Link to={`/@${comment.author}`} onClick={handleCloseModal} className={author.username === comment.author ? `author logged` : `author`}>
                                        {comment.author}
                                    </Link>
                                    <p className="content">{comment.message}</p>
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
