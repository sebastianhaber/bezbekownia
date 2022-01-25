import React, { useContext, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { useEffect } from 'react/cjs/react.development';
import { API_IP } from '../../../App';
import AppContext from '../../../context/AppContext';
import Loader from '../../molecules/loader/Loader';
import UserImage from '../../../assets/user-image.png'
import { Helmet } from 'react-helmet-async';
import Post from '../../organisms/post/Post';
import { Blocked, UserSection } from './Profile.styles';
import axios from 'axios';

export default function Profile() {
    const { username } = useParams();
    const appContext = useContext(AppContext);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`/users?username=${username}`)
            .then(res => {
                const user = res.data;
                if (user.length === 0) {
                    return navigate('/');
                }
                setUser(user[0]);
            });
    }, [appContext.user, username, navigate])

    useEffect(() => {
        axios.get(`/posts?user.username=${username}`)
            .then(res => {
                setPosts(res.data)
        })
    }, [username])
    const removePostFromArray = (id) => {
        const filteredPosts = posts.filter(post => {
            return post.id !== id
        });
        setPosts(filteredPosts);
    }

    if (!user) return <Loader />
    
    if (user && user.blocked) {
        return (
            <Blocked>
                <Helmet>
                    <title>Bezbekownia | @{ username }</title>
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
                    <Post data={post} key={index} removePostFromArray={removePostFromArray} />
                ))}
            </section>
        </div>
    )
}