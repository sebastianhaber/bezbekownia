import styled from "styled-components";

export const StyledCommentsModal = styled.div`
    .header{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        /* margin-top: 4rem; */
        .user-info{
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            img{
                width: 64px;
                height: 64px;
                border-radius: 1rem;
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
        font-size: 14px;
        .section-title{
            font-size: 1rem;
            font-weight: bold;
            margin-bottom: 1rem;
        }
        .image{
            min-width: 300px;
            width: 100%;
            max-height: 400px;
            background-color: ${({theme}) => theme.colors.background};
            flex: 1;
            border-radius: .5rem;
            img{
                width: 100%;
                height: 100%;
                object-fit: contain;
                border-radius: .5rem;
            }
        }
        .comment-section{
            margin: 1rem;
            min-width: 300px;
            flex: 1;
            .input{
                display: flex;
                width: 100%;
                border-radius: 3px;
                background-color: ${({ theme }) => theme.colors.background};
                input{
                    background-color: transparent;
                    flex: 1;
                }
                .icon{
                    width: 2rem;
                    font-size: 1rem;
                    display: grid;
                    place-items: center;
                }
                .send{
                    cursor: pointer;
                }
            }
        }
        .comments{
            margin-top: 1rem;
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
        }
    }
`;