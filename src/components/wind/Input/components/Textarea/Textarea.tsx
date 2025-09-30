import React, { useEffect, useState } from "react";
import { Colors } from "../../styles/colors";
import { Mandatory, StyledTextarea, TextareaWrap } from "./style";
import { Typography } from "../../../Typography";
import { Col, Flex } from "../../styles/style";
import { FlexDiv } from "./style";
import { Icon } from "../../../Icons";
import { TooltipProps } from "../Input";
export const Textarea = ({
  value,
  onChange,
  placeholder,
  width = 380,
  disabled,
  helperText,
  error,
  label,
  style,
  labelAlign,
  labelStyle,
  rules,
  name,
  onBlur,
  tooltip,
  onFocus,
  markMandatory,
}: TextareaProps) => {
  const [id] = useState<string>(Math.random().toString(36).slice(2));
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const [focused, setFocused] = React.useState<boolean>(false);

  useEffect(() => {
    setFocused((prev) => (prev && disabled ? false : prev));
  }, [disabled]);

  const getErrorMessage = () => {
    const inpObj: any = document?.getElementById?.(id);
    if (inpObj && (name || (!name && rules?.trigger))) {
      return inpObj.checkValidity() ? "" : inpObj.validationMessage;
    } else return "";
  };

  const hasError = () => {
    return error || getErrorMessage()?.length > 0;
  };

  const handleFocus: React.FocusEventHandler<HTMLTextAreaElement> = (
    e: React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur: React.FocusEventHandler<HTMLTextAreaElement> = (
    e: React.FocusEvent<HTMLTextAreaElement>
  ) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <TextareaWrap style={{ width: width, ...style }}>
      {label && (
        <FlexDiv>
          <Typography
            align={labelAlign}
            style={labelStyle}
            variant="body-text2"
            type="semi-bold"
            className="dark:text-white"
          >
            {label}
            {markMandatory ? <Mandatory>*</Mandatory> : ""}
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
        <StyledTextarea
          error={hasError()}
          id={id}
          focused={focused}
          name={name}
          disabled={disabled || false}
          onChange={onChange}
          value={value}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          required={rules?.required}
          minLength={rules?.minLength}
          maxLength={rules?.maxLength}
          ref={textareaRef}
          className="dark:text-white"
        />
        {helperText || hasError() ? (
          <Typography
            variant="body-text3"
            color={hasError() ? Colors.error_500 : Colors.grey_600}
          >
            {helperText || getErrorMessage()}
          </Typography>
        ) : null}
      </Col>
    </TextareaWrap>
  );
};

export interface Rules {
  // Field should not be empty
  required?: boolean;
  // min length for textarea value
  minLength?: number;
  // max length for textarea value
  maxLength?: number;
  // If true, validation will be triggered (for controlled input)
  trigger?: boolean;
}

export interface TextareaProps {
  /* triggers Textarea element onChange function */
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  /* Specifies the value of <textarea> element */
  value?: string;
  /* Specifies a short hint that describes the expected value of <textarea> element */
  placeholder?: string;
  /* Specifies the width of <textarea> element */
  width?: string | number;
  /* If true, <textarea> will be disabled */
  disabled?: boolean;
  /* If true, the component is not valid */
  error?: boolean /* Specifies error state to input element */;
  /* helper text for <textarea> */
  helperText?: string;
  /* label for textarea element */
  label?: string;
  /* Extra styles for textarea element  */
  style?: React.CSSProperties;
  labelAlign?: "left" | "right";
  labelStyle?: React.CSSProperties;
  // Rules required for Validation
  rules?: Rules;
  // name attribute for textarea
  name?: string;
  onFocus?: (
    e: React.FocusEvent<HTMLTextAreaElement>
  ) => void /* triggered when textarea element get focused */;
  onBlur?: (
    e: React.FocusEvent<HTMLTextAreaElement>
  ) => void /* triggered when textarea element focus is false */;
  tooltip?: TooltipProps;
  // will add a * next to label
  markMandatory?: boolean;
}
