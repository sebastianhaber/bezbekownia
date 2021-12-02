import { createGlobalStyle } from "styled-components";

export const GlobalStyle = createGlobalStyle`
    *, *::before, *::after{
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        border-radius: 0;
    }
    html, body{
        font-size: 18px;
        font-family: 'Inter', sans-serif;
        color: ${({theme}) => theme.colors.white};
        background-color: ${({theme}) => theme.colors.background};
        line-height: 1.5;
        letter-spacing: -0.022rem;
        min-height: 100vh;
        min-width: 360px;
        overflow-x: hidden;
        &.no-scroll{
            overflow-y: hidden;
        }
    }
    main{
        margin-top: 60px;
    }
    button, input, textarea, select{
        outline: none;
        font-family: inherit;
        font-size: 14px;
        color: inherit;
        height: 2rem;
        border: 0;
        &:autofill{
            box-shadow: none;
            background: transparent;
        }
    }
    ul, ol{
        list-style: none;
    }
    a{
        color: inherit;
        text-decoration: inherit;
        &.clickable{
            color: ${({ theme }) => theme.colors.accent};
            text-decoration: underline;
        }
    }
    img{
        display: block;
    }
    .bold{
        font-weight: bold;
    }
    .square{
        width: 2rem;
        height: 2rem;
        background-color: ${({ theme }) => theme.colors.backgroundLighter};
        font-size: 1rem;
        display: grid;
        place-items: center;
        border-radius: .5rem;
        cursor: pointer;
        transition: background-color .2s ease;
        &.active{
            background-color: ${({ theme }) => theme.colors.accent};
        }
    }
    .soon{
        position: absolute;
        top: 0;
        left: 102%;
        font-size: .5rem;
        color: ${({ theme }) => theme.colors.accent};
        text-transform: uppercase;
        font-weight: bold;
    }
`;
