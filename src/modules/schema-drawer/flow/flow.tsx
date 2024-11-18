import {
  Background,
  type Edge,
  type IsValidConnection,
  type Node,
  type OnConnect,
  type OnEdgesChange,
  type OnNodesChange,
  ReactFlow,
  ReactFlowProvider,
  type XYPosition,
  applyEdgeChanges,
  applyNodeChanges,
  getOutgoers,
  useReactFlow,
} from "@xyflow/react";
import { type MouseEventHandler, type ReactElement, createContext, useCallback, useRef, useState } from "react";
import "@xyflow/react/dist/style.css";
import { SchemaUseCases } from "@/use-cases/schema";
import { useDebounce } from "@/utils/use-debounce";
import { useMutation } from "@tanstack/react-query";
import { v4 as uuid } from "uuid";
import { EdgeWithFlow } from "../edges/edge-with-flow";
import { computeFlowInfo } from "../flow-calc/flow-calc";
import { FlowCalcContextProvider, useFlowCalcContext } from "../flow-calc/flow-calc-context";
import { BuildingNode } from "../nodes/building-node";
import { MergerNode } from "../nodes/merger-node";
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
  merger: MergerNode,
  building: BuildingNode,
};

const edgeTypes = {
  edgeWithFlow: EdgeWithFlow,
};

export function Flow() {
  return (
    <ReactFlowProvider>
      <FlowCalcContextProvider>
        <_Flow />
      </FlowCalcContextProvider>
    </ReactFlowProvider>
  );
}

function _Flow() {
  const { focusedSchemaId } = useSchemaDrawerContext();
  const { getNodes, getEdges, addNodes: _addNodes } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { flowInfoMap, setFlowInfoMap } = useFlowCalcContext();
  const isValidConnection: IsValidConnection = useCallback(
    (connection) => {
      // we are using getNodes and getEdges helpers here
      // to make sure we create isValidConnection function only once
      const nodes = getNodes();
      const edges = getEdges();
      const target = nodes.find((node) => node.id === connection.target);
      if (!target) {
        return false;
      }

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      if (target.id === connection.source) return false;
      return !hasCycle(target);
    },
    [getNodes, getEdges],
  );

  const updateNodeMutation = useMutation({
    mutationFn: (args: { schemaId: number; nodes: Node[] }) =>
      SchemaUseCases.updateSchemaNodes(args.schemaId, args.nodes),
    onSuccess: () => {
      console.info("saved nodes");
    },
    meta: {
      invalidates: "none",
    },
  });

  const updateEdgeMutation = useMutation({
    mutationFn: (args: { schemaId: number; edges: Edge[] }) =>
      SchemaUseCases.updateSchemaEdges(args.schemaId, args.edges),
    onSuccess: () => {
      console.info("saved edges");
    },
    meta: {
      invalidates: "none",
    },
  });
  const debouncedUpdateNode = useDebounce(updateNodeMutation.mutate, 5000);
  const debouncedUpdateEdge = useDebounce(updateEdgeMutation.mutate, 5000);

  const { data: _data } = useFetchSchema(focusedSchemaId, {
    onSuccess: (data) => {
      if (data === undefined) {
        throw new Error("Schema not found");
      }
      setNodes(data.nodes);
      setEdges(data.edges);
      setFlowInfoMap(computeFlowInfo(data.nodes, data.edges));
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

  const addNodes = useCallback(
    (payload: Node | Node[]) => {
      _addNodes(payload);
      setFlowInfoMap(computeFlowInfo(getNodes(), getEdges()));
    },
    [_addNodes, getNodes, getEdges, setFlowInfoMap],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      addEdges([{ ...params, id: uuid(), animated: true, type: "edgeWithFlow" }]);
      setFlowInfoMap(computeFlowInfo(getNodes(), getEdges()));
    },
    [addEdges, getNodes, getEdges, setFlowInfoMap],
  );

  return (
    <DoubleClickHandlerContextProvider addNodes={addNodes}>
      <doubleClickHandlerContext.Consumer>
        {(ctx) => (
          <>
            <ReactFlow
              deleteKeyCode="Delete"
              isValidConnection={isValidConnection}
              zoomOnDoubleClick={false}
              onDoubleClick={ctx?.handleDoubleClick}
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
            >
              <ConfigPanel nodes={nodes} edges={edges} flowInfoMap={flowInfoMap} />
              <Background />
            </ReactFlow>
          </>
        )}
      </doubleClickHandlerContext.Consumer>
    </DoubleClickHandlerContextProvider>
  );
}

const doubleClickHandlerContext = createContext<{ handleDoubleClick: MouseEventHandler } | undefined>(undefined);

const DoubleClickHandlerContextProvider = ({
  children,
  addNodes,
}: { children: ReactElement; addNodes: (payload: Node | Node[]) => void }) => {
  const lastDoubleClickPosition = useRef<XYPosition>();
  const { screenToFlowPosition } = useReactFlow();

  const [isNodePickerOpen, setIsNodePickerOpen] = useState(false);
  const insertNode = useCallback(
    (type: NodeType, args?: { buildingId?: number }) => {
      if (lastDoubleClickPosition.current === undefined) {
        return;
      }
      addNodes([nodeFactory(type, lastDoubleClickPosition.current, args)]);
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
