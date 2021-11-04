import React from 'react'
import styled from 'styled-components'

const StyledButton = styled.button`
    background-color: ${({theme}) => theme.colors.accent};
    font-weight: bold;
    padding: 0 1rem;
    cursor: pointer;
    transition: background-color .2s ease;
    &:hover{
        background-color: ${({theme}) => theme.colors.accentDarker};
    }

    ${({ props, theme }) =>
    props.variant && props.variant === 'ghost' &&
    `background-color: ${theme.colors.backgroundLighter};
    &:hover{
        background-color: ${theme.colors.backgroundLighter};
    }`}
    
`;

export default function Button(props) {
    const actions = { ...props };
    return (
        <StyledButton props={actions} actions>
            {actions.children}
        </StyledButton>
    )
}
