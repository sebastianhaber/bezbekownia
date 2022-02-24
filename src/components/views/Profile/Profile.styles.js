import styled from "styled-components";
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
