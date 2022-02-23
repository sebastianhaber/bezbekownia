import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import { API_IP, limitPosts } from '../../../App';
import Loader from '../../molecules/loader/Loader';
import UserImage from '../../../assets/user-image.png'
import { Helmet } from 'react-helmet-async';
import Post from '../../organisms/post/Post';
import { Blocked, UserSection } from './Profile.styles';
import axios from 'axios';
import Pagination from '../../molecules/pagination/Pagination';
import Button from '../../utils/Button';
import { useQuery } from '@apollo/client';
import { GET_USER, GET_USER_POSTS } from '../../../queries/Queries';
import AppContext from '../../../context/AppContext';

export default function Profile() {
    const { username } = useParams();
    const [totalUserPosts, setTotalUserPosts] = useState(null);
    const [user, setUser] = useState(null);
    const [posts, setPosts] = useState([]);
    const { isUnderMaintenance } = useContext(AppContext);
    const { data, fetchMore, refetch } = useQuery(GET_USER_POSTS, {
        variables: {
            start: 0,
            limit: limitPosts,
            username: username
        }
    })
    const { data: userData } = useQuery(GET_USER, {
        variables: {
            username: username
        }
    })

    const loadMoreMemes = () => {
        fetchMore({
            variables: {
                start: data.posts.length
            },
            updateQuery: (previousResult, { fetchMoreResult, queryVariables }) => {
                return {
                ...previousResult,
                posts: [
                    ...previousResult.posts,
                    ...fetchMoreResult.posts,
                ],
                };
            },
        })
    }
    useEffect(() => {
        if(!isUnderMaintenance && (isUnderMaintenance !== null)){
            axios.get(`/posts/count?user.username=${username}`)
            .then(res => {
                setTotalUserPosts(res.data);
            });
        }
    }, [isUnderMaintenance, username])
    useEffect(() => {
        if (data) {
            setPosts(data.posts);
        }
    }, [data])
    useEffect(() => {
        window.scrollTo(0,0)
    }, [])
    useEffect(() => {
        if (userData) {
            setUser(userData.users[0]);
        }
    }, [userData])

    const removePostFromArray = (id) => {
        // const filteredPosts = posts.filter(post => {
        //     return post.id !== id
        // });
        // setPosts(filteredPosts);
        refetch();
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
                    {user.backgroundImage ? (
                        <div className='image'>
                            <div className="gradient"></div>
                            <img src={`${API_IP}${user.backgroundImage.url}`} alt={`Tło użytkownika ${username}`} />
                        </div>
                    ) : (
                        <div className='image'>
                            <div className="gradient"></div>
                        </div>
                    )}
                </div>
                <div className="user">
                    <img src={user.avatar ? `${API_IP}${user.avatar.url}` : UserImage} alt={user.username} className='profile' />
                    <div className="username">{ username }</div>
                    <p className="posts">Memy: { totalUserPosts }</p>
                </div>
            </UserSection>
            <section>
                {posts.map((post, index) => (
                    <Post data={post} key={index} removePostFromArray={removePostFromArray} />
                ))}
            </section>
            {(totalUserPosts - posts.length) > 0 && (
                <Pagination>
                    <Button onClick={()=>loadMoreMemes()}>Dawej więcej memów</Button>
                </Pagination>
            )}
        </div>
    )
}