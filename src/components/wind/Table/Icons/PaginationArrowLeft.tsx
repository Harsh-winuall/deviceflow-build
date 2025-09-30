import { Colors } from "../styles/colors";

export const PaginationArrowLeft = ({ active }: Props) => {
  return (
    <svg
      width="6"
      height="10"
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M4.89775 0.852252C5.11742 1.07192 5.11742 1.42808 4.89775 1.64775L1.5455 5L4.89775 8.35225C5.11742 8.57192 5.11742 8.92808 4.89775 9.14775C4.67808 9.36742 4.32192 9.36742 4.10225 9.14775L0.352252 5.39775C0.132583 5.17808 0.132583 4.82192 0.352252 4.60225L4.10225 0.852252C4.32192 0.632583 4.67808 0.632583 4.89775 0.852252Z"
        fill={active ? Colors?.grey_500 : Colors?.grey_300}
      />
    </svg>
  );
};

interface Props {
  active?: boolean;
}
