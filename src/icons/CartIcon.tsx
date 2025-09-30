import { LucideProps } from "lucide-react";

const CartIcon = (props: LucideProps) => (
    <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
  >
    <g clipPath="url(#clip0_2620_135016)">
      <path
        d="M15 22.0095C14.4477 22.0095 14 21.5618 14 21.0095C14 20.4572 14.4477 20.0095 15 20.0095C15.5523 20.0095 16 20.4572 16 21.0095C16 21.5618 15.5523 22.0095 15 22.0095Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 22.0095C3.44772 22.0095 3 21.5618 3 21.0095C3 20.4572 3.44772 20.0095 4 20.0095C4.55228 20.0095 5 20.4572 5 21.0095C5 21.5618 4.55228 22.0095 4 22.0095Z"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M23 1.00952H19L16.32 14.3995C16.2286 14.8599 15.9781 15.2735 15.6125 15.5678C15.2468 15.8622 14.7893 16.0185 14.32 16.0095H4.6C4.1307 16.0185 3.67318 15.8622 3.30754 15.5678C2.94191 15.2735 2.69145 14.8599 2.6 14.3995L1 6.00952H18"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_2620_135016">
        <rect
          width="24"
          height="24"
          fill="white"
          transform="matrix(-1 0 0 1 24 0.00952148)"
        />
      </clipPath>
    </defs>
  </svg>
);

export default CartIcon;
