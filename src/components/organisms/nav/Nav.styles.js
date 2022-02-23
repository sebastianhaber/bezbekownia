import styled from "styled-components";

export const StyledNav = styled.nav`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;
    background-color: ${({theme}) => theme.colors.background.dark};
    width: 100%;
    transition: transform .2s ease;
    .nav{
        height: 60px;
        display: grid;
        place-items: center;
    }
    .wrapper{
        width: 100%;
        max-width: 1440px;
        height: 100%;
        padding: .5rem 1rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        li{
            cursor: pointer;
            a{
                display: flex;
                align-items: center;
                gap: 0.5rem;
                svg{
                    font-size: 1rem;
                }
            }
        }
    }
    .logo{
        font-weight: bold;
    }
    #search-box{
        position: relative;
        width: 100%;
        max-width: 300px;
        margin: 0 1rem;
    }
    .search-box{
        position: fixed;
        top: 60px;
        left: 0;
        display: none;
        width: 100%;
        height: 3rem;
        padding: 0 .5rem;
        background-color: ${({ theme }) => theme.colors.background.light};
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
            position: relative;
            &:not(:last-child){
                margin-right: 1rem;
            }
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
        .logo{
            font-size: 1rem;
        }
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