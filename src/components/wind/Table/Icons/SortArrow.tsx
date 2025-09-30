import { SortIcon } from "../styles/style";

export const SortArrow = ({ active, isRotate, style }: Props) => {
  return (
    <SortIcon
      width="12"
      height="14"
      viewBox="0 0 12 14"
      fill="none"
      xmlns="http://www.w3.org/200/svg"
      isRotate={isRotate}
      style={style}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M6 0.75C6.41421 0.75 6.75 1.08579 6.75 1.5V12.5C6.75 12.9142 6.41421 13.25 6 13.25C5.58579 13.25 5.25 12.9142 5.25 12.5V1.5C5.25 1.08579 5.58579 0.75 6 0.75Z"
        fill="#656B70"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0.96967 7.46967C1.26256 7.17678 1.73744 7.17678 2.03033 7.46967L6 11.4393L9.96967 7.46967C10.2626 7.17678 10.7374 7.17678 11.0303 7.46967C11.3232 7.76256 11.3232 8.23744 11.0303 8.53033L6.53033 13.0303C6.23744 13.3232 5.76256 13.3232 5.46967 13.0303L0.96967 8.53033C0.676777 8.23744 0.676777 7.76256 0.96967 7.46967Z"
        fill="#656B70"
      />
    </SortIcon>
  );
};

interface Props {
  active?: boolean;
  isRotate?: boolean;
  style?: React.CSSProperties;
}
