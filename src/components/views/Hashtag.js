import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet'
import { useParams } from 'react-router';
import { API_IP } from '../../App';
import Loader from '../molecules/loader/Loader';
import Post from '../organisms/post/Post';

export default function Hashtag() {
    const [posts, setPosts] = useState([]);
    const { hashtag } = useParams();

    useEffect(() => {
        fetch('http://' + API_IP +':1337/posts')
            .then(res => res.json())
            .then(data => {
                setPosts(data);
            });
    }, [])

    return (
        <div>
            <Helmet>
                <title>Bezbekownia | </title>
                <meta name="description" content="Najlepsze memy na świecie" />
            </Helmet>
            {posts.length === 0 && <Loader />}
            {posts.map((post, index) => (
                <Post data={post} key={index} />
            ))}
        </div>
    )
}
