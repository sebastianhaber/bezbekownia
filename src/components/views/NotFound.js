import React from 'react'
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export default function NotFound() {
    return (
        <Wrapper>
            <div>
                <p className="number">#404</p>
                <h1>Gdzie Cię wywiało, anonie?</h1>
                <p>Wróć na <Link to='/'>stronę główną</Link></p>
            </div>
        </Wrapper>
    )
}
const Wrapper = styled.section`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 1440px;
    width: 100%;
    div{
        padding: 1rem;
        text-align: center;
        a{
            color: ${({ theme }) => theme.colors.accent};
            font-weight: bold;
            text-decoration: underline;
        }
    }
    .number{
        font-size: 6rem;
        font-weight: bold;
    }
`;
