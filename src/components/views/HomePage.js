import React from 'react'
import { Helmet } from 'react-helmet'
import Loader from '../molecules/loader/Loader'
import Post from '../organisms/post/Post'

export default function HomePage({ posts }) {
    return (
        <div>
            <Helmet>
                <title>Bezbekownia</title>
                <meta name="description" content="Najlepsze memy na świecie" />
            </Helmet>
            {posts.length === 0 && <Loader />}
            {posts.map((post, index) => (
                <Post data={post} key={index} />
            ))}
        </div>
    )
}
