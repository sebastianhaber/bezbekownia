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

export default function CommentsModal({ data, closeModal, liked, setLiked }) {
    const [comments, setComments] = useState(data.comments);
    const [commentValue, setCommentValue] = useState('');
    const { user, posts } = useContext(AppContext);
    const [author, setAuthor] = useState({});

    // fetch author data
    useEffect(() => {
        if (!data.user.username) {
            fetch(API_IP +'/users/' + data.user)
            .then(res => res.json())
            .then(data => {
                setAuthor(data.user);
            });
        } else {
            setAuthor(data.user);
        }
    }, [data.user])

    const handleCloseModal = () => {
        if(closeModal) closeModal();
    }
    const handleDeleteComment = async (id) => {
        if (await deleteComment(id)) {
            const filteredComments = comments.filter(comment => {
                return comment.id !== id
            });
            setComments(filteredComments);
        }
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
        postComment(data.id, commentValue).then(res => {
            comments.push(newComment);
            setCommentValue('');
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

    return (
        <StyledCommentsModal>
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
                        {comments.map((comment, index) => (
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
                    </div>
                </section>
            </div>
        </StyledCommentsModal>
    )
}
