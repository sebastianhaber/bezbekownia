import React, { useContext } from 'react'
import { Helmet } from 'react-helmet-async'
import AppContext from '../../context/AppContext';
import Pagination from '../molecules/pagination/Pagination';
import Post from '../organisms/post/Post'
import Button from '../utils/Button';

export default function HomePage({ totalPostsLength }) {
    const { onLoadMore, posts } = useContext(AppContext)
    
    return (
        <div>
            <Helmet>
                <title>Bezbekownia</title>
                <meta name="description" content="Najlepsze memy na świecie" />
            </Helmet>
            {posts.map((post, index) => (
                <Post data={post} key={index} />
            ))}
            {(totalPostsLength - posts.length) > 0 && (
                <Pagination>
                    <Button onClick={()=>onLoadMore()}>Dawej więcej memów</Button>
                </Pagination>
            )}
        </div>
    )
}
