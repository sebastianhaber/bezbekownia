import React from 'react';
import styled from 'styled-components';

export default function Pagination({children}) {
    return (
        <PaginationWrapper>
            {children}
        </PaginationWrapper>
    )
}
const PaginationWrapper = styled.div`
    display: flex;
    justify-content: center;
    margin: 2rem 0;
    button{
        margin: 0 1rem;
    }
`;