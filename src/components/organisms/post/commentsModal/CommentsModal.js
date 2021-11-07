import { Icon } from '@iconify/react'
import React, { useEffect, useState } from 'react'
import Button from '../../../utils/Button'
import { StyledCommentsModal } from './CommentsModal.styles'
import UserImage from '../../../../assets/user-image.png'
import { Link } from 'react-router-dom'
import { API_IP } from '../../../../App'

export default function CommentsModal({ data }) {
    const comments = data.comments;
    const [user, setUser] = useState({});

    useEffect(() => {
        if (!data.user.username) {
            fetch('http://' + API_IP +':1337/users/' + data.user)
            .then(res => res.json())
            .then(data => {
                setUser(data);
            });
        } else {
            setUser(data.user);
        }
    }, [data.user])
    
    return (
        <StyledCommentsModal>
            <div className="header">
                <div className="user-info">
                    <img src={user.image || UserImage} alt={user.username} />
                    <Link to={`/uzytkownik/${user.username}`} className="username">{user.username}</Link>
                </div>
                <div className="buttons">
                    <Button variant='dark'>+{data.likes.length} byczku</Button>
                    <Button variant='dark'>
                        <Icon icon="akar-icons:arrow-forward-thick" />
                        <p>Udostępnij</p>
                    </Button>
                </div>
            </div>
            <div className="wrapper">
                <div className="image">
                    <img src={`http://${API_IP}:1337` + data.image.url} alt={data.title} />
                </div>
                <section className="comment-section">
                    <p className='section-title'>Komentarze</p>
                    <div className="input">
                        <div className="icon"><Icon icon="akar-icons:comment" /></div>
                        <input type="text" placeholder='Napisz komentarz' />
                        <div className="icon send"><Icon icon="akar-icons:send" /></div>
                    </div>
                    <div className="comments">
                        {comments.length === 0 && (
                            <center><p>Brak komentarzy.</p></center>
                        )}
                        {comments.map((comment, index) => (
                            <div key={index} className='comments_user'>
                                <Link to={`/uzytkownik/${comment.author}`} className="author">{comment.author}</Link>
                                <p className="content">{comment.message}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </StyledCommentsModal>
    )
}
