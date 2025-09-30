// components/wind/Skeleton/index.tsx
import styled, { keyframes } from "styled-components";

const pulse = keyframes`
  0%, 100% {
    opacity: 1;
    background-color: #eeeeee;
  }
  50% {
    opacity: 0.6;
    background-color: #f0f0f0;
  }
`;

const SkeletonWrapper = styled.div<{
  width?: string;
  height?: string;
  delay?: number;
}>`
  background-color: #eeeeee;
  border-radius: 4px;
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "20px"};
  animation: ${pulse} 1.5s ease-in-out infinite;
  animation-delay: ${(props) => props.delay || 0}s;
  animation-fill-mode: both;
`;

export const Skeleton = ({
  width,
  height,
  delay = 0,
}: {
  width?: string;
  height?: string;
  delay?: number;
}) => {
  return <SkeletonWrapper width={width} height={height} delay={delay} />;
};
