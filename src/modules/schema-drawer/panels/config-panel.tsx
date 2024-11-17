import { type Node, Panel } from "@xyflow/react";
import type { ReactNode } from "react";
import { isBuildingNode, isSourceNode } from "../nodes/nodes-types";
import { BuildingConfigPanel } from "./building-config-panel";
import { SourceConfigPanel } from "./source-config-panel";

export function ConfigPanel(props: { nodes: Node[] }) {
  const selectedNodes = props.nodes.filter((n) => n.selected);
  if (selectedNodes.length !== 1) {
    return null;
  }
  const selectedNode = selectedNodes[0];
  let component: ReactNode = null;
  if (isSourceNode(selectedNode)) {
    component = <SourceConfigPanel node={selectedNode} />;
  }
  if (isBuildingNode(selectedNode)) {
    component = <BuildingConfigPanel node={selectedNode} />;
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
