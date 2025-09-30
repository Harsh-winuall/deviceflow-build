import { Typography } from '../../Typography';
import * as React from 'react';
import { InfoIcon } from '../Icon/InfoIcon';
import {
	After,
	BaseInput,
	Before,
	Col,
	Flex,
	InfoIconWrap,
	InputContainer,
	InputContainerItem,
	InputWrapper,
	PrefixWrapper,
} from '../styles/style';
import { Colors } from '../styles/colors';
import { useEffect, useState } from 'react';
import { Icon } from '../../Icons';
import { FlexDiv, Mandatory } from './Textarea/style';

export const Input = ({
	disabled,
	prefix,
	suffix,
	addOnBefore,
	addOnAfter,
	onPressEnter,
	onKeyDown,
	onFocus,
	onBlur,
	placeholder,
	helperText,
	label,
	width = 380,
	error,
	style,
	addOnAfterStyle,
	addOnBeforeStyle,
	onChange,
	hideInfoIcon,
	parentComponent,
	labelAlign,
	labelStyle,
	rules,
	type = 'text',
	value,
	name,
	tooltip,
	markMandatory,
	...rest
}: InputProps) => {
	const [id] = useState(Math.random().toString(36).slice(2));
	const [focused, setFocused] = useState<boolean>(false);
	const inputRef = React.useRef<HTMLInputElement>(null);

	useEffect(() => {
		setFocused((prev) => (prev && disabled ? false : prev));
	}, [disabled]);

	const getErrorMessage = () => {
		const inpObj: any = document.getElementById(id);
		if (inpObj && (name || (!name && rules?.trigger))) {
			return inpObj.checkValidity() ? '' : inpObj.validationMessage;
		} else return '';
	};

	const hasError = () => {
		return error || getErrorMessage()?.length > 0;
	};

	const triggerFocus = (element?: HTMLInputElement | HTMLTextAreaElement) => {
		if (!element) return;
		element.focus();
		setFocused(true);
	};

	const focus = () => {
		if (inputRef.current) {
			triggerFocus(inputRef.current);
		}
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			onPressEnter?.(e);
		}
		onKeyDown?.(e);
	};

	const handleFocus: React.FocusEventHandler<HTMLInputElement> = (
		e: React.FocusEvent<HTMLInputElement>,
	) => {
		setFocused(true);
		onFocus?.(e);
	};

	const handleBlur: React.FocusEventHandler<HTMLInputElement> = (
		e: React.FocusEvent<HTMLInputElement>,
	) => {
		setFocused(false);
		onBlur?.(e);
	};

	return (
		<InputWrapper style={{ width: width, ...style }}>
			{label && (
				<FlexDiv>
					<Typography
						style={labelStyle}
						variant="body-text2"
						type="semi-bold"
						align={labelAlign}
						className='dark:text-white'>
						{label}
						{markMandatory ? <Mandatory>*</Mandatory> : ''}
					</Typography>
					{/* {tooltip ? (
            <Tooltip
              title={tooltip?.title || ""}
              description={tooltip?.description}
              direction={tooltip?.direction || "top"}
              size="lg"
            >
              <Flex>
                <Icon type="OutlinedInfo" style={{ cursor: "pointer" }} />
              </Flex>
            </Tooltip>
          ) : (
            <></>
          )} */}
				</FlexDiv>
			)}
			<Col>
				<InputContainer
					disabled={disabled}
					style={style}
					error={hasError()}
					focused={focused}
					className='dark:focus:ring-indigo-400'
					isPaddingBefore={addOnBefore ? false : true}
					isPaddingAfter={addOnAfter ? false : true}>
					<InputContainerItem onClick={() => focus()}>
						{addOnBefore && (
							<Before style={addOnBeforeStyle}> {addOnBefore} </Before>
						)}
						<PrefixWrapper addFlexWrap={parentComponent === 'select'}>
							{' '}
							{prefix && prefix}{' '}
							<BaseInput
								id={id}
								name={name}
								{...rest}
								type={type}
								ref={inputRef}
								placeholder={placeholder}
								onFocus={handleFocus}
								value={value}
								disabled={disabled}
								onChange={onChange}
								onKeyDown={handleKeyDown}
								onBlur={handleBlur}
								required={rules?.required}
								min={rules?.min}
								minLength={rules?.minLength}
								maxLength={rules?.maxLength}
								pattern={rules?.pattern}
							/>
						</PrefixWrapper>
						{hasError() && !hideInfoIcon ? (
							<InfoIconWrap>
								<InfoIcon />
							</InfoIconWrap>
						) : (
							<></>
						)}
					</InputContainerItem>
					{suffix ? suffix : ''}{' '}
					{addOnAfter && <After style={addOnAfterStyle}>.com</After>}
				</InputContainer>

				{helperText || hasError() ? (
					<Typography
						variant="body-text3"
						color={hasError() ? `${Colors.error_500}` : `${Colors.grey_600}`}>
						{helperText || getErrorMessage()}
					</Typography>
				) : (
					<></>
				)}
			</Col>
		</InputWrapper>
	);
};

export interface Rules {
	// Field should not be empty
	required?: boolean;
	// regex pattern for <HTMLInputElement>
	pattern?: string;
	// min length for input value
	minLength?: number;
	// max length for input value
	maxLength?: number;
	// for type number, min input value
	min?: string;
	// for type number, max input value
	max?: string;
	// If true, validation will be triggered (for controlled input)
	trigger?: boolean;
}

export type TooltipDirection =
	| 'bottomLeft'
	| 'bottomRight'
	| 'topLeft'
	| 'topRight'
	| 'top'
	| 'left'
	| 'right'
	| 'bottom';
export interface TooltipProps {
	title?: string;
	description?: string;
	direction?: TooltipDirection;
}

export interface InputProps {
	autoComplete?:
		| string
		| undefined /* Specifies whether an <input> element should have autocomplete enabled */;
	autoFocus?:
		| boolean
		| undefined /* Specifies that an <input> element should automatically get focus when the page loads */;
	disabled?:
		| boolean
		| undefined /* Specifies that an <input> element should be disabled */;
	max?:
		| number
		| string
		| undefined /* Specifies the maximum value for an <input> element */;
	maxLength?:
		| number
		| undefined /*Specifies the maximum number of characters allowed in an <input> element */;
	min?:
		| number
		| string
		| undefined /* Specifies a minimum value for an <input> element */;
	minLength?:
		| number
		| undefined /* Specifies the minimum number of characters required in an <input> element */;
	name?: string /* Specifies the name of an <input> element */;
	pattern?:
		| string
		| undefined /* Specifies a regular expression that an <input> element's value is checked against */;
	placeholder?:
		| string
		| undefined /* Specifies a short hint that describes the expected value of an <input> element */;
	value?:
		| string
		| ReadonlyArray<string>
		| number
		| undefined /* Specifies the value of an <input> element */;
	width?:
		| number
		| string
		| undefined /* Specifies the width of an <input> element  */;
	prefix?: React.ReactNode /* add content before placeholder */;
	suffix?: React.ReactNode /* add content after placeholder */;
	addOnBefore?: React.ReactNode /* add content before input */;
	addOnAfter?: React.ReactNode /* add content after input */;
	addOnAfterStyle?: React.CSSProperties /* add styles to  addOnAfter */;
	addOnBeforeStyle?: React.CSSProperties /* add styles to  addOnBefore */;
	onPressEnter?: React.KeyboardEventHandler<HTMLInputElement> /* on keypress enter */;
	onKeyDown?: (
		e: React.KeyboardEvent<HTMLInputElement>,
	) => void /* on keypress */;
	onFocus?: (
		e: React.FocusEvent<HTMLInputElement>,
	) => void /* triggered when input element get focused */;
	onBlur?: (
		e: React.FocusEvent<HTMLInputElement>,
	) => void /* triggered when input element focus is false */;
	error?: boolean /* Specifies error state to input element */;
	helperText?: string /* Specifies hint text to input element */;
	label?: string /* add label to input element */;
	style?: React.CSSProperties /* Specifies style to input element  */;
	onChange?: (
		e: React.ChangeEvent<HTMLInputElement>,
	) => void /* trigger input element onChange function */;
	hideInfoIcon?: boolean /* hide info icon (on error state)  */;
	parentComponent?: 'select' /* name of the parent component for adding component specific styles */;
	labelAlign?: 'left' | 'right';
	labelStyle?: React.CSSProperties;
	// Rules required for Validation
	rules?: Rules;
	// Supported Input types. Always use type email, no need to provide separate pattern for email validation.
	type?: 'text' | 'number' | 'email' | 'password';
	// the tooltip will be visible on hovering info icon in label
	tooltip?: TooltipProps;
	// will add a * next to label
	markMandatory?: boolean;
}
