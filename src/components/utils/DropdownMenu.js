import React from 'react'
import styled from 'styled-components';

const Wrapper = styled.div`
    position: absolute;
    top: 100%;
    right: 0;
    width: 200px;
    font-size: 14px;
    opacity: 0;
    pointer-events: none;

    transition: opacity .2s ease;
    .wrapper{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        margin-top: 1rem;
        border-radius: .5rem;
        padding: .5rem;
        background-color: ${({ theme }) => theme.colors.backgroundLighter};
        li{
            width: 100%;
        }
        a{
            display: block;
            position: relative;
            width: 100%;
            padding: .5rem;
            border-radius: 3px;
            transition: background-color .2s ease;
            p{
                position: relative;
                width: max-content;
            }
            
            &:hover{
                background-color: ${({theme}) => theme.colors.background};
            }
        }
        hr{
            width: 100%;
            margin: .5rem auto;
            background-color: ${({theme}) => theme.colors.backgroundLighter};
        }
    }
`;

export default function DropdownMenu({children}) {
    return (
        <Wrapper>
            <ul className="wrapper">
                {children}
            </ul>
        </Wrapper>
    )
}
