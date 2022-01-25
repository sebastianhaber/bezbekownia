import styled from "styled-components";

export const StyledNotification = styled.div`
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    min-width: 300px;
    max-width: 500px;
    min-height: 50px;
    z-index: 10;
    padding: 1rem 2rem 1rem 1rem;
    border-radius: .5rem;
    overflow: hidden;
    font-size: 14px;
    ${({type, theme}) => {
    if (type === 'success') {
        return `
            background-color: ${theme.colors.green.light};
            color: ${theme.colors.green.dark};
        `
    } else if (type === 'warning' || type === 'alert') {
        return `
            background-color: ${theme.colors.yellow.light};
            color: ${theme.colors.black};
        `
    } else if (type === 'danger' || type === 'error') {
        return `
            background-color: ${theme.colors.red.light};
            color: ${theme.colors.red.dark};
        `
    } else {
        return `
            background-color: ${theme.colors.accent};
            color: ${theme.colors.white};
        `
    }
    }}
    .exit{
        position: absolute;
        top: 0;
        right: 0;
        display: grid;
        place-items: center;
        width: 2rem;
        height: 100%;
        cursor: pointer;
        font-size: 1rem;
    }
`;