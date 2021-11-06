import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
    display: flex;
    align-items: center;
    background-color: ${({ theme }) => theme.colors.accent};
    font-weight: bold;
    padding: 0 1rem;
    cursor: pointer;
    transition: background-color .2s ease;
    min-width: 100px;
    text-align: center;
    white-space: nowrap;
    &:hover{
        background-color: ${({ theme }) => theme.colors.accentDarker};
    }
    svg{
        margin-right: .5rem;
    }

    ${({ variant, theme }) => 
        variant && variant === 'ghost' &&
        `background-color: ${theme.colors.backgroundLighter};
        border: 2px solid transparent;
        &:hover{
            border-color: ${theme.colors.background};
            background-color: ${theme.colors.backgroundLighter};
    }`}
    ${({ variant, theme }) =>
        variant && variant === 'dark' &&
        `background-color: ${theme.colors.background};
        &:hover{
            background-color: ${theme.colors.background};
        }`
    }
    
`;

export default function Button(props) {
    return (
        <StyledButton variant={props.variant} {...props}>
            {props.children}
        </StyledButton>
    )
}
