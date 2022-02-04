import React from 'react'
import styled from 'styled-components'

export default function Input({children, maxWidth='auto', className = ''}) {
    return (
        <Wrapper className={`input ` + className} maxWidth={maxWidth}>
            {children}
        </Wrapper>
    )
}
const Wrapper = styled.div`
    display: flex;
    width: 100%;
    max-width: ${({maxWidth}) => maxWidth};
    border: 1px solid transparent;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.colors.background.dark};
    &.error{
        border-color: ${({ theme }) => theme.colors.red.dark};
    }
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