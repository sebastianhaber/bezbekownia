import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
import { useNavigate, useParams } from 'react-router';
import { useContext } from 'react/cjs/react.development';
import styled from 'styled-components';
import { API_IP } from '../../App';
import AppContext from '../../context/AppContext';
import Loader from '../molecules/loader/Loader';
import CommentsModal from '../organisms/post/commentsModal/CommentsModal';

export default function Meme() {
    const { slug } = useParams();
    const [post, setPost] = useState({});
    const navigate = useNavigate();
    const { user } = useContext(AppContext);
    const [liked, setLiked] = useState(false);
    
    useEffect(() => {
        window.scrollTo(0, 0);
        fetch(API_IP + '/posts/' + slug)
            .then(res => {
                if (res.status === 404) {
                    navigate('404');
                } else {
                    return res.json();
                }
            })
            .then(data => {
                setPost(data);
        })
    }, [slug, navigate]);

    // check if liked post
    useEffect(() => {
        if (user) {
            post.likes.map(like => {
                if (like.user === user.id) {
                    setLiked(true);
                    return true;
                }
                return false;
            })
        }
    }, [post.likes, user])

    if (Object.keys(post).length === 0) return <Loader />;

    return (
        <Wrapper>
            <Helmet>
                <title>Bezbekownia | {post.title}</title>
                <meta name="description" content={`Mem użytkownika ${post.user.username}: ${post.title}`} />
                <meta property="og:title" content={`Bezbekownia | ${post.title}`} />
                <meta property="og:type" content="image" />
                <meta property="og:image" content={`${API_IP}${post.image.url}`} />
                <meta property='og:image:alt' content={`Mem użytkownika ${post.user.username}`} />
                <meta property="og:url" content={`https://www.bezbekownia.pl/meme/${slug}/`} />
            </Helmet>
            <div className="wrapper">
                <CommentsModal data={post} setLiked={setLiked} liked={liked} />
            </div>
        </Wrapper>
    )
}
export const Wrapper = styled.div`
    display: flex;
    justify-content: center;
    max-width: 1440px;
    margin: 0 auto;
    .wrapper{
        max-width: 1000px;
        width: 100%;
        background-color: ${({ theme }) => theme.colors.backgroundLighter};
        padding: 1rem;
        overflow-y: auto;
        overflow-x: hidden;
    }

    @media screen and (min-width: 1000px){
        .wrapper{
            border-radius: .5rem;
        }
    }
`;