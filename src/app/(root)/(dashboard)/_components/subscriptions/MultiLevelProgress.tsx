import React from "react";

type ProgressSegment = {
  color: string;
  percentage: number; // e.g., 25 for 25%
};

type MultiLevelProgressBarProps = {
  segments: ProgressSegment[];
};

const MultiLevelProgressBar: React.FC<MultiLevelProgressBarProps> = ({
  segments,
}) => {
  return (
    <div className="w-full mt-5 h-[10px] flex rounded-full overflow-hidden bg-gradient-to-r from-[#f4fdf7] via-white to-white">
      {segments?.map((segment, index) => (
        <div
          key={index}
          className="h-[10px]"
          style={{
            width: `${segment.percentage}%`,
            borderRadius: 10,
            backgroundColor: segment.color,
          }}
        />
      ))}
    </div>
  );
};

export default MultiLevelProgressBar;
