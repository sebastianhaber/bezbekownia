import { gql } from "@apollo/client";

export const GET_POSTS = gql`
    query getPosts($start: Int!, $limit: Int!){
        posts(start: $start, limit: $limit, sort: "created_at:DESC", where:{
            user:{
                blocked_ne: true
            }
        }){
            id
            created_at
            title
            slug
            image{
                id
                name
                url
            }
            hashtags
            user{
                id
                username
            }
            likes{
                value
                user{
                    id
                }
            }
            comments{
                id
                created_at
                message
                user{
                    id
                    username
                    blocked
                    image{
                        url
                    }
                }
            }
        }
    }
`
export const SEARCH_POSTS_BY_HASHTAGS = gql`
    query SearchPostsByHashtag($hashtag: String!){
        posts(sort: "created_at:DESC", where: {
            hashtags_contains: $hashtag,
            user: {
                blocked_ne: true
            }
        }){
            id
            created_at
            title
            slug
            image{
                id
                name
                url
            }
            user{
                id
                username
            }
            hashtags
            likes{
                value
                user{
                    id
                }
            }
            comments{
                id
                created_at
                message
                user{
                    id
                    username
                    blocked
                    image{
                        url
                    }
                }
            }
        }
    }
`
export const SEARCH_USER_QUERY = gql`
    query User($username: String!){
        users(where: {
            username_contains: $username,
            blocked_ne: "true"
        }){
            id
            username
            blocked
            image{
                url
            }
        }
    }
`;