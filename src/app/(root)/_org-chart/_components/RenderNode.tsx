import React from "react";
import { countTotalEmployees } from "./utils";
import { ChevronDown } from "lucide-react";

// Array of colors
const colors = ["#F0B389", "#BEA3D6", "#86AD97", "#8AB4D5", "#000000"];

export const renderCustomNodeElement = ({
  nodeDatum,
  toggleNode,
  orgData,
}: any) => {
  // Determine the border color
  const getNodeBorderColor = (node: any) => {
    // If it's the CEO node, return black
    if (node.name === orgData.name) {
      return colors[4];
    }

    // If the node has a parent, inherit its color; otherwise, pick a random color
    const parentColor = node.parent?.attributes?.color;
    const nodeColor =
      parentColor || colors[Math.floor(Math.random() * (colors.length - 1))];

    // Set the color on the node's attributes for consistency
    node.attributes = { ...node.attributes, color: nodeColor };
    return nodeColor;
  };

  const borderColor = getNodeBorderColor(nodeDatum);
  const isCEO = nodeDatum.name === orgData.name;
  const totalEmployees = isCEO ? countTotalEmployees(orgData) : 0;
  const isExpanded = !!nodeDatum.children;
  const childrenCount = nodeDatum.attributes?.childrenCount;

  return (
    <g
      transform="translate(-88, -50)"
      style={{ cursor: "pointer" }}
      onClick={toggleNode}
    >
      <foreignObject
        width="176.773px"
        height="135.27px"
        style={{
          overflow: "visible",
          borderTop: `4px solid ${borderColor}`,
          borderRadius: "9.701px",
        }}
      >
        <div className="bg-white relative rounded-[9.701px] p-1 flex flex-col items-center justify-center">
          <div className="absolute -top-7 bg-white rounded-[50.775px] border-2 border-white">
            {!isCEO && (
              <div
                className="w-[9.291px] h-[5.648px] rounded-t-full border border-[#F5F5F3] absolute -top-[4.5px] right-5 mx-auto rotate-180"
                style={{ backgroundColor: borderColor }}
              ></div>
            )}
            <img
              src={nodeDatum?.image || "https://easy-peasy.ai/cdn-cgi/image/quality=80,format=auto,width=700/https://fdczvxmwwjwpwbeeqcth.supabase.co/storage/v1/object/public/images/50dab922-5d48-4c6b-8725-7fd0755d9334/3a3f2d35-8167-4708-9ef0-bdaa980989f9.png"}
              alt={nodeDatum?.name}
              className="w-12 h-12 rounded-[50.775px] object-fit"
            />
          </div>
          <div className="flex justify-end items-center my-6 flex-col gap-0.5">
            <div className="w-full "></div>
            <p className="text-base font-gilroySemiBold">{nodeDatum.name}</p>
            <p className="text-[9.701px] font-gilroyMedium text-[#7C7C7C]">
              {nodeDatum.attributes?.designation}
            </p>
           
            {isCEO ? (
              <div className="flex absolute -bottom-3 justify-center items-center rounded-[18.473px] border-[1.385px] border-[#F3F3F3] bg-white py-[5.389px] px-[5.9px]">
                <div className="text-[10px] text-black font-gilroyMedium">
                  {childrenCount} Members
                </div>
                <ChevronDown className="text-black w-[12px] h-[10px]" />
              </div>
            ) : (
              childrenCount > 0 && (
                <div className="flex absolute -bottom-3 justify-center items-center rounded-[18.473px] border-[1.385px] border-[#F3F3F3] bg-white py-[5.389px] px-[5.9px]">
                  <div className="text-[10px] text-black font-gilroyMedium">
                    {childrenCount} Members
                  </div>
                  <ChevronDown className="text-black w-[12px] h-[10px]" />
                </div>
              )
            )}

            {isExpanded && childrenCount > 0 && (
              <div
                className="w-[8.291px] h-[5.648px] rounded-t-full border border-[#F5F5F3] absolute -bottom-[13px] mx-auto"
                style={{ backgroundColor: borderColor }}
              ></div>
            )}
          </div>
        </div>
      </foreignObject>
    </g>
  );
};
