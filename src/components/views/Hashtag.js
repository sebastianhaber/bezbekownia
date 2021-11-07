import { useQuery, gql } from '@apollo/client';
import React, { useEffect } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router';
import Loader from '../molecules/loader/Loader';
import Post from '../organisms/post/Post';
import ErrorWrapper from '../utils/ErrorWrapper';

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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if (error) {
        return <ErrorWrapper />
    }
    return (
        <div>
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