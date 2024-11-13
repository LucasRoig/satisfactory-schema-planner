import { type Node, Panel } from "@xyflow/react";
import type { ReactNode } from "react";
import { isSourceNode } from "../nodes/nodes-types";
import { SourceConfigPanel } from "./source-config-panel";

export function ConfigPanel(props: { nodes: Node[] }) {
  const selectedNode = props.nodes.find((n) => n.selected);
  if (selectedNode === undefined) {
    return null;
  }
  let component: ReactNode = null;
  if (isSourceNode(selectedNode)) {
    component = <SourceConfigPanel node={selectedNode} />;
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
