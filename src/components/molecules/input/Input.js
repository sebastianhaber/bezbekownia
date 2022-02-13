import React from 'react'
import styled from 'styled-components'

export default function Input({children, maxWidth='auto', className = '', label}) {
    return (
        <Wrapper className={`input ` + className} maxWidth={maxWidth}>
            {label && (
                <div className="label">{label}</div>
            )}
            {children}
        </Wrapper>
    )
}
const Wrapper = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: ${({maxWidth}) => maxWidth};
    border: 1px solid transparent;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.colors.background.dark};
    &.error{
        border-color: ${({ theme }) => theme.colors.red.dark};
    }
    .label{
        font-size: 14px;
        color: ${({ theme }) => theme.colors.gray};
    }
    input{
        background-color: transparent;
        flex: 1;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        &.border{
            border: 1px solid ${({ theme }) => theme.colors.gray};
        }
        &:disabled{
            border: 1px solid ${({ theme }) => theme.colors.gray};
            background-color: ${({ theme }) => theme.colors.background.light};
            color: ${({ theme }) => theme.colors.gray};
            cursor: not-allowed;
        }
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