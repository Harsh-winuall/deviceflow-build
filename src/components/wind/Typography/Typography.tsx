import * as React from 'react';
import { headerTags, StyledText } from './styles/style';

export const Typography = ({ style, children, ...props }: TypographyProps) => {
	return (
		<StyledText
			style={style}
			as={headerTags.includes(props.variant) ? props.variant : 'p'}
			{...props}>
			{children}
		</StyledText>
	);
};

export interface TypographyProps {
	variant:
		| 'h1'
		| 'h2'
		| 'h3'
		| 'h4'
		| 'h5'
		| 'h6'
		| 'body-text1'
		| 'body-text2'
		| 'body-text3'
		| 'small'
		| 'tiny';
	children?: React.ReactNode;
	type?: 'regular' | 'medium' | 'semi-bold' | 'bold';
	color?: string;
	align?: 'left' | 'center' | 'right' | 'justify';
	style?: React.CSSProperties;
	isEllipsis?: boolean;
	lineClamp?: number;
	className?:string;
}
