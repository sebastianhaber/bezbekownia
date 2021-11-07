import { Icon } from '@iconify/react'
import React from 'react'
import styled from 'styled-components'

export default function ErrorWrapper() {
    return (
        <Wrapper>
            <p><Icon icon="akar-icons:face-sad" /> Wystąpił błąd!</p>
        </Wrapper>
    )
}
const Wrapper = styled.div`
    p{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
    }
    svg{
        font-size: 1rem;
        margin-right: .5rem;
    }
`
