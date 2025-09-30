"use client";
import { useEffect, useState } from "react";
import Tree from "react-d3-tree";
import { renderCustomNodeElement } from "./RenderNode";
import { Employee } from "./data";
import {
  findOriginalNode,
  mapEmployeeToRawNodeDatum
} from "./utils";

export default function OrgChart({ orgData }: { orgData: Employee }) {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [data, setData] = useState(mapEmployeeToRawNodeDatum(orgData));

  useEffect(() => {
    const dimensions = document
      .getElementById("treeWrapper")
      ?.getBoundingClientRect();
    if (dimensions) {
      setTranslate({ x: dimensions.width / 2, y: 100 });
    }
  }, []);

  const handleNodeClick = (nodeDatum: any) => {
    const updatedData = JSON.parse(JSON.stringify(data)); // Deep clone the data

    const toggleNode = (node: any) => {
      if (node.name === nodeDatum.name) {
        if (node.children) {
          node.children = undefined;
        } else {
          const originalNode = findOriginalNode(orgData, node.name);
          if (originalNode) {
            node.children = originalNode.children
              ? originalNode?.children?.map(mapEmployeeToRawNodeDatum)
              : [];
          }
        }
      }
      node.children?.forEach(toggleNode);
    };

    toggleNode(updatedData);
    setData(updatedData);
  };

  return (
    <>
      <div className="flex flex-col w-full overflow-hidden h-full gap-3">
        {/* <div className="flex justify-between items-center">
          <h1 className="text-[#7F7F7F] font-gilroyMedium 2xl:text-lg text-base">
            Organisation Chart
          </h1>

          

          <div className="flex gap-2">
            <div className="flex items-center border rounded-[68px] border-[#7F7F7F] text-base text-[#7F7F7F] px-3 py-1.5 gap-1 cursor-pointer">
              <ChevronUp className="w-5 h-5" />
              <div className="font-gilroyMedium text-base">Top of chart</div>
            </div>
            <div className="flex items-center border rounded-[68px] border-[#7F7F7F] text-base text-[#7F7F7F] px-3 py-1.5 gap-1 cursor-pointer">
              <Link className="w-5 h-5" />
              <div className="font-gilroyMedium text-base">Group by department</div>
            </div>
            <div className="flex items-center border rounded-[68px] border-[#7F7F7F] text-base text-[#7F7F7F] px-3 py-1.5 gap-1 cursor-pointer">
              <Download className="w-5 h-5" />
              <div className="font-gilroyMedium text-base">Download</div>
            </div>
          </div>
        </div> */}
        <div
          id="treeWrapper"
          className="w-full rounded-[49px]  h-[calc(70vh-35px)]  bg-gray-50 dark:bg-gray-400 overflow-auto transition-colors border-[4px] bg-[url('/media/DottedBG.svg')] bg-cover bg-top bg-fixed bg-[rgba(247, 247, 247, 0.80)] border-[rgba(232, 232, 232, 0.50)]"
        >
          <Tree
            data={data}
            translate={translate}
            orientation="vertical"
            collapsible={false}
            pathFunc="step"
            enableLegacyTransitions={true}
            transitionDuration={300}
            renderCustomNodeElement={(rd3tProps) =>
              renderCustomNodeElement({
                ...rd3tProps,
                toggleNode: () => handleNodeClick(rd3tProps.nodeDatum),
                orgData,
              })
            }
            separation={{ siblings: 2, nonSiblings: 3 }}
            zoomable={true}
            scaleExtent={{ min: 0.3, max: 4 }}
            initialDepth={300}
            depthFactor={300}
            pathClassFunc={() => "custom-link"}
          />
        </div>
      </div>
    </>
  );
}
