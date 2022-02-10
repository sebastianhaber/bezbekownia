import { useQuery } from '@apollo/client';
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router';
import styled from 'styled-components';
import Loader from '../molecules/loader/Loader';
import Post from '../organisms/post/Post';
import { SEARCH_POSTS_BY_HASHTAGS } from '../../queries/Queries';

export default function Hashtag() {
    const { hashtag } = useParams();
    const { loading, error, data } = useQuery(SEARCH_POSTS_BY_HASHTAGS, {
        variables: {
            hashtag: hashtag
        }
    });

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (error) {
        return (
            <StyledError>
                <div>
                    <p>Wystąpił nieoczekiwany błąd podczas ładowania danych. (Błąd: #006)</p>
                </div>
            </StyledError>
        )
    }
    return (
        <div>
            <Helmet>
                <title>Bezbekownia | #{hashtag}</title>
                <meta name="description" content={`Memy z #${hashtag}`} />
            </Helmet>
            {loading && <Loader />}
            {data && data.posts.map((data, index) => (
                <Post data={data} key={index} />
            ))}
        </div>
    )
}
const StyledError = styled.section`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 1440px;
    width: 100%;
    div{
        padding: 1rem;
        text-align: center;
    }
`;