import {
  Background,
  type Edge,
  type Node,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import { type MouseEventHandler, useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";
import { v4 as uuid } from "uuid";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];

export function Flow() {
  return (
    <ReactFlowProvider>
      <_Flow />
    </ReactFlowProvider>
  );
}

function _Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);
  const { screenToFlowPosition, addNodes, updateNodeData: _updateNodeData } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback((changes) => setNodes((nds) => applyNodeChanges(changes, nds)), []);
  const onEdgesChange: OnEdgesChange = useCallback((changes) => setEdges((eds) => applyEdgeChanges(changes, eds)), []);

  const handleDoubleClick: MouseEventHandler = useCallback(
    (e) => {
      const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      addNodes([{ id: uuid(), position: { x, y }, data: { label: "New Node" } }]);
    },
    [screenToFlowPosition, addNodes],
  );

  return (
    <ReactFlow
      zoomOnDoubleClick={false}
      onDoubleClick={handleDoubleClick}
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
    >
      <Background />
    </ReactFlow>
  );
}
