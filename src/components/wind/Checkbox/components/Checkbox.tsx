import React from 'react';
import { Typography } from '@/components/wind/Typography';
import { Colors } from '../styles/colors';
import {
	CheckboxItem,
	CheckboxTextContainer,
	Indicator,
	Input,
} from '../styles/style';

export const Checkbox = ({
	children,
	value,
	name,
	checked,
	onChange,
	label,
	supportText,
	size,
	disabled,
	containerStyle,
}: CheckboxProps) => {
	return (
		<CheckboxItem
			align={!supportText && 'center'}
			disabled={disabled}
			style={containerStyle}>
			<Input
				name={name}
				value={value}
				type="checkbox"
				disabled={disabled}
				checked={checked}
				onChange={(e) => onChange && onChange(e, value)}
			/>
			<Indicator checked={checked} size={size} />
			{(children || label || supportText) && (
				<CheckboxTextContainer>
					<Typography
						type="medium"
						variant={size === 'lg' ? 'body-text1' : 'body-text2'}
						color={Colors?.grey_600}>
						{children || label}
					</Typography>
					{supportText && (
						<Typography
							type="regular"
							variant={size === 'lg' ? 'body-text1' : 'body-text2'}
							color={Colors?.grey_500}>
							{supportText}
						</Typography>
					)}
				</CheckboxTextContainer>
			)}
		</CheckboxItem>
	);
};

export interface CheckboxProps {
	children?: React.ReactNode;
	//use for setting the currently selected value
	value: string | number;
	//specifies weather the checkbox is selected
	checked?: boolean;
	//callback function that is triggered when state changes
	onChange?: (
		e: React.ChangeEvent<HTMLInputElement>,
		value?: number | string,
	) => void;
	//label of the checkbox
	label?: string;
	//description of the checkbox
	supportText?: string;
	//size of the checkbox
	size?: 'lg' | 'md';
	//if disable checkbox
	disabled?: boolean;
	containerStyle?: React.CSSProperties;
	name?: string;
}
