import { Icon } from '@iconify/react';
import React from 'react'
import styled, { keyframes } from 'styled-components'

export default function Loader() {
    return (
        <Wrapper>
            <Icon icon="akar-icons:arrow-clockwise" />
        </Wrapper>
    )
}
const spin = keyframes`
    to{
        transform: rotate(360deg);
    }
`;
const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: grid;
    place-items: center;
    font-size: 2rem;
    svg{
        animation: ${spin} 1s linear infinite;
    }
`;