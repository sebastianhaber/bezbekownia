import styled from "styled-components";

export const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 2rem;
    .inputs, .image{
        width: 50%;
    }
    .inputs{
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        width: 100%;
    }
    .image{
        position: relative;
        display: grid;
        place-items: center;
        background-color: ${({theme}) => theme.colors.background.dark};
        width: 300px;
        height: 300px;
        border-radius: .5rem;
        .preview{
            display: grid;
            place-items: center;
            height: 300px;
            img{
                display: none;
                width: 300px;
                height: 300px;
                object-fit: contain;
                object-position: center;
            }
        }
        label{
            position: absolute;
            width: 100%;
            height: 300px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            cursor: pointer;
            background-color: ${({ theme }) => theme.colors.rgba};
            border: 1px solid transparent;
            padding: 1rem;
            transition: background-color .2s ease, color .2s ease;
            &:hover{
                background-color: transparent;
                color: transparent;
                span.error{
                    color: transparent;
                }
            }
            &.error{
                border-color: ${({ theme }) => theme.colors.red.dark};
            }
            span.error{
                font-size: 14px;
                color: ${({ theme }) => theme.colors.red.light};
                text-align: center;
                transition: color .2s ease;
            }
            div{
                display: flex;
                align-items: center;
                gap: 0.5rem;
                svg{
                    font-size: 1.5rem;
                }
                p{
                    display: flex;
                    flex-direction: column;
                }
                span{
                    font-size: 14px;
                }
            }
        }
        #image-input{
            display: none;
        }
    }
    .buttons{
        display: flex;
        gap: 1rem;
    }
`;