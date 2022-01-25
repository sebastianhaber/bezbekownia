import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 250px;
    .heading{
        font-weight: bold;
        text-align: center;
    }
    .error{
        font-size: 14px;
        text-align: center;
        margin-top: 1rem;
        color: ${({theme}) => theme.colors.red.light};
    }
    .buttons{
        display: flex;
        justify-content: space-evenly;
        margin-top: 6rem;
    }
`