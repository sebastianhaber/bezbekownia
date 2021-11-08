import styled from "styled-components";

export const Blocked = styled.div`
    width: 100%;
    height: calc(100vh - 60px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
`;

export const UserSection = styled.section`
    position: relative;
    display: grid;
    place-items: center;
    height: 200px;
    .background{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        .image{
            position: relative;
            width: 100%;
            height: 100%;
        }
        .hasImage{
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to top, ${({theme}) => theme.colors.rgba}, transparent);
        }
        img{
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
        }
    }
    .user{
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        z-index: 1;
        font-size: 14px;
        .username{
            font-size: 1rem;
            font-weight: bold;
            margin-top: .5rem;
        }
        img{
            width: 4rem;
            height: 4rem;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
        }
    }
`;
