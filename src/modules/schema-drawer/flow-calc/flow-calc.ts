import type { Edge, Node } from "@xyflow/react";
import { isSourceNode } from "../nodes/nodes-types";

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

export function computeFlowInfo(nodes: Node[], edges: Edge[]): FlowInfoMap {
  const flowInfoMap = new Map<string, FlowInfo>();
  for (const edge of edges) {
    const source = nodes.find((node) => node.id === edge.source);
    if (source === undefined) {
      flowInfoMap.set(edge.id, { kind: "noInfo" });
    } else if (isSourceNode(source)) {
      if (source.data.itemId === undefined) {
        flowInfoMap.set(edge.id, { kind: "noInfo" });
      } else {
        flowInfoMap.set(edge.id, {
          kind: "edgeFlow",
          input: {
            quantity: source.data.quantity,
            itemId: source.data.itemId,
          },
          output: {
            quantity: source.data.quantity,
            itemId: source.data.itemId,
          },
        });
      }
    } else {
      flowInfoMap.set(edge.id, { kind: "noInfo" });
    }
  }
  return flowInfoMap;
}
