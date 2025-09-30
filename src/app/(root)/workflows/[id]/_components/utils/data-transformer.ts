import type { AppNode } from "../types/app-node";
import { EdgeType, type EdgeData } from "../types/edge";
import { TaskType } from "../types/task";
import { getHandleIds, getTaskTypeFromTemplateKey } from "./helper";
import { BackendBranch, BackendNode, BackendWorkflowResponse } from "./types";

// Transform backend data to React Flow format
export const transformBackendToReactFlow = (
  backendData: BackendWorkflowResponse
) => {
  const nodes: AppNode[] = [];
  const edges: EdgeData[] = [];
  const processedNodes = new Set<string>();
  const fakeSplitApps = new Map<string, string>();

  // Track parent-child relationships for Device Flow detection
  const parentChildMap = new Map<string, string>(); // childId -> parentId
  const nodeTemplateMap = new Map<string, string>(); // nodeId -> templateKey

  const processNode = (node: BackendNode, parentNode?: BackendNode) => {
    if (processedNodes.has(node._id)) return;
    processedNodes.add(node._id);

    if (parentNode) {
      parentChildMap.set(node._id, parentNode._id);
    }
    nodeTemplateMap.set(node._id, node.templateKey);

    // console.log("Processing node:", {
    //   id: node._id,
    //   templateKey: node.templateKey,
    //   appName: node.appName,
    //   hasConnectorPosition: !!node.connectorPosition,
    //   position: node.position,
    //   connectorPosition: node.connectorPosition,
    // });

    const taskType = getTaskTypeFromTemplateKey(node.templateKey);
    const handleIds = getHandleIds(taskType);

    const isDeviceFlowWithStartParent =
      node.appName === "G Suite" && parentNode?.templateKey === "start";
    // console.log(isDeviceFlowWithStartParent);
    // console.log(
    //   node.appName === "G Suite" &&
    //     parentNode?.templateKey === "create_user_device_flow"
    // );
    const isGSuiteWithStartParent =
      node.appName === "Device Flow" &&
      parentNode?.templateKey === "create_workspace_user";
    // console.log("Device Flow check:", {
    //   nodeId: node._id,
    //   appName: node.appName,
    //   isDeviceFlow: node.appName === "Device Flow",
    //   parentTemplateKey: parentNode?.templateKey,
    //   isStartParent: parentNode?.templateKey === "start",
    //   isDeviceFlowWithStartParent,
    // });

    // **DETECT FAKE SPLIT APP: has appName "Split" AND has connectorPosition**
    const isFakeSplitApp = node.appName === "Split" && node.connectorPosition;

    if (isFakeSplitApp) {
      // console.log(
      //   "🔍 FOUND FAKE SPLIT APP - creating single SPLIT connector:",
      //   node._id,
      //   {
      //     position: node.position,
      //     connectorPosition: node.connectorPosition,
      //     branches: node.branches.length,
      //   }
      // );

      // **CREATE SINGLE SPLIT CONNECTOR NODE AT CONNECTOR POSITION**
      // This represents the fake Split app as a split connector in the UI
      const splitConnectorId = `${node._id}-split`;
      const splitHandleIds = getHandleIds(TaskType.SPLIT);

      // Store the mapping for later edge creation
      fakeSplitApps.set(node._id, splitConnectorId);

      const splitConnectorNode: AppNode = {
        id: splitConnectorId,
        type: "Node",
        data: {
          type: TaskType.SPLIT,
          inputs: {},
          splitData: {
            _id: node._id, // Store the fake app's _id for deletion
          },
          backendData: {
            _id: splitConnectorId,
            workflowId: backendData.workflow._id,
            parentNodeId: node._id,
            templateKey: "split",
            branches: [],
            appPosition: {
              x: node.connectorPosition.x,
              y: node.connectorPosition.y,
            },
            // Store fake app data for deletion
            fakeAppId: node._id,
            isFakeSplitApp: true, // Mark this as representing a fake app
          },
        },
        position: node.connectorPosition, // Position at connector position
      };

      nodes.push(splitConnectorNode);
      // console.log(
      //   "✅ Created single split connector for fake app:",
      //   splitConnectorNode.id
      // );

      // **PROCESS SPLIT BRANCHES FROM THE CONNECTOR**
      processSplitBranches(node, splitConnectorId);
      return;
    }

    // **REGULAR NODE PROCESSING**
    const reactFlowNode: AppNode = {
      id: node._id,
      type: "Node",
      data: {
        type: taskType,
        appType: node.appName as any,
        inputs: node.config || {},
        backendData: {
          _id: node._id,
          workflowId: backendData.workflow._id,
          serviceDescription: node.description || "",
          parentNodeId: node._id,
          appPosition: {
            x: node.position.x,
            y: node.position.y,
          },
          templateKey: node.templateKey,

          integrationId: node.integrationId,
          templateLabel: node?.serviceDescription,
          ifCondition: node.conditionalFields,
          isIntegrated: node.isIntegrated,
          configData: node.config,
          branches: node.branches,
          // Add the Device Flow with start parent boolean
          isDeviceFlowWithStartParent: isDeviceFlowWithStartParent,
          isGSuiteWithStartParent: isGSuiteWithStartParent,
          template: node.appName
            ? {
                name: node.appName,
                image: node.image ?? "",
                description: node.description || "",
                service: node.appName,
              }
            : undefined,
        },
      },
      position: node.position,
    };

    nodes.push(reactFlowNode);
    // console.log(
    //   "✅ Created regular node:",
    //   reactFlowNode.id,
    //   "type:",
    //   taskType,
    //   "isDeviceFlowWithStartParent:",
    //   isDeviceFlowWithStartParent
    // );

    // Handle branches
    if (node.branches && node.branches.length > 0) {
      // Check if this node has a connector position (regular split scenario)
      if (node.connectorPosition && !isFakeSplitApp) {
        const splitNodeId = `${node._id}-split`;
        const splitHandleIds = getHandleIds(TaskType.SPLIT);

        // Create split node
        const splitNode: AppNode = {
          id: splitNodeId,
          type: "Node",
          data: {
            type: TaskType.SPLIT,
            inputs: {},
            splitData: {
              _id: node._id,
            },
            backendData: {
              _id: splitNodeId,
              workflowId: backendData.workflow._id,
              parentNodeId: node._id,
              templateKey: "split",
              branches: [],
              appPosition: {
                x: node.connectorPosition.x,
                y: node.connectorPosition.y,
              },
            },
          },
          position: node.connectorPosition,
        };

        nodes.push(splitNode);

        // Create edge from current node to split node
        const edgeToSplit: EdgeData = {
          id: `${node._id}-to-${splitNodeId}`,
          source: node._id,
          target: splitNodeId,
          sourceHandle: handleIds.output,
          targetHandle: splitHandleIds.input,
          type: EdgeType.NORMAL,
          animated: false,
          data: {
            type: EdgeType.NORMAL,
            sourceHandle: handleIds.output,
            canAddPath: false,
            isTopOrBottom: false,
          },
        };

        edges.push(edgeToSplit);

        // Process split branches
        processSplitBranches(node, splitNodeId);
      } else {
        // Regular branches (direct connections)
        node.branches.forEach((branch) => {
          if (branch.target) {
            // **CHECK IF TARGET IS A FAKE SPLIT APP**
            const targetIsFakeSplitApp =
              branch.target.appName === "Split" &&
              branch.target.connectorPosition;

            if (targetIsFakeSplitApp) {
              // console.log("🔗 Creating edge to fake Split app:", {
              //   from: node._id,
              //   to: branch.target._id,
              //   splitConnectorWillBe: `${branch.target._id}-split`,
              // });

              // Process the fake split app first to ensure it exists
              processNode(branch.target, node);

              // Get the split connector ID for the fake app
              const splitConnectorId = fakeSplitApps.get(branch.target._id);
              if (splitConnectorId) {
                const splitHandleIds = getHandleIds(TaskType.SPLIT);

                // **CREATE EDGE FROM CURRENT NODE TO FAKE SPLIT APP CONNECTOR**
                const edgeToFakeSplit: EdgeData = {
                  id: `${node._id}-to-${splitConnectorId}`,
                  source: node._id,
                  target: splitConnectorId,
                  sourceHandle: handleIds.output,
                  targetHandle: splitHandleIds.input,
                  type: EdgeType.NORMAL,
                  animated: false,
                  data: {
                    type: EdgeType.NORMAL,
                    sourceHandle: handleIds.output,
                    canAddPath: false,
                    isTopOrBottom: false,
                    sourcePosition: node.position,
                    targetPosition: branch.target.connectorPosition,
                    // Store fake app data for deletion
                    fakeAppId: branch.target._id,
                    isFakeSplitApp: true,
                  },
                };

                edges.push(edgeToFakeSplit);
                // console.log(
                //   "✅ Created edge to fake split connector:",
                //   edgeToFakeSplit.id
                // );
              }
            } else {
              // Process the target node
              processNode(branch.target, node);

              const targetTaskType = getTaskTypeFromTemplateKey(
                branch.target.templateKey
              );
              const targetHandleIds = getHandleIds(targetTaskType);

              const edge: EdgeData = {
                id: `${node._id}-to-${branch.target._id}`,
                source: node._id,
                target: branch.target._id,
                sourceHandle: handleIds.output,
                targetHandle: targetHandleIds.input,
                type: EdgeType.NORMAL,
                animated: false,
                data: {
                  type: EdgeType.NORMAL,
                  sourceHandle: handleIds.output,
                  canAddPath: false,
                  isTopOrBottom: false,
                  sourcePosition: node.position,
                  targetPosition: branch.target.position,
                },
              };

              edges.push(edge);
              // console.log("✅ Created regular edge:", edge.id);
            }
          }
        });
      }
    }
  };

  const processSplitBranches = (node: BackendNode, splitNodeId: string) => {
    // console.log(
    //   "🌿 Processing split branches for:",
    //   splitNodeId,
    //   "branches:",
    //   node.branches.length
    // );

    // Group branches by direction for proper handle assignment
    const topBranches = node.branches.filter(
      (b) =>
        b.branchDirection === "Top" ||
        (!b.branchDirection && node.branches.indexOf(b) % 3 === 0)
    );

    const rightBranches = node.branches.filter(
      (b) =>
        b.branchDirection === "Right" ||
        (!b.branchDirection && node.branches.indexOf(b) % 3 === 1)
    );

    const bottomBranches = node.branches.filter(
      (b) =>
        b.branchDirection === "Bottom" ||
        (!b.branchDirection && node.branches.indexOf(b) % 3 === 2)
    );

    // console.log("Branch groups:", {
    //   top: topBranches.length,
    //   right: rightBranches.length,
    //   bottom: bottomBranches.length,
    // });

    // Process branches with proper handle assignment
    const processBranchGroup = (
      branches: BackendBranch[],
      sourceHandle: string
    ) => {
      branches.forEach((branch, index) => {
        // console.log(
        //   `Processing ${sourceHandle} branch:`,
        //   branch.branchId,
        //   branch.label
        // );

        // Create path node
        const pathNodeId = `${splitNodeId}-path-${branch.branchId}`;
        const pathHandleIds = getHandleIds(TaskType.PATH);

        const pathNode: AppNode = {
          id: pathNodeId,
          type: "Node",
          data: {
            type: TaskType.PATH,
            inputs: {},
            branchData: {
              label: branch.label,
              workflowId: backendData.workflow._id,
              parentTemplateKey: node.templateKey,
              parentNodeId: node._id,
              condition: branch.condition,
              ifCondition: node.conditionalFields,
              ...branch,
              next: branch.target?._id || null,
              _id: branch.branchId,
            },
            backendData: {
              _id: pathNodeId,
              workflowId: backendData.workflow._id,
              parentNodeId: node._id,
              templateKey: "path",
              branches: [],
              appPosition: {
                x: branch.branchPosition.x,
                y: branch.branchPosition.y,
              },
            },
          },
          position: branch.branchPosition,
        };

        nodes.push(pathNode);
        // console.log("✅ Created path node:", pathNodeId);

        // Create edge from split to path
        const edgeToPath: EdgeData = {
          id: `${splitNodeId}-to-${pathNodeId}`,
          source: splitNodeId,
          target: pathNodeId,
          sourceHandle: sourceHandle,
          targetHandle: pathHandleIds.input,
          type:
            sourceHandle === "branch-0" || sourceHandle === "branch-2"
              ? EdgeType.SPLIT
              : EdgeType.NORMAL,
          animated: false,
          data: {
            type:
              sourceHandle === "branch-0" || sourceHandle === "branch-2"
                ? EdgeType.SPLIT
                : EdgeType.NORMAL,
            sourceHandle: sourceHandle,
            canAddPath:
              sourceHandle === "branch-0" || sourceHandle === "branch-2",
            isTopOrBottom:
              sourceHandle === "branch-0" || sourceHandle === "branch-2",
            sourcePosition: node.connectorPosition,
            targetPosition: branch.branchPosition,
          },
        };

        edges.push(edgeToPath);
        // console.log("✅ Created edge from split to path:", edgeToPath.id);

        // If branch has a target, process it and create edge from path to target
        if (branch.target) {
          // **CHECK IF TARGET IS A FAKE SPLIT APP**
          const targetIsFakeSplitApp =
            branch.target.appName === "Split" &&
            branch.target.connectorPosition;

          if (targetIsFakeSplitApp) {
            // console.log("🔗 Path connecting to fake Split app:", {
            //   pathId: pathNodeId,
            //   fakeAppId: branch.target._id,
            // });

            // Process the fake split app first
            processNode(branch.target, node);

            // Get the split connector ID for the fake app
            const splitConnectorId = fakeSplitApps.get(branch.target._id);
            if (splitConnectorId) {
              const splitHandleIds = getHandleIds(TaskType.SPLIT);

              // **CREATE EDGE FROM PATH TO FAKE SPLIT APP CONNECTOR**
              const edgeFromPathToFakeSplit: EdgeData = {
                id: `${pathNodeId}-to-${splitConnectorId}`,
                source: pathNodeId,
                target: splitConnectorId,
                sourceHandle: pathHandleIds.output,
                targetHandle: splitHandleIds.input,
                type: EdgeType.NORMAL,
                animated: false,
                data: {
                  type: EdgeType.NORMAL,
                  sourceHandle: pathHandleIds.output,
                  canAddPath: false,
                  isTopOrBottom: false,
                  sourcePosition: branch.branchPosition,
                  targetPosition: branch.target.connectorPosition,
                  // Store fake app data for deletion
                  fakeAppId: branch.target._id,
                  isFakeSplitApp: true,
                },
              };

              edges.push(edgeFromPathToFakeSplit);
              // console.log(
              //   "✅ Created edge from path to fake split connector:",
              //   edgeFromPathToFakeSplit.id
              // );
            }
          } else {
            processNode(branch.target, node);

            const targetTaskType = getTaskTypeFromTemplateKey(
              branch.target.templateKey
            );
            const targetHandleIds = getHandleIds(targetTaskType);

            const edgeFromPath: EdgeData = {
              id: `${pathNodeId}-to-${branch.target._id}`,
              source: pathNodeId,
              target: branch.target._id,
              sourceHandle: pathHandleIds.output,
              targetHandle: targetHandleIds.input,
              type: EdgeType.NORMAL,
              animated: false,
              data: {
                type: EdgeType.NORMAL,
                sourceHandle: pathHandleIds.output,
                canAddPath: false,
                isTopOrBottom: false,
                sourcePosition: branch.branchPosition,
                targetPosition: branch.target.position,
              },
            };

            edges.push(edgeFromPath);
            // console.log(
            //   "✅ Created edge from path to target:",
            //   edgeFromPath.id
            // );
          }
        }
      });
    };

    // Process each group with appropriate handles
    processBranchGroup(topBranches, "branch-0");
    processBranchGroup(rightBranches, "branch-1");
    processBranchGroup(bottomBranches, "branch-2");
  };

  // Start processing from the root node
  // console.log(
  //   "🚀 Starting transformation from root node:",
  //   backendData.tree._id
  // );
  processNode(backendData.tree);

  // console.log("🎯 Transformation complete:");
  // console.log("Total nodes created:", nodes.length);
  // console.log("Total edges created:", edges.length);
  // console.log(
  //   "Device Flow nodes with start parents:",
  //   nodes
  //     .filter((n) => n.data.backendData?.isDeviceFlowWithStartParent)
  //     .map((n) => ({
  //       id: n.id,
  //       appType: n.data.appType,
  //       isDeviceFlowWithStartParent:
  //         n.data.backendData?.isDeviceFlowWithStartParent,
  //     }))
  // );
  // console.log(
  //   "Nodes:",
  //   nodes.map((n) => ({
  //     id: n.id,
  //     type: n.data.type,
  //     isFake: n.data.backendData?.isFakeSplitApp,
  //     fakeAppId: n.data.backendData?.fakeAppId,
  //   }))
  // );
  // console.log(
  //   "Edges:",
  //   edges.map((e) => ({
  //     id: e.id,
  //     source: e.source,
  //     target: e.target,
  //     type: e.type,
  //   }))
  // );

  return { nodes, edges };
};
