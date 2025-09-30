import { LucideProps } from "lucide-react";

export const ToastIcons = {
    toast_success: (props: LucideProps) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M1.33325 7.99998C1.33325 4.31998 4.31992 1.33331 7.99992 1.33331C11.6799 1.33331 14.6666 4.31998 14.6666 7.99998C14.6666 11.68 11.6799 14.6666 7.99992 14.6666C4.31992 14.6666 1.33325 11.68 1.33325 7.99998ZM6.66659 9.44665L11.0599 5.05331L11.9999 5.99998L6.66659 11.3333L3.99992 8.66665L4.93992 7.72665L6.66659 9.44665Z"
            fill="#0D9B00"
          />
        </svg>
      ),
      toast_error: (props: LucideProps) => (
        <svg
          {...props}
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M7.99992 1.33331C4.31992 1.33331 1.33325 4.31998 1.33325 7.99998C1.33325 11.68 4.31992 14.6666 7.99992 14.6666C11.6799 14.6666 14.6666 11.68 14.6666 7.99998C14.6666 4.31998 11.6799 1.33331 7.99992 1.33331ZM11.3333 8.66665H4.66659V7.33331H11.3333V8.66665Z"
            fill="#E8132A"
          />
        </svg>
      ),
};

export default ToastIcons;