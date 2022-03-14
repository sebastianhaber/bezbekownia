import styled, { keyframes } from "styled-components";
import { opacityOnlyAnimation } from "../../../styles/animations";

export const AnimatedProfile = styled.div`
    animation: ${opacityOnlyAnimation} .2s ease;
`;

export const Blocked = styled.div`
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`;

export const UserSection = styled.section`
    position: relative;
    display: flex;
    justify-content: space-between;
    max-width: 600px;
    width: 100%;
    margin: 0 auto;
    margin-top: calc(60px + 2rem);
    .user{
        position: relative;
        display: flex;
        gap: 1rem;
        z-index: 1;
        font-size: 14px;
        &_informations{
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        .username{
            font-size: 1rem;
            font-weight: bold;
            margin-top: .5rem;
        }
        img{
            width: 100px;
            height: 100px;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
        }
    }
    @media screen and (max-width:  600px){
        padding: 0 1rem;
    }
`;

const fromBottom = keyframes`
    from{
        transform: translate(-50%, 200%);
    }
    to{
        transform: translate(-50%, 0);
    }
`;
const toBottom = keyframes`
    from{
        transform: translate(-50%, 0);
    }
    to{
        transform: translate(-50%, 200%);
    }
`;
export const FloatingUserSection = styled.div`
    position: fixed;
    bottom: 1rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 3;
    background-color: ${({theme}) => theme.colors.background.dark};
    border: 1px solid ${({theme}) => theme.colors.accent.light};
    border-radius: 1rem;
    padding: 0.5rem 1rem;
    user-select: none;
    animation: ${toBottom} .2s ease forwards;
    &.visible{
        animation: ${fromBottom} .2s ease forwards;
    }
    .user{
        position: relative;
        display: flex;
        align-items: center;
        gap: 1rem;
        z-index: 1;
        font-size: 14px;
        .username{
            font-size: 1rem;
            font-weight: bold;
        }
        img{
            width: 2rem;
            height: 2rem;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
        }
    }
    /* @media screen and (max-width:  600px){
        padding: 0 1rem;
    } */
`;