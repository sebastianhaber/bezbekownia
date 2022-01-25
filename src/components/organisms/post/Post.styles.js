import styled from "styled-components";

export const Wrapper = styled.div`
    position: relative;
    max-width: 600px;
    width: 100%;
    min-height: 300px;
    margin: 2rem auto;
    overflow: hidden;
    user-select: none;
    background-color: ${({theme}) => theme.colors.backgroundLighter};
    img{
        position: relative;
        width: 100%;
        max-height: 1000px;
        object-fit: contain;
        cursor: pointer;
        &.z-index{
            z-index: 1;
        }
    }
    .header{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        padding: 1rem;
        background-color: ${({ theme }) => theme.colors.rgba};
        font-size: 14px;
        .meta{
            display: flex;
            justify-content: space-between;
        }
        .title{
            font-weight: bold;
            font-size: 1rem;
        }
        .author, .hashtags li{
            cursor: pointer;
        }
        .hashtags{
            display: flex;
            li{
                margin-right: .5rem;
            }
        }
    }
    .footer{
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        padding: 1rem;
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        .button, .likes{
            display: grid;
            place-items: center;
            height: 48px;
            border-radius: .5rem;
            background-color: ${({ theme }) => theme.colors.rgba};
            cursor: pointer;
            transition: background-color .2s ease;
            &:hover{
                background-color: ${({ theme }) => theme.colors.rgbaHover};
            }
        }
        .button{
            width: 48px;
            font-size: 1rem;
        }
        .likes{
            padding: 0 1rem;
            &.liked{
                background-color: ${({theme}) => theme.colors.accentDarker};
            }
        }
        .more{
            position: relative;
            &::before{
                content: '';
                position: absolute;
                top: -1rem;
                right: 0;
                width: 100%;
                height: 1rem;
            }
            &:hover > ul{
                display: flex;
            }
            ul{
                position: absolute;
                bottom: 100%;
                right: 0;
                z-index: 1;
                background-color: ${({theme}) => theme.colors.rgba};
                margin-bottom: 1rem;
                flex-direction: column;
                border-radius: .5rem;
                font-size: 14px;
                overflow: hidden;
                display: none;

                transition: opacity .2s ease, transform .2s ease;
                li{
                    display: flex;
                    align-items: center;
                    padding: .5rem 1rem;
                    cursor: pointer;
                    transition: background-color .2s ease;
                    &:hover{
                        background-color: ${({theme}) => theme.colors.rgbaHover};
                    }
                    svg{
                        margin-right: .5rem;
                    }
                }
            }
        }
    }

    @media screen and (min-width: 600px){
        border-radius: .5rem;
    }
`;
