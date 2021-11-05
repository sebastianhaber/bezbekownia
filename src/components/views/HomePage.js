import React from 'react'
import Post from '../organisms/post/Post'

export default function HomePage({ posts }) {
    return (
        <div>
            {posts.map((post, index) => (
                <Post data={post} key={index} />
            ))}
        </div>
    )
}
