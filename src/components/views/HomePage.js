import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react/cjs/react.development';
import styled from 'styled-components';
import { limitPosts } from '../../App';
import Loader from '../molecules/loader/Loader';
import Post from '../organisms/post/Post'
import Button from '../utils/Button';
import NotFound from './NotFound';

export default function HomePage({ posts, fetchPosts, totalPostsLength, page, setPage }) {
    const [fetching, setFetching] = useState(false);
    const { searchPage } = useParams();
    const navigate = useNavigate();
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        setNotFound(false);
        let searchPageNumber = Number(searchPage);
        if (Number.isInteger(searchPageNumber)) {
            if (searchPage < 1) {
                return setNotFound(true)
            }
            if (totalPostsLength > 10) {
                if(searchPageNumber > (totalPostsLength / limitPosts)) return setNotFound(true)
            }
            setPage(searchPage)
        }
        fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchPage])
    useEffect(() => {
        setFetching(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [posts])
    
    const prevPage = () => {
        navigate(`/strona/${--page}`)
        setPage(page)
        window.scrollTo(0, 0)
        setFetching(true)
    }
    const nextPage = () => {
        navigate(`/strona/${++page}`)
        setPage(page)
        window.scrollTo(0, 0)
        setFetching(true)
    }
    
    if(notFound) return <NotFound />
    if(fetching) return <Loader />

    return (
        <div>
            <Helmet>
                <title>Bezbekownia</title>
                <meta name="description" content="Najlepsze memy na świecie" />
            </Helmet>
            {posts.map((post, index) => (
                <Post data={post} key={index} />
            ))}
            {totalPostsLength - page - 1 + limitPosts > 0 ? (
                <Pagination>
                    {page > 1 && (
                        <Button variant='dark' onClick={()=>prevPage()}>Poprzednia strona</Button>
                    )}
                    {totalPostsLength > 10 && <Button onClick={()=>nextPage()}>Następna strona</Button> }
                </Pagination>
            ) : (
                <Pagination>
                    {page > 1 && (
                        <Button variant='dark' onClick={()=>prevPage()}>Poprzednia strona</Button>
                    )}
                </Pagination>
            )}
        </div>
    )
}
const Pagination = styled.div`
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    button{
        margin: 0 1rem;
    }
`;