import styled from "styled-components";

export const StyledNav = styled.nav`
    position: sticky;
    top: 0;
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
        margin-right: 2rem;
    }
    #search-box{
        position: relative;
        width: 100%;
    }
    .search-box{
        position: fixed;
        top: 60px;
        left: 0;
        display: none;
        width: 100%;
        background-color: ${({theme}) => theme.colors.backgroundLighter};
        &.active{
            display: block;
        }
        input{
            border-radius: 0;
            width: 100%;
            background-color: transparent;
            padding: 0 1rem;
            font-weight: bold;
            color: inherit;
            transition: background-color .2s ease;
        }
    }
    .right{
        display: flex;
        align-items: center;
        margin-left: 1rem;
        .square{
            margin-left: 1rem;
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
            display: block;
            max-width: 600px;
            border-radius: .5rem;
            transform: translate(-50%, -50%);
        }
    }
`;