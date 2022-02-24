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
                    icon
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
                    icon
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
            icon
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
            icon
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
                    icon
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
                icon
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
                    icon
                }
            }
        }
    }
`
export const GET_ICONS_FORALL = gql`
    {
        icons(where:{
            forAll: true
        }){
            image{
                id
                url
            }
        }
    }
`;
export const GET_ICONS_AVAILABLE = gql`
    query getAvailableAvatars($id: ID!){
        user(id: $id){
            availableIcons{
                image{
                    id
                    url
                }
            }
        }
    }
`;