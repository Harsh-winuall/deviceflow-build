'use client';
import { Colors } from './colors';
import styled, { css } from 'styled-components';
import { TypographyProps } from '../Typography';

export const headerTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export const StyledText = styled.div<TypographyProps>`
	font-weight: unset;
	margin: unset;
	text-align: ${({ align }) => align || 'left'};
	${({ variant }) => (headerTags.includes(variant) ? getHeaderTag : getTag)}
	${({ isEllipsis }) => isEllipsis && Ellipsis}
`;

const Ellipsis = css<TypographyProps>`
	text-overflow: ellipsis;
	overflow: hidden;
	// Addition lines for 2 line or multiline ellipsis: ;
	display: -webkit-box;
	${({ lineClamp }) =>
		lineClamp &&
		css`
			-webkit-line-clamp: ${lineClamp};
		`}
	-webkit-box-orient: vertical;
	white-space: normal;
`;

export const FontRegular = css`
	font-family: 'Inter-Regular';
`;
export const FontMedium = css`
	font-family: 'Inter-Medium';
`;
export const FontSemiBold = css`
	font-family: 'Inter-SemiBold';
`;
export const FontBold = css`
	font-family: 'Inter-Bold';
`;

export const H1 = css`
	font-size: 48px;
	line-height: 60px;
`;

export const H2 = css`
	font-size: 36px;
	line-height: 46px;
`;

export const H3 = css`
	font-size: 28px;
	line-height: 40px;
`;

export const H4 = css`
	font-size: 24px;
	line-height: 34px;
`;

export const H5 = css`
	font-size: 20px;
	line-height: 32px;
`;

export const H6 = css`
	font-size: 18px;
	line-height: 28px;
`;

export const BodyText1 = css`
	font-size: 16px;
	line-height: 24px;
`;

export const BodyText2 = css`
	font-size: 14px;
	line-height: 22px;
`;

export const BodyText3 = css`
	font-size: 12px;
	line-height: 20px;
`;

export const Small = css`
	font-size: 10px;
	line-height: 16px;
`;

export const Tiny = css`
	font-size: 8px;
	line-height: 14px;
`;

const getFontFamily = css<TypographyProps>`
	${({ type }) => {
		switch (type) {
			case 'regular':
				return FontRegular;
			case 'medium':
				return FontMedium;
			case 'semi-bold':
				return FontSemiBold;
			case 'bold':
				return FontBold;
			default:
				return FontRegular;
		}
	}}
`;

// Default Font Family for body texts - FontRegular
const getTag = css<TypographyProps>`
	color: ${({ color }) => color || Colors.grey_900};
	${({ type }) => getFontFamily};
	${({ variant }) => {
		switch (variant) {
			case 'body-text1':
				return BodyText1;
			case 'body-text2':
				return BodyText2;
			case 'body-text3':
				return BodyText3;
			case 'small':
				return Small;
			case 'tiny':
				return Tiny;
			default:
				return BodyText1;
		}
	}}
`;

// Default Font Family for Headers - FontSemiBold
const getHeaderTag = css<TypographyProps>`
	color: ${({ color }) => color || Colors.grey_900};
	${({ type }) => (type ? getFontFamily : FontSemiBold)};
	${({ variant }) => {
		switch (variant) {
			case 'h1':
				return H1;
			case 'h2':
				return H2;
			case 'h3':
				return H3;
			case 'h4':
				return H4;
			case 'h5':
				return H5;
			case 'h6':
				return H6;
			default:
				return H1;
		}
	}}
`;
