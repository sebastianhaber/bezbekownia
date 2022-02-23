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
                id
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
                    avatar{
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
                id
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
                    avatar{
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
            avatar{
                url
            }
        }
    }
`;
export const GET_USER = gql`
    query getUser($username: String!){
        users(where: {
            username: $username,
            blocked_ne: true
        }){
            id
            isAdmin
            avatar{
                url
            }
        }
    }
`;
export const GET_USER_POSTS = gql`
    query getUserPosts($start: Int!, $limit: Int!, $username: String!){
        posts(start: $start, limit: $limit, sort: "created_at:DESC", where:{
            user:{
                blocked_ne: true,
                username: $username
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
                id
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
                    avatar{
                        url
                    }
                }
            }
        }
    }
`
export const GET_ONE_POST = gql`
    query getPost($slug: String!){
        posts(where:{
            slug: $slug,
            user:{
                blocked_ne: true,
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
                avatar{
                    url
                }
            }
            likes{
                id
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
                    avatar{
                        url
                    }
                }
            }
        }
    }
`
export const GET_AVATARS__FORALL = gql`
    {
        avatars(where:{
            forAll: true
        }){
            image{
                id
                url
                alternativeText
            }
        }
    }
`;
export const GET_AVAILABLE_AVATARS = gql`
    query getAvailableAvatars($id: ID!){
        user(id: $id){
            availableAvatars{
                image{
                    id
                    url
                    alternativeText
                }
            }
        }
    }
`;