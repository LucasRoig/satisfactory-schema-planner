import { type Node, Panel } from "@xyflow/react";

export function ConfigPanel(props: { nodes: Node[] }) {
  const selectedNode = props.nodes.find((n) => n.selected);
  if (selectedNode === undefined) {
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
      Test Panel
    </Panel>
  );
}
