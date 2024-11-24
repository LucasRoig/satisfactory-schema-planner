import type { FetchRecipesResults } from "@/modules/settings/queries/use-recipes-for-profile";
import type { Edge, Node } from "@xyflow/react";
import { isBuildingNode, isMergerNode, isSourceNode } from "../nodes/nodes-types";

type EdgeFlowInfo = {
  kind: "edgeFlow";
  hasError: boolean;
  hasWarning: boolean;
  message: string | undefined;
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
    const target = this.nodes.find((node) => node.id === edge.target);
    if (source === undefined) {
      flowInfo = { kind: "noInfo" };
    } else if (isSourceNode(source)) {
      if (source.data.itemId === undefined) {
        flowInfo = { kind: "noInfo" };
      } else {
        flowInfo = {
          kind: "edgeFlow",
          hasError: false,
          hasWarning: false,
          message: undefined,
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
          hasError: false,
          hasWarning: false,
          message: undefined,
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
          hasError: false,
          hasWarning: false,
          message: undefined,
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
    if (target === undefined) {
      // nothing to do
    } else if (isBuildingNode(target) && target.data.recipeId !== undefined) {
      const recipe = this.recipesMap.get(target.data.recipeId);
      if (recipe === undefined) {
        throw new Error(`Recipe ${target.data.recipeId} not found`);
      }
      const handleId = edge.targetHandle;
      const match = handleId?.match(/[A-Za-z0-9\-]+-input(\d+)/);
      if (match === null || match === undefined) {
        throw new Error(`Invalid handle id: ${handleId}`);
      }
      const outputIndex = Number.parseInt(match[1]);
      const item = recipe.inputs[outputIndex];
      if (item === undefined) {
        throw new Error(`Item ${outputIndex} not found in recipe ${target.data.recipeId}`);
      }
      if (flowInfo.kind !== "edgeFlow") {
        throw new Error("Edge has a building target but no input");
      }
      flowInfo = {
        hasError: false,
        hasWarning: false,
        message: undefined,
        kind: "edgeFlow",
        input: flowInfo.input,
        output: {
          quantity: item.quantity,
          itemId: item.itemId,
        },
      };
    }
    if (flowInfo.kind === "edgeFlow") {
      if (flowInfo.output.itemId !== flowInfo.input.itemId) {
        flowInfo.hasError = true;
        flowInfo.message = "Input and output items are different";
      } else if (flowInfo.input.quantity < flowInfo.output.quantity) {
        flowInfo.hasWarning = true;
        flowInfo.message = "Input quantity is less than output quantity";
      } else if (flowInfo.input.quantity > flowInfo.output.quantity) {
        flowInfo.hasWarning = true;
        flowInfo.message = "Input quantity is greater than output quantity";
      }
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
