import { Icon } from '@iconify/react'
import React, { useContext, useEffect, useState } from 'react'
import Button from '../../../utils/Button'
import { StyledCommentsModal } from './CommentsModal.styles'
import UserImage from '../../../../assets/user-image.png'
import { Link } from 'react-router-dom'
import { API_IP } from '../../../../App'
import AppContext from '../../../../context/AppContext'
import Input from '../../../molecules/input/Input'

export default function CommentsModal({ data, closeModal }) {
    const comments = data.comments;
    const { user } = useContext(AppContext);
    const [author, setAuthor] = useState({});

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
    
    return (
        <StyledCommentsModal>
            <div className="header">
                <div className="user-info">
                    <img src={(author.image && `${API_IP}${author.image?.url}`) || UserImage} alt={author.username} />
                    <Link to={`/uzytkownik/${author.username}`} onClick={handleCloseModal} className="username">{author.username}</Link>
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
                    <img src={`${API_IP}` + data.image.url} alt={data.title} />
                </div>
                <section className="comment-section">
                    <p className='section-title'>Komentarze</p>
                    {user ? (
                        <Input>
                            <div className="icon"><Icon icon="akar-icons:comment" /></div>
                            <input type="text" placeholder='Napisz komentarz' />
                            <div className="icon send"><Icon icon="akar-icons:send" /></div>
                        </Input>
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
                                    <Link to={`/uzytkownik/${comment.author}`} onClick={handleCloseModal} className={author.username === comment.author ? `author logged` : `author`}>
                                        {comment.author}
                                    </Link>
                                    <p className="content">{comment.message}</p>
                                </div>
                                {user && user.username === comment.author && (
                                    <div className="delete">
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
