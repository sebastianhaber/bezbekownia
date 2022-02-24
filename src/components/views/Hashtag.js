import { useLazyQuery } from '@apollo/client';
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router';
import styled from 'styled-components';
import Loader from '../molecules/loader/Loader';
import Post from '../organisms/post/Post';
import { SEARCH_POSTS_BY_HASHTAGS } from '../../queries/Queries';
import NotFoundImage from '../../assets/pl_notfound.png'
import { Link } from 'react-router-dom';

export default function Hashtag() {
    const { hashtag } = useParams();
    const [loadMemes, { loading, error, data }] = useLazyQuery(SEARCH_POSTS_BY_HASHTAGS, {
        variables: {
            hashtag: hashtag
        }
    });

    const notFountMemes = ()=>{
        return (
            <NotFound>
                <img src={NotFoundImage} alt="Nie udało się znaleźć memów" />
                <p>Wszystko zostało przeszukane i nie znaleźliśmy żadnych memów z hashtagiem <strong className="fontAccent">{hashtag}</strong> 😟</p>
                <br />
                <p>Wróć na <Link to='/'>stronę główną</Link></p>
            </NotFound>
        )
    }

    useEffect(() => {
        if(hashtag){
            window.scrollTo(0, 0);
            loadMemes();
        }
    }, [hashtag, loadMemes]);

    if (error) {
        return (
            <StyledError>
                <div>
                    <p>Wystąpił nieoczekiwany błąd podczas ładowania danych. (Błąd: #006)</p>
                </div>
            </StyledError>
        )
    }
    if(loading) return <Loader />

    if(data && !data.posts.length) return notFountMemes()

    return (
        <div>
            <Helmet>
                <title>Bezbekownia | #{hashtag}</title>
                <meta name="description" content={`Memy z #${hashtag}`} />
            </Helmet>
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
const NotFound = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    a{
        text-decoration: underline;
        color: ${({theme}) => theme.colors.accent.light};
    }
    img{
        width: 200px;
        margin: 0 auto;
    }
`;