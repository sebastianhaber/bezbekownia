import styled from "styled-components";

export const AuthWrapper = styled.div`
    user-select: none;
    form{
        .errors{
            color: ${({ theme }) => theme.colors.red};
            font-size: 14px;
            text-align: center;
            margin-bottom: .5rem;
        }
    }
    .heading{
        font-weight: bold;
        text-align: center;
        margin-bottom: 1rem;
    }
    .input{
        margin-bottom: .5rem;
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
            color: ${({ theme }) => theme.colors.accent};
            cursor: pointer;
            &:hover{
                text-decoration: underline;
            }
        }
    }
`;