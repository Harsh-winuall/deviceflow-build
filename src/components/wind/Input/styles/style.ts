'use client';
import styled, { css } from 'styled-components';
import { Colors } from './colors';

const InputContainerDisabled = css<Props>`
	${({ disabled }) =>
		disabled &&
		css`
			background: ${Colors.grey_50};
			border: 1px solid ${Colors.grey_100};
			&::placeholder {
				color: #b4b7ba;
			}
		`}
`;

const InputContainerFocused = css<Props>`
	${({ error, focused }) =>
		error
			? css`
					border: 1px solid ${Colors.error_500};
			  `
			: focused &&
			  css`
					outline-offset: 0px;
					outline: none;
					border: 1px solid ${Colors.grey_900};
			  `}
`;

const InputContainerHover = css<Props>`
	:hover {
		${({ focused }) =>
			!focused &&
			css`
				border: 0px solid ${Colors.grey_200};
			`}
	}
`;
export const InputContainer = styled.div<Props>`
	box-sizing: border-box;
	border-radius: 10px;

	display: flex;
	width: 100%;
	min-height: 42px;
	justify-content: space-between;
	align-items: center;
	padding-left: ${({ isPaddingBefore }) => (isPaddingBefore ? '12px' : '0px')};
	padding: ${({ isPaddingBefore, isPaddingAfter }) =>
		isPaddingBefore && isPaddingAfter && '8px 12px !important'};
	padding-right: ${({ isPaddingAfter }) => (isPaddingAfter ? '12px' : '0px')};
	border: ${(props: Props) =>
		props.error
			? `1px solid ${Colors.error_500}`
			: `1px solid ${Colors.grey_100}`};
	${InputContainerDisabled}
	${InputContainerFocused}
  ${InputContainerHover}
  gap: 12px;
`;

export const BaseInput = styled.input<Props>`
	max-width: 100%;
	border: none;
	background: transparent;
	width: 100%;
	padding: 0;
	box-shadow: none;
	outline: none;
	appearance: none;

	&::placeholder {
		color: ${(props: Props) =>
			props.value ? `${Colors.grey_900}` : `${Colors.grey_400}`};
		font-family: Inter-Regular;
		font-style: normal;
		font-weight: 400;
		font-size: 12px;
		line-height: 24px;
	}

	:disabled {
		cursor: not-allowed;
		background: ${Colors.grey_50};
		&::placeholder {
			color: ${Colors.grey_300};
		}
	}

	:focus-visible {
		outline: none;
	}
`;

export const Before = styled.span`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	min-height: 42px;
	gap: 8px;
	width: 70px;
	background: ${Colors.white_3};
	border-radius: 10px 0px 0px 10px;
`;

export const After = styled.span`
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	min-height: 42px;
	gap: 8px;
	width: 70px;
	background: ${Colors.white_3};
	border-radius: 0px 10px 10px 0px;
`;

export const InputContainerItem = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	position: relative;
	flex-wrap: wrap;

	align-items: center;
	gap: 12px;
`;

export const PrefixWrapper = styled.div<Props>`
	position: relative;
	display: flex;
	flex: auto;
	gap: 12px;
	flex-wrap: ${({ addFlexWrap }) => addFlexWrap && 'wrap'};
	max-width: 100%;

	align-items: center;
`;

export const InputWrapper = styled.div`
	position: relative;
	display: flex;
	flex-direction: column;
`;

export const InfoIconWrap = styled.span`
	display: flex;
	align-items: center;
	padding: '0px 13.25px';
`;

export const Col = styled.div`
	flex-grow: 1;
`;

export const Flex = styled.div`
	display: flex;
	align-items: center;
`;

interface Props {
	value?: string | ReadonlyArray<string> | number | undefined;
	error?: boolean;
	disabled?: boolean;
	focused?: boolean;
	isPaddingBefore?: boolean;
	isPaddingAfter?: boolean;
	addFlexWrap?: boolean;
}
