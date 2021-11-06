import styled from "styled-components";

export const Wrapper = styled.div`
    position: relative;
    max-width: 600px;
    width: 100%;
    margin: 2rem auto;
    overflow: hidden;
    img{
        position: relative;
        width: 100%;
        max-height: 1000px;
        object-fit: contain;
        &:hover{
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
        }
    }

    @media screen and (min-width: 600px){
        border-radius: .5rem;
    }
`;
