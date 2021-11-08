import styled from "styled-components";

export const StyledNav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;
    background-color: ${({theme}) => theme.colors.background};
    width: 100%;
    height: 60px;
    display: grid;
    place-items: center;
    font-size: 14px;
    .wrapper{
        width: 100%;
        max-width: 1440px;
        height: 100%;
        padding: 0 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .logo{
        font-weight: bold;
        font-size: 1rem;
    }
    #search-box{
        position: relative;
        width: 100%;
        margin: 0 1rem;
    }
    .search-box{
        position: fixed;
        top: 60px;
        left: 0;
        display: none;
        width: 100%;
        height: 3rem;
        background-color: ${({ theme }) => theme.colors.backgroundLighter};
        &.active{
            display: flex;
        }
        .icon, button{
            display: grid;
            place-items: center;
            width: 2rem;
            height: 100%;
            font-size: 1rem;
        }
        input{
            border-radius: 0;
            width: 100%;
            height: 100%;
            background-color: transparent;
            font-weight: bold;
            color: inherit;
            transition: background-color .2s ease;
        }
        button{
            background-color: transparent;
            cursor: pointer;
        }
    }
    .right{
        display: flex;
        align-items: center;
        .square{
            &:not(:last-child){
                margin-right: 1rem;
            }
            position: relative;
            &:hover > div{
                opacity: 1;
                pointer-events: all;
            }
        }
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            border-radius: .5rem;
        }
    }
    @media screen and (min-width: 600px){
        .search{
            display: none;
        }
        .search-box{
            position: absolute;
            top: 50%;
            left: 50%;
            display: flex;
            max-width: 600px;
            border-radius: .5rem;
            height: 2rem;
            transform: translate(-50%, -50%);
        }
    }
`;