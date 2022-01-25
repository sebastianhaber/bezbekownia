import { useQuery, gql } from '@apollo/client';
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router';
import { FLOATING_NOTIFICATION_INITIALS } from '../../App';
import FloatingNotification from '../molecules/floating-notification/FloatingNotification';
import Loader from '../molecules/loader/Loader';
import Post from '../organisms/post/Post';

export default function Hashtag() {
    const { hashtag } = useParams();
    const { loading, error, data } = useQuery(gql`
        query hashtagPosts{
            hashtags(where:{value:"${hashtag}"}){
                posts{
                    user{
                        username
                    }
                    hashtags{
                        value
                    }
                    title
                    image{
                        url
                    }
                    slug
                    likes{
                        user{
                            id
                        }
                    }
                    comments{
                        user{
                            username
                        }
                        message
                    }
                }
            }
        }
    `);
    const [floatingNotification, setFloatingNotification] = useState(FLOATING_NOTIFICATION_INITIALS)

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

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
                <title>Bezbekownia | { hashtag }</title>
                <meta name="description" content={`Memy z tagiem ${hashtag}`} />
            </Helmet>
            {loading && <Loader />}
            {data && data.hashtags[0].posts.map((data, index) => (
                <Post data={data} key={index} />
            ))}
        </div>
    )
}