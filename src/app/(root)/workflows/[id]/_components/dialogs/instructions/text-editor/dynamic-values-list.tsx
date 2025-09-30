import { cn } from "@/lib/utils";
import {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import "./dynamic-values.css";

const DynamicValuesList = forwardRef(
  (props: { command: any; items: { id: string; label: string }[] }, ref) => {
    const { items, command } = props;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

    useEffect(() => {
      setSelectedIndex(0);
    }, [items]);

    useEffect(() => {
      const selectedEl = itemRefs.current[selectedIndex];
      if (selectedEl) {
        selectedEl.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }, [selectedIndex]);

    const selectItem = (idx: number) => {
      const item = items[idx];
      if (item)
        command({
          id: item.id,
          label: item.label,
        });
    };

    useImperativeHandle(ref, () => ({
      onKeyDown({ event }) {
        switch (event.key) {
          case "ArrowUp":
            setSelectedIndex(
              (prev) => (prev - 1 + items.length) % items.length
            );
            return true;
          case "ArrowDown":
            setSelectedIndex((prev) => (prev + 1) % items.length);
            return true;
          case "Enter":
            selectItem(selectedIndex);
            return true;
          default:
            return false;
        }
      },
    }));

    return (
      <div className="bg-white border border-gray-300 rounded-md font-gilroyRegular shadow-lg overflow-auto hide-scrollbar max-h-60">
        {items.length > 0 ? (
          items.map((item, idx) => (
            <button
              key={item.id || idx}
              ref={(el) => {
                itemRefs.current[idx] = el;
              }}
              onClick={() => selectItem(idx)}
              className={cn(
                "w-full flex items-center px-3 py-2 text-sm transition",
                "text-black",
                idx === selectedIndex
                  ? "bg-gray-100 text-black"
                  : "hover:bg-gray-50"
              )}
            >
              <span>{item.label}</span>
            </button>
          ))
        ) : (
          <div className="px-3 py-2 text-sm text-gray-500">No results</div>
        )}
      </div>
    );
  }
);

export default DynamicValuesList;
