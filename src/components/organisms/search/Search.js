import { useQuery, gql } from '@apollo/client';
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router'
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Loader from '../../molecules/loader/Loader';
import UserImage from '../../../assets/user-image.png'
import { API_IP, FLOATING_NOTIFICATION_INITIALS } from '../../../App';
import FloatingNotification from '../../molecules/floating-notification/FloatingNotification';
import { useState } from 'react/cjs/react.development';

export default function Search() {
    const { value } = useParams();
    const { loading, error, data } = useQuery(gql`
        query search{
            hashtags(where:{value:"${value}"}){
                value
                posts{
                    id
                }
            }
            users(where: {username: "${value}"}){
                username,
                image{
                url
                }
            }
            }
    `);
    const [floatingNotification, setFloatingNotification] = useState(FLOATING_NOTIFICATION_INITIALS)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (loading) return <Loader />;

    if (error) {
        return setFloatingNotification({
            isActive: true,
            message: 'Wystąpił błąd.',
            type: 'error',
        })
    }

    return (
        <div>
            {floatingNotification.isActive && (
                <FloatingNotification notification={floatingNotification} onClose={()=>setFloatingNotification(FLOATING_NOTIFICATION_INITIALS)} />
            )}
            <Helmet>
                <title>Bezbekownia | Szukaj {value}</title>
                <meta name="description" content={`Szukaj ${value} na Bezbekownia.pl`} />
            </Helmet>
            {console.log(data)}
            <Wrapper>
                <section>
                    <div className="title">Hashtag</div>
                    {data.hashtags.length > 0 ? (
                        <ul>{data.hashtags.map((hashtag, index) => (
                            <li key={index}>
                                <Link to={`/hashtag/${hashtag.value}`}>{hashtag.value} (ilość memów: {hashtag.posts.length})</Link>
                            </li>
                        )) }</ul>
                    ) : `Nie znaleziono hashtagu ${value}`}
                </section>
                <section>
                    <div className="title">Użytkownik</div>
                    {data.users.length > 0 ? (
                        <ul>{data.users.map((user, index) => (
                            <li key={index}>
                                {user.image ? <img src={`${API_IP}${user.image.url}`} alt={user.username} />
                                : <img src={UserImage} alt={user.username} />}
                                <Link to={`/@${user.username}`}>{user.username}</Link>
                            </li>
                        )) }</ul>
                    ) : `Nie znaleziono użytkownika o nazwie ${value}`}
                    
                </section>
            </Wrapper>
        </div>
    )
}
const Wrapper = styled.section`
    max-width: 1000px;
    margin: 0 auto;
    padding: 0 1rem;
    section{
        margin-bottom: 2rem;
    }
    .title{
        font-weight: bold;
        font-size: 1.5rem;
        margin-bottom: .5rem;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        li{
            display: flex;
            align-items: center;
            background-color: ${({ theme }) => theme.colors.accent.light};
            transition: background-color .2s ease;
            border-radius: .5rem;
            padding: 3px .5rem;
            &:hover{
                background-color: ${({ theme }) => theme.colors.accent.dark};
            }
            img{
                width: 2rem;
                border-radius: 50%;
                margin-right: .5rem;
            }
        }
    }
`;