import React from "react";
import styled, { keyframes } from "styled-components";

const bounce = keyframes`
    to {
        transform: translateY(-50%);
    }
`;

const DotsContainer = styled.div`
    display: inline-block;
`;

const Dot = styled.span`
    display: inline-block;
    width: 8px;
    height: 8px;
    margin: 0 3px;
    border-radius: 50%;
    background-color: currentColor;
    animation: ${bounce} 0.6s infinite alternate;

    &:nth-child(2) {
        animation-delay: 0.2s;
    }

    &:nth-child(3) {
        animation-delay: 0.4s;
    }
`;

const LoadingDots: React.FC = () => (
    <DotsContainer>
        <Dot />
        <Dot />
        <Dot />
    </DotsContainer>
);

export default LoadingDots;