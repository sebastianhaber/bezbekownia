import { Icon } from '@iconify/react';
import React from 'react'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
    to{
        transform: rotate(360deg);
    }
`;
const StyledButton = styled.button`
    background-color: ${({ theme }) => theme.colors.accent.light};
    font-weight: bold;
    padding: 0 1rem;
    cursor: pointer;
    transition: background-color .2s ease;
    min-width: 100px;
    white-space: nowrap;
    text-align: center;
    display: grid;
    place-items: center;
    border-radius: .5rem;
    &:hover{
        background-color: ${({ theme }) => theme.colors.accent.dark};
    }
    &:disabled{
        background-color: ${({theme}) => theme.colors.gray};
        cursor: not-allowed;
        &:hover{
            background-color: ${({ theme }) => theme.colors.gray};
        }
    }
    div{
        display: flex;
        align-items: center;
        justify-content: center;
        .loadingText{
            margin-left: .5rem;
        }
    }
    svg{
        margin-right: .5rem;
        &.loading{
            margin: 0;
            font-size: 1rem;
            animation: ${rotate} 1s linear infinite;
        }
    }

    ${({ variant, theme }) => 
        variant && variant === 'ghost' &&
        `background-color: ${theme.colors.background.light};
        border: 2px solid transparent;
        &:hover{
            border-color: ${theme.colors.background.dark};
            background-color: ${theme.colors.background.light};
    }`}
    ${({ variant, theme }) =>
        variant && variant === 'dark' &&
        `background-color: ${theme.colors.background.dark};
        &:hover{
            background-color: ${theme.colors.background.dark};
        }`
    }
    
`;

export default function Button(props) {
    return (
        <StyledButton variant={props.variant} {...props} disabled={props.loading || props.disabled}>
            {props.loading ? (
                <div>
                    <Icon className='loading' icon="akar-icons:arrow-clockwise" />
                    <p className='loadingText'>{props.loading}</p>
                </div>
            ) : (
                <div>
                    {props.children}
                </div>
            )}
        </StyledButton>
    )
}
