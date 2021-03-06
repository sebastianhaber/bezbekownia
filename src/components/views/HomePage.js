import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import styled from 'styled-components';
import { POSTS_QUERY_VARIABLES } from '../../App';
import AppContext from '../../context/AppContext';
import { opacityOnlyAnimation } from '../../styles/animations';
import Loader from '../molecules/loader/Loader';
import Pagination from '../molecules/pagination/Pagination';
import Post from '../organisms/post/Post'
import Button from '../utils/Button';

export default function HomePage({ totalPostsLength }) {
    const { onLoadMore, posts, isUnderMaintenance, setTotalPostsLength, getPosts } = useContext(AppContext)

    useEffect(()=>{
        window.scrollTo(0,0)
    }, [])
    useEffect(()=>{
        if(!isUnderMaintenance && (isUnderMaintenance !== null)){
            axios.get(`/posts/count?user.blocked=false`)
                .then(res => {
                    setTotalPostsLength(res.data);
                    getPosts(POSTS_QUERY_VARIABLES)
                });
        }
  }, [getPosts, isUnderMaintenance, setTotalPostsLength])

    if (!posts.length) return <Loader message='Pobieranie memów...' />
    
    return (
        <StyledHomePage>
            <Helmet>
                <title>Bezbekownia</title>
                <meta name="description" content="Najlepsze memy na świecie" />
            </Helmet>
            {posts.map((post, index) => (
                <Post data={post} key={index} />
            ))}
            {posts.length && (totalPostsLength > posts.length) && (
                <Pagination>
                    <Button onClick={()=>onLoadMore()}>Dawej więcej memów</Button>
                </Pagination>
            )}
        </StyledHomePage>
    )
}
const StyledHomePage = styled.div`
    animation: ${opacityOnlyAnimation} .2s ease;
`;