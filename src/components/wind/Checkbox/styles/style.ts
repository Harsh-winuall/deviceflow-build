import styled, { keyframes } from "styled-components";
import { Colors } from "./colors";

const handleSizeType = (size) => {
  switch (size) {
    case "md":
      return {
        IndicatorOuterDiv: `width: 14px ; 
                      height: 14px ;
                      border: 1px solid #D0D5DD;
                      border-radius: 6px;
                      `,
      };
    case "lg":
      return {
        IndicatorOuterDiv: `width: 17px ; 
                      border: 1px solid #D0D5DD;
                      border-radius: 6px;
                      height: 17px ;`,
      };
    default:
      return {
        IndicatorOuterDiv: `width: 14px ; 
                      height: 14px ;
                      border: 1px solid #D0D5DD;
                      border-radius: 6px;
                      `,
      };
  }
};

export const rotate = keyframes`
 from {
    opacity: 0;
    transform: rotate(0deg);
  }
  to {
    opacity: 1;
    transform: rotate(15deg);
  }`;

interface CheckboxItemProps {
  disabled?: boolean;
  align?:string;
}

export const CheckboxItem = styled.label`
  position: relative;
  display: flex;
  align-items:${({align}:CheckboxItemProps)=>align?align:''};
  cursor: ${({ disabled }: CheckboxItemProps) =>
    disabled ? "not-allowed" : "pointer"};
`;

interface IndicatorProps {
  checked: boolean;
  size?: string;
}

export const Indicator = styled.div`
  border: 1.5px solid ${Colors?.grey_100};
  ${(props: IndicatorProps) => handleSizeType(props.size)?.IndicatorOuterDiv};
`;

export const Input = styled.input`
  display: none;

  //when input checked
  &:checked + ${Indicator} {
    border-color: ${Colors.info_500};
    background: ${Colors?.info_100};
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.4375 1.125L3.85156 5.5L1.5625 3.3125' stroke='%233995E5' strokeWidth='1.25' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }

  //hover when input not checked
  &:hover:not(:checked) + ${Indicator} {
    border-color: ${Colors.info_500};
    background-color: ${Colors.info_100};
  }

  //when input is disabled not checked
  &:disabled:not(:checked) + ${Indicator} {
    border: ${`1.5px solid ${Colors.grey_50}`};
    background-color: ${Colors.white_3};
  }

  //when input is disabled and checked
  &:disabled:checked + ${Indicator} {
    border: ${`1.5px solid ${Colors.grey_50}`};
    background-color: ${Colors.white_3};
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.4375 1.125L3.85156 5.5L1.5625 3.3125' stroke='%23DDE2E7' strokeWidth='1.25' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }

  //hover when input is disabled
  &:hover:disabled + ${Indicator} {
    border: ${`1.5px solid ${Colors.grey_50}`};
    background-color: ${Colors.white_3};
  }

  //hover when input is disabled and checked
  &:hover:disabled:checked + ${Indicator} {
    border: ${`1.5px solid ${Colors.grey_50}`};
    background-color: ${Colors.white_3};
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 10 7' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8.4375 1.125L3.85156 5.5L1.5625 3.3125' stroke='%23DDE2E7' strokeWidth='1.25' strokeLinecap='round' strokeLinejoin='round'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: center;
  }
`;

export const CheckboxTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-left: 8px;
`;
