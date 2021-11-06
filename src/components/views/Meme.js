import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet';
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
        fetch('http://' + API_IP + ':1337/posts/' + slug)
            // .then(res => res.json())
            .then(res => {
                if (res.status === 404) {
                    navigate('404');
                } else {
                    return res.json();
                }
            })
            .then(data => {
                console.log('data', data)
                setPost(data);
        })
    }, [slug, navigate]);
    if (Object.keys(post).length === 0) return <Loader />;

    return (
        <Wrapper>
            <Helmet>
                <title>Bezbekownia | {post.title}</title>
                <meta name="description" content={`Mem użytkownika ${post.user.username}: ${post.title}`} />
            </Helmet>
            <div className="wrapper">
                <CommentsModal data={post} />
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