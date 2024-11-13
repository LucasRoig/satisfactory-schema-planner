import {
  Background,
  type Edge,
  type Node,
  type OnConnect,
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
import { SchemaUseCases } from "@/use-cases/schema";
import { useDebounce } from "@/utils/use-debounce";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { useFetchSchema } from "../queries/use-fetch-schema";
import { useSchemaDrawerContext } from "../schema-drawer-context";

// const initialNodes = [
//   { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
//   { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
// ];
// const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];

export function Flow() {
  return (
    <ReactFlowProvider>
      <_Flow />
    </ReactFlowProvider>
  );
}

function _Flow() {
  const { focusedSchemaId } = useSchemaDrawerContext();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const updateNodeMutation = useMutation({
    mutationFn: (args: { schemaId: number; nodes: Node[] }) =>
      SchemaUseCases.updateSchemaNodes(args.schemaId, args.nodes),
  });
  const updateEdgeMutation = useMutation({
    mutationFn: (args: { schemaId: number; edges: Edge[] }) =>
      SchemaUseCases.updateSchemaEdges(args.schemaId, args.edges),
  });
  const debouncedUpdateNode = useDebounce(updateNodeMutation.mutate, 5000);
  const debouncedUpdateEdge = useDebounce(updateEdgeMutation.mutate, 5000);

  const _data = useFetchSchema(focusedSchemaId, {
    onSuccess: (data) => {
      if (data === undefined) {
        throw new Error("Schema not found");
      }
      setNodes(data.nodes);
      setEdges(data.edges);
    },
  });
  const { screenToFlowPosition, addNodes, addEdges, updateNodeData: _updateNodeData } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      console.log("onNodesChange", changes);
      setNodes((nds) => {
        const newNodes = applyNodeChanges(changes, nds);
        if (focusedSchemaId !== undefined) {
          debouncedUpdateNode({ schemaId: focusedSchemaId, nodes: newNodes });
        }
        return newNodes;
      });
    },
    [debouncedUpdateNode, focusedSchemaId],
  );

  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) =>
      setEdges((eds) => {
        const newEdges = applyEdgeChanges(changes, eds);
        if (focusedSchemaId !== undefined) {
          debouncedUpdateEdge({ schemaId: focusedSchemaId, edges: newEdges });
        }
        return newEdges;
      }),
    [debouncedUpdateEdge, focusedSchemaId],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      addEdges([{ id: uuid(), source: params.source, target: params.target, animated: true }]);
    },
    [addEdges],
  );

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
      onConnect={onConnect}
    >
      <Background />
    </ReactFlow>
  );
}
