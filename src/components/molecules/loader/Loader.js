import { Icon } from '@iconify/react';
import React from 'react'
import { Wrapper } from './Loader.styles';

export default function Loader({message}) {
    return (
        <Wrapper>
            <div>
                <Icon icon="ri:loader-3-fill" data-testid="loader" />
                <p className="message">{ message }</p>
            </div>
            <p id="logo">Bezbekownia</p>
        </Wrapper>
    )
}