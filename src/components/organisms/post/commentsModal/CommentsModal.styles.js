import styled from "styled-components";

export const StyledCommentsModal = styled.div`
    .header{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        .user-info{
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            img{
                width: 2rem;
                height: 2rem;
                border-radius: 50%;
            }
            .username{
                margin-left: 1rem;
                font-weight: bold;
            }
        }
        .buttons{
            display: flex;
            justify-content: right;
            flex: 1;
            margin-bottom: 1rem;
            button{
                margin-left: 1rem;
            }
        }
    }
    .wrapper{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        font-size: 14px;
        padding: 0;
        .section-title{
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .image{
            min-width: 350px;
            max-height: 400px;
            flex: 1;
            img{
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
        }
        .comment-section{
            margin: 1rem 0;
            min-width: 350px;
            flex: 1;
        }
        .comments{
            margin-top: 1rem;
            &_user{
                display: flex;
                .author{
                    font-weight: bold;
                    margin-right: .5rem;
                }
                .logged{
                    color: ${({theme}) => theme.colors.accent};
                }
                .box{
                    display: flex;
                    width: 100%;
                }
                .delete{
                    display: grid;
                    place-items: center;
                    width: 2rem;
                    font-size: 1rem;
                    cursor: pointer;
                }
            }
        }
        .loadmore{
            margin-top: .5rem;
            cursor: pointer;
            padding: .5rem 0;
        }
    }

    @media screen and (min-width: 700px){
        .header{
            margin-top: 0;
        }
        .wrapper{
            .image{
                max-width: 450px;
            }
            .comment-section{
                margin: 1rem;
            }
        }
    }
`;