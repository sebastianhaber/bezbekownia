import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { useEffect } from 'react/cjs/react.development';
import { API_IP } from '../../../App';
import AppContext from '../../../context/AppContext';
import Loader from '../../molecules/loader/Loader';
import UserImage from '../../../assets/user-image.png'
import { Helmet } from 'react-helmet';
import Post from '../../organisms/post/Post';
import { Blocked, UserSection } from './Profile.styles';

export default function Profile() {
    const { username } = useParams();
    const appContext = useContext(AppContext);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (!appContext.user || appContext.user.username !== username) {
            fetch(`${API_IP}/users?username=${username}`)
                .then(res => res.json())
                .then(user => {
                    if (user.length === 0) {
                        navigate('/');
                    } else {
                        setUser(user[0]);
                    }
                }).catch(error => {
                    console.log('error', error);
                })
        } else setUser(appContext.user);
    }, [appContext.user, username, navigate])

    useEffect(() => {
        fetch(`${API_IP}/posts?user.username=${username}`)
            .then(res => res.json())
            .then(data => {
                setPosts(data)
        })
    }, [username])

    if (!user) return <Loader />
    
    if (user && user.blocked) {
        return (
            <Blocked>
                <Helmet>
                    <title>Bezbekownia | Użytkownik { username }</title>
                    <meta name="description" content={`Profil użytkownika ${username} na Bezbekownia.pl`} />
                    <meta name='robots' content='noindex' />
                </Helmet>
                <h1>Ten użytkownik jest zablokowany.</h1>
                <p>Wróć na <Link to='/' className='clickable'>stronę główną</Link></p>
            </Blocked>
        )
    }
    return (
        <div>
            <Helmet>
                <title>Bezbekownia | Użytkownik { username }</title>
                <meta name="description" content={`Profil użytkownika ${username} na Bezbekownia.pl`} />
            </Helmet>
            <UserSection>
                <div className='background'>
                    {user.backgroundImage && (
                        <div className='image'>
                            <div className="hasImage"></div>
                            <img src={`${API_IP}${user.backgroundImage.url}`} alt={`Tło użytkownika ${username}`} />
                        </div>
                    )}
                </div>
                <div className="user">
                    <img src={(user.image && `${API_IP}${user.image.url}`) || UserImage} alt={user.username} className='profile' />
                    <div className="username">{ username }</div>
                    <p className="posts">Memy: { posts.length }</p>
                </div>
            </UserSection>
            <section>
                {posts.map((post, index) => (
                    <Post data={post} key={index} />
                ))}
            </section>
        </div>
    )
}