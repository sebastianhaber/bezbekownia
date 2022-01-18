import { Icon } from '@iconify/react';
import React from 'react'
import { Wrapper } from './Loader.styles';

export default function Loader() {
    return (
        <Wrapper>
            <Icon icon="ri:loader-3-fill" data-testid="loader" />
            <p id="logo">Bezbekownia</p>
        </Wrapper>
    )
}