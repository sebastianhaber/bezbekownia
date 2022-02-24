import styled from "styled-components";

export const AuthWrapper = styled.div`
    user-select: none;
    form{
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
    .heading{
        font-weight: bold;
        text-align: center;
        margin-bottom: 1rem;
    }
    img{
        width: 200px;
    }
    button{
        width: 100%;
        justify-content: center;
        margin-top: 2rem;
    }
    .footer{
        margin-top: 1rem;
        font-size: 14px;
        text-align: center;
        span{
            color: ${({ theme }) => theme.colors.accent.light};
            cursor: pointer;
            &:hover{
                text-decoration: underline;
            }
        }
    }
`;