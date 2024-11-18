import type { FetchRecipesResults } from "@/modules/settings/queries/use-recipes-for-profile";
import type { Edge, Node } from "@xyflow/react";
import { isBuildingNode, isMergerNode, isSourceNode } from "../nodes/nodes-types";

type EdgeFlowInfo = {
  kind: "edgeFlow";
  input: {
    quantity: number;
    itemId: number;
  };
  output: {
    quantity: number;
    itemId: number;
  };
};

type MergerFlowInfo = {
  kind: "mergerFlow";
  inputs: {
    input0:
      | {
          quantity: number;
          itemId: number;
        }
      | undefined;
    input1:
      | {
          quantity: number;
          itemId: number;
        }
      | undefined;
    input2:
      | {
          quantity: number;
          itemId: number;
        }
      | undefined;
  };
  output:
    | {
        quantity: number;
        itemId: number;
      }
    | undefined;
};

type SplitterFlowInfo = {
  kind: "splitterFlow";
  input:
    | {
        quantity: number;
        itemId: number;
      }
    | undefined;
  outputs: {
    output0:
      | {
          quantity: number;
          itemId: number;
        }
      | undefined;
    output1:
      | {
          quantity: number;
          itemId: number;
        }
      | undefined;
    output2:
      | {
          quantity: number;
          itemId: number;
        }
      | undefined;
  };
};

type NoInfo = {
  kind: "noInfo";
};

type FlowInfo = EdgeFlowInfo | MergerFlowInfo | SplitterFlowInfo | NoInfo;

export type FlowInfoMap = Map<string, FlowInfo>;

export class FlowCalc {
  private flowInfoMap = new Map<string, FlowInfo>();
  constructor(
    private nodes: Node[],
    private edges: Edge[],
    private recipesMap: Map<number, FetchRecipesResults[number]>,
  ) {}

  private computeEdgeInfo(edge: Edge): FlowInfo {
    const alreadyComputed = this.flowInfoMap.get(edge.id);
    if (alreadyComputed !== undefined) {
      return alreadyComputed;
    }
    let flowInfo: NoInfo | EdgeFlowInfo = { kind: "noInfo" };
    const source = this.nodes.find((node) => node.id === edge.source);
    if (source === undefined) {
      flowInfo = { kind: "noInfo" };
    } else if (isSourceNode(source)) {
      if (source.data.itemId === undefined) {
        flowInfo = { kind: "noInfo" };
      } else {
        flowInfo = {
          kind: "edgeFlow",
          input: {
            quantity: source.data.quantity,
            itemId: source.data.itemId,
          },
          output: {
            quantity: source.data.quantity,
            itemId: source.data.itemId,
          },
        };
      }
    } else if (isMergerNode(source)) {
      const mergerFlowInfo = this.computeNodeInfo(source);
      if (mergerFlowInfo.kind === "mergerFlow" && mergerFlowInfo.output !== undefined) {
        flowInfo = {
          kind: "edgeFlow",
          input: {
            quantity: mergerFlowInfo.output.quantity,
            itemId: mergerFlowInfo.output.itemId,
          },
          output: {
            quantity: mergerFlowInfo.output.quantity,
            itemId: mergerFlowInfo.output.itemId,
          },
        };
      } else {
        flowInfo = { kind: "noInfo" };
      }
    } else if (isBuildingNode(source)) {
      if (source.data.recipeId === undefined) {
        flowInfo = { kind: "noInfo" };
      } else {
        const recipe = this.recipesMap.get(source.data.recipeId);
        if (recipe === undefined) {
          throw new Error(`Recipe ${source.data.recipeId} not found`);
        }
        const handleId = edge.sourceHandle;
        const match = handleId?.match(/[A-Za-z0-9\-]+-output(\d+)/);
        if (match === null || match === undefined) {
          throw new Error(`Invalid handle id: ${handleId}`);
        }
        const inputIndex = Number.parseInt(match[1]);
        const item = recipe.outputs[inputIndex];
        if (item === undefined) {
          throw new Error(`Item ${inputIndex} not found in recipe ${source.data.recipeId}`);
        }
        flowInfo = {
          kind: "edgeFlow",
          input: {
            quantity: item.quantity,
            itemId: item.itemId,
          },
          output: {
            quantity: item.quantity,
            itemId: item.itemId,
          },
        };
      }
    } else {
      flowInfo = { kind: "noInfo" };
    }
    this.flowInfoMap.set(edge.id, flowInfo);
    return flowInfo;
  }

  public computeNodeInfo(node: Node): FlowInfo {
    const alreadyComputed = this.flowInfoMap.get(node.id);
    if (alreadyComputed !== undefined) {
      return alreadyComputed;
    }
    let flowInfo: NoInfo | MergerFlowInfo | SplitterFlowInfo = { kind: "noInfo" };
    if (isMergerNode(node)) {
      const inputsEdges = this.edges
        .filter((e) => e.target === node.id)
        .map((e) => this.computeEdgeInfo(e))
        .filter((e) => e !== undefined);
      flowInfo = {
        kind: "mergerFlow",
        inputs: {
          input0: inputsEdges[0]?.kind === "edgeFlow" ? inputsEdges[0].input : undefined,
          input1: inputsEdges[1]?.kind === "edgeFlow" ? inputsEdges[1].input : undefined,
          input2: inputsEdges[2]?.kind === "edgeFlow" ? inputsEdges[2].input : undefined,
        },
        output: undefined,
      };
      const definedInputs = [flowInfo.inputs.input0, flowInfo.inputs.input1, flowInfo.inputs.input2].filter(
        (e) => e !== undefined,
      );
      if (definedInputs.length > 0) {
        flowInfo.output = {
          quantity: definedInputs.reduce((acc, cur) => acc + cur.quantity, 0),
          itemId: definedInputs[0].itemId,
        };
      }
    } else {
      flowInfo = { kind: "noInfo" };
    }
    this.flowInfoMap.set(node.id, flowInfo);
    return flowInfo;
  }

  public computeFlowInfo() {
    for (const edge of this.edges) {
      this.computeEdgeInfo(edge);
    }
    for (const node of this.nodes) {
      this.computeNodeInfo(node);
    }
    return this.flowInfoMap;
  }
}

// export function computeFlowInfo(nodes: Node[], edges: Edge[]): FlowInfoMap {
//   const flowInfoMap = new Map<string, FlowInfo>();
//   for (const edge of edges) {
//     const source = nodes.find((node) => node.id === edge.source);
//     if (source === undefined) {
//       flowInfoMap.set(edge.id, { kind: "noInfo" });
//     } else if (isSourceNode(source)) {
//       if (source.data.itemId === undefined) {
//         flowInfoMap.set(edge.id, { kind: "noInfo" });
//       } else {
//         flowInfoMap.set(edge.id, {
//           kind: "edgeFlow",
//           input: {
//             quantity: source.data.quantity,
//             itemId: source.data.itemId,
//           },
//           output: {
//             quantity: source.data.quantity,
//             itemId: source.data.itemId,
//           },
//         });
//       }
//     } else {
//       flowInfoMap.set(edge.id, { kind: "noInfo" });
//     }
//   }
//   for (const node of nodes) {
//     if (isMergerNode(node)) {
//       const inputsEdges = edges.filter((e) => e.target === node.id).map(e => flowInfoMap.get(e.id)).filter(e => e !== undefined);
//       const flowInfo: MergerFlowInfo = {
//         kind: "mergerFlow",
//         inputs: {
//           input0: inputsEdges[0]?.kind === "edgeFlow" ? inputsEdges[0].input : undefined,
//           input1: inputsEdges[1]?.kind === "edgeFlow" ? inputsEdges[1].input : undefined,
//           input2: inputsEdges[2]?.kind === "edgeFlow" ? inputsEdges[2].input : undefined,
//         },
//         output: undefined,
//       }
//       const definedInputs = [flowInfo.inputs.input0, flowInfo.inputs.input1, flowInfo.inputs.input2].filter(e => e !== undefined);
//       if (definedInputs.length > 0) {
//         flowInfo.output = {
//           quantity: definedInputs.reduce((acc, cur) => acc + cur.quantity, 0),
//           itemId: definedInputs[0].itemId,
//         }
//       }
//       flowInfoMap.set(node.id, flowInfo);
//     } else {
//       flowInfoMap.set(node.id, { kind: "noInfo" });
//     }
//   }
//   return flowInfoMap;
// }
