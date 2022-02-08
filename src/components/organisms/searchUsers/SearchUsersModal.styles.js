import styled from "styled-components";

export const SearchUsersWrapper = styled.section`
    padding-bottom: 2rem;
    section{
        margin-bottom: 2rem;
    }
    ul {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 1rem;
        li{
            display: flex;
            align-items: center;
            border-radius: .5rem;
            padding: 3px .5rem;
            border: 1px solid transparent;
            transition: border-color .2s ease;
            &:hover{
                border-color: ${({ theme }) => theme.colors.accent.light};
            }
            img{
                width: 2rem;
                border-radius: 50%;
                margin-right: .5rem;
            }
        }
    }
    .notFound, .error{
        margin-top: 1rem;
        text-align: center;
        .accent{
            color: ${({theme}) => theme.colors.accent.light};
        }
    }
`;