import styled, { keyframes } from "styled-components";

const spin = keyframes`
    to{
        transform: rotate(360deg);
    }
`;
export const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: 2rem;
    div{
        text-align: center;
        p{
            font-size: 14px;
        }
        svg{
            animation: ${spin} 1s linear infinite;
        }
    }
    #logo{
        position: absolute;
        left: 50%;
        bottom: 2rem;
        transform: translateX(-50%);
        font-size: 1rem;
        color: ${({ theme }) => theme.colors.gray};
        font-weight: bold;
    }
`;