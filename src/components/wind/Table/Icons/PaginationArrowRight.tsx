import { Colors } from "../styles/colors";

export const PaginationArrowRight = ({ active }: Props) => {
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
        d="M1.10225 0.852252C1.32192 0.632583 1.67808 0.632583 1.89775 0.852252L5.64775 4.60225C5.86742 4.82192 5.86742 5.17808 5.64775 5.39775L1.89775 9.14775C1.67808 9.36742 1.32192 9.36742 1.10225 9.14775C0.882583 8.92808 0.882583 8.57192 1.10225 8.35225L4.4545 5L1.10225 1.64775C0.882583 1.42808 0.882583 1.07192 1.10225 0.852252Z"
        fill={active ? Colors?.grey_500 : Colors?.grey_300}
      />
    </svg>
  );
};

interface Props {
  active?: boolean;
}
