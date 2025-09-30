interface TabProps {
	active: boolean;
	onClick: () => void;
	label: string;
  }
  
  export function Tab({ active, onClick, label }: TabProps) {
	return (
	  <div
		className={`flex justify-center items-center cursor-pointer transition-all duration-300 ${
		  active
			? "text-black dark:text-white"
			: "text-gray-500 dark:text-gray-400"
		}`}
		onClick={onClick}
	  >
		<span
		  className={`relative text-lg font-gilroyMedium after:content-[''] after:absolute after:left-0 after:top-11 after:w-full after:h-[2px] after:transition-all after:duration-300 ${
			active
			  ? "after:bg-black dark:after:bg-white after:scale-x-100"
			  : "after:bg-gray-300 dark:after:bg-gray-600 after:scale-x-0"
		  }`}
		>
		  {label}
		</span>
	  </div>
	);
  }
  