import { type Edge, type Node, Panel } from "@xyflow/react";
import type { ReactNode } from "react";
import type { FlowInfoMap } from "../flow-calc/flow-calc";
import { isBuildingNode, isSourceNode } from "../nodes/nodes-types";
import { BuildingConfigPanel } from "./building-config-panel";
import { EdgePanel } from "./edge-panel";
import { SourceConfigPanel } from "./source-config-panel";

export function ConfigPanel(props: { nodes: Node[]; edges: Edge[]; flowInfoMap: FlowInfoMap }) {
  const selectedNodes = props.nodes.filter((n) => n.selected);
  const selectedEdges = props.edges.filter((e) => e.selected);

  let component: ReactNode = null;
  if (selectedNodes.length === 1) {
    const selectedNode = selectedNodes[0];
    if (isSourceNode(selectedNode)) {
      component = <SourceConfigPanel node={selectedNode} />;
    }
    if (isBuildingNode(selectedNode)) {
      component = <BuildingConfigPanel node={selectedNode} />;
    }
  } else if (selectedEdges.length === 1) {
    const selectedEdge = selectedEdges[0];
    component = <EdgePanel edge={selectedEdge} flowInfoMap={props.flowInfoMap} />;
  }
  if (component === null) {
    return null;
  }
  return (
    <Panel
      position="top-left"
      className="z-20 bg-card p-4 border rounded shadow-sm min-w-48"
      style={{
        top: "2.5rem",
        bottom: "2.5rem",
      }}
    >
      {component}
    </Panel>
  );
}
