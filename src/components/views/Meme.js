import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router';
import styled from 'styled-components';
import { API_IP } from '../../App';
import Loader from '../molecules/loader/Loader';
import CommentsModal from '../organisms/post/commentsModal/CommentsModal';

export default function Meme() {
    const { slug } = useParams();
    const [post, setPost] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        axios.get(`/posts/${slug}`)
            .then(res => {
                console.log(res);
                if (res.status === 404) {
                    navigate('404');
                } else {
                    setPost(res.data);
                }
            })
    }, [slug, navigate])


    if (!post || (Object.keys(post).length === 0)) return <Loader />;
    return (
        <Wrapper>
            {post && post.user && (
                <Helmet>
                    <title>Bezbekownia | {post.title}</title>
                    <meta name="description" content={`Mem użytkownika ${post.user.username}: ${post.title}`} />
                    <meta property="og:title" content={`Bezbekownia | ${post.title}`} />
                    <meta property="og:type" content="image" />
                    <meta property="og:image" content={`${API_IP}${post.image.url}`} />
                    <meta property='og:image:alt' content={`Mem użytkownika ${post.user.username}`} />
                    <meta property="og:url" content={`https://www.bezbekownia.pl/meme/${slug}/`} />
                </Helmet>
            )}
            <div className="wrapper">
                <CommentsModal externalData={post} />
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
        background-color: ${({ theme }) => theme.colors.background.light};
        overflow-y: auto;
        overflow-x: hidden;
        padding: 1rem 0;
        .header{
            padding: 1rem;
        }
        .comment-section{
            padding: 0 1rem;
        }
        .image{
            padding: 0 1rem;
        }
    }

    @media screen and (min-width: 1000px){
        .wrapper{
            border-radius: .5rem;
        }
    }
    @media screen and (max-width: 550px){
        .wrapper{
            .image{
                padding: 0;
            }
        }
    }
`;