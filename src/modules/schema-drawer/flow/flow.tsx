import {
  Background,
  type Edge,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  type XYPosition,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import { type MouseEventHandler, type ReactElement, createContext, useCallback, useRef, useState } from "react";
import "@xyflow/react/dist/style.css";
import { SchemaUseCases } from "@/use-cases/schema";
import { useDebounce } from "@/utils/use-debounce";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { type NodeType, nodeFactory } from "../nodes/nodes-types";
import { SourceNode } from "../nodes/source-node";
import { SplitterNode } from "../nodes/splitter-node";
import { ConfigPanel } from "../panels/config-panel";
import { useFetchSchema } from "../queries/use-fetch-schema";
import { useSchemaDrawerContext } from "../schema-drawer-context";
import { NodeCommandPicker } from "./node-command-picker";

// const initialNodes = [
//   { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
//   { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
// ];
// const initialEdges = [{ id: "e1-2", source: "1", target: "2", animated: true }];

const nodeTypes = {
  source: SourceNode,
  splitter: SplitterNode,
};

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
    meta: {
      invalidates: "none",
    },
  });
  const updateEdgeMutation = useMutation({
    mutationFn: (args: { schemaId: number; edges: Edge[] }) =>
      SchemaUseCases.updateSchemaEdges(args.schemaId, args.edges),
    meta: {
      invalidates: "none",
    },
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
  const { addEdges, updateNodeData: _updateNodeData } = useReactFlow();

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
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

  return (
    <DoubleClickHandlerContextProvider>
      <doubleClickHandlerContext.Consumer>
        {(ctx) => (
          <>
            <ReactFlow
              zoomOnDoubleClick={false}
              onDoubleClick={ctx?.handleDoubleClick}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
            >
              <ConfigPanel nodes={nodes} />
              <Background />
            </ReactFlow>
          </>
        )}
      </doubleClickHandlerContext.Consumer>
    </DoubleClickHandlerContextProvider>
  );
}

const doubleClickHandlerContext = createContext<{ handleDoubleClick: MouseEventHandler } | undefined>(undefined);

const DoubleClickHandlerContextProvider = ({ children }: { children: ReactElement }) => {
  const lastDoubleClickPosition = useRef<XYPosition>();
  const { addNodes, screenToFlowPosition } = useReactFlow();

  const [isNodePickerOpen, setIsNodePickerOpen] = useState(false);
  const insertNode = useCallback(
    (type: NodeType) => {
      if (lastDoubleClickPosition.current === undefined) {
        return;
      }
      addNodes([nodeFactory(type, lastDoubleClickPosition.current)]);
    },
    [addNodes],
  );
  const handleDoubleClick: MouseEventHandler = useCallback(
    (e) => {
      const { x, y } = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      lastDoubleClickPosition.current = { x, y };
      setIsNodePickerOpen(true);
    },
    [screenToFlowPosition],
  );
  return (
    <doubleClickHandlerContext.Provider value={{ handleDoubleClick }}>
      <NodeCommandPicker isOpen={isNodePickerOpen} setIsOpen={setIsNodePickerOpen} onSelect={insertNode} />

      {children}
    </doubleClickHandlerContext.Provider>
  );
};
