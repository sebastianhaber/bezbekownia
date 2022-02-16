import styled from 'styled-components'

export const StyledSettings = styled.div`
    max-width: 1440px;
    margin: 0 auto;
    .nav{
        display: flex;
        justify-content: center;
        gap: 1rem;
        width: 100%;
        padding: 0.5rem 1rem;
    }
    .title{
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        margin-bottom: 2rem;
    }
    #settings{
        width: 100%;
        max-width: 400px;
        margin: 0 auto;
        margin-top: 1rem;
    }
`
export const StyledLi = styled.li`
    cursor: pointer;
    color: ${({theme}) => theme.colors.gray};
    transition: color .2s ease;
    ${({isActive, theme}) => isActive && `
        color: ${theme.colors.white};
    `}
    &:hover{
        color: ${({theme}) => theme.colors.white};
    }
`;
export const StyledTab = styled.form`
    padding: 1rem;
    .error{
        font-size: 14px;
        color: ${({ theme }) => theme.colors.red.light};
    }
    .wrapper{
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
        margin-top: 2rem;
        &.background{
            flex-direction: column;
        }
    }
    img{
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        border-radius: 0.5rem;
    }
    .image{
        width: 100px;
        height: 100px;
        img{
            border-radius: 100%;
        }
    }
    .background{
        width: 100%;
        flex: 1;
        img{
            height: 100px;
        }
        .bg-none{
            display: grid;
            place-items: center;
            height: 100px;
            background-color: ${({theme}) => theme.colors.background.light};
            border-radius: 0.5rem;
        }
    }
    .buttons{
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        gap: 1rem;
        flex: 1;
        &.submit{
            flex-direction: row;
            justify-content: flex-end;
            margin: 4rem 0;
        }
    }
    p.small{
        text-align: center;
        margin-top: 1rem;
    }
    .small{
        font-size: 14px;
    }
    .gray{
        color: ${({theme}) => theme.colors.gray};
    }
`;