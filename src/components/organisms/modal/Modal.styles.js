import styled from "styled-components";

export const Wrapper = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    z-index: 4;
    width: 100%;
    height: 100vh;

    .overlay{
        background-color: ${({ theme }) => theme.colors.rgba};
        width: 100%;
        height: 100vh;
    }
    
    .exit{
        position: absolute;
        z-index: 4;
        top: 1rem;
        right: 1rem;
        background-color: ${({ theme }) => theme.colors.rgba};
        width: 2rem;
        height: 2rem;
        display: grid;
        place-items: center;
        border-radius: .5rem;
        cursor: pointer;
    }
    @media screen and (min-width: ${({isCommentsModal}) => isCommentsModal ? '1000px' : '380px'}){
        .exit{
            top: 2rem;
            right: 2rem;
        }
    }
`;
export const ModalWrapper = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    max-width: ${({isCommentsModal}) => isCommentsModal ? '1000px' : '380px'};
    width: 100%;
    min-height: 300px;
    height: ${({isCommentsModal}) => isCommentsModal ? '100vh' : 'auto'};
    max-height: 90vh;
    background-color: ${({ theme }) => theme.colors.background.light};
    overflow: hidden;
    .heading{
        font-size: 1.5rem;
        text-align: center;
    }
    .header, .footer{
        padding: 1rem 0;
        .flex{
            display: flex;
            align-items: center;
            gap: 1rem;
        }
    }
    .top{
        p{
            text-align: center;
            font-size: 14px;
        }
    }
    #simplebar{
        max-height: 100vh;
        padding: 1rem;
        .simplebar-scrollbar:before {
            background-color: ${({theme}) => theme.colors.gray};
        }
    }
    @media screen and (min-width: ${({isCommentsModal}) => isCommentsModal ? '1000px' : '380px'}){
        border-radius: .5rem;
    }
    @media screen and (min-width: '636px'){
        max-height: 80vh;
    }
`;