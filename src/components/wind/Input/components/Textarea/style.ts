import { Colors } from '../../styles/colors';
import styled, { css } from 'styled-components';
import { PropertySignature } from 'typescript';

const disabledTextarea = css<Props>`
	${({ disabled }) =>
		disabled &&
		css`
			background: ${Colors.grey_50};
			border: 1px solid ${Colors.grey_100};
			color: ${Colors.grey_100};
			cursor: not-allowed;
			:focus {
				outline: 1px solid ${Colors.grey_100} !important;
			}
		`}
`;

const invalidTextarea = css<Props>`
	${({ error }) =>
		error &&
		css`
			border: 1px solid ${Colors.error_500};
			:focus {
				outline: 1px solid ${Colors.error_500} !important;
				border: none;
			}
		`}
`;

export const StyledTextarea = styled.textarea<Props>`
	box-sizing: border-box;
	height: 138px;
	width: 100%;
	border: 1px solid #dde2e7;
	border-radius: 8px;
	padding: 8px 12px;
	color: ${Colors.grey_900};
	font-family: Inter-Regular;
	font-size: 16px;
	line-height: 18px;
	::placeholder {
		color: ${Colors.grey_400};
		font-size: 12px;
	}
	&:focus-visible {
		outline: -webkit-focus-ring-color auto 0px;
	}
	:focus {
		outline: 1px solid ${Colors.info_500} !important;
	}
	${disabledTextarea}
	${invalidTextarea}
`;

export const TextareaWrap = styled.div`
	width: 100%;
	display: flex;
	flex-direction: column;
	gap: 12px;
`;

export const FlexDiv = styled.div`
	display: flex;
	gap: 5px;
	align-items: center;
`;

export const Mandatory = styled.span`
	color: #f44336;
`;

interface Props {
	disabled: boolean;
	error: boolean;
	focused: boolean;
}
