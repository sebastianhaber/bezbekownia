import React from 'react'
import styled from 'styled-components'

export default function Input({children}) {
    return (
        <Wrapper className='input'>
            {children}
        </Wrapper>
    )
}
const Wrapper = styled.div`
    display: flex;
    width: 100%;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.colors.background};
    input{
        background-color: transparent;
        flex: 1;
    }
    button{
        background-color: transparent;
    }
    .icon{
        width: 2rem;
        font-size: 1rem;
        display: grid;
        place-items: center;
    }
    .send, .pointer{
        cursor: pointer;
    }
`;