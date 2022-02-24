import styled from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    justify-content: space-between;
    height: 250px;
    .icon{
        display: block;
        font-size: 3rem;
        margin: 0 auto;
    }
    .heading{
        font-size: 1.25rem;
        text-align: center;
    }
    .sub{
        text-align: center;
    }
    .buttons{
        display: flex;
        justify-content: space-evenly;
        margin-top: 6rem;
    }
`