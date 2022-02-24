import { keyframes } from "styled-components";

export const renderScaleAnimation = keyframes`
    from{
        transform: scale(1.04);
        opacity: 0;
    }
    to{
        transform: scale(1);
        opacity: 1;
    }
`;
export const opacityOnlyAnimation = keyframes`
    from{
        opacity: 0;
    }
    to{
        opacity: 1;
    }
`;