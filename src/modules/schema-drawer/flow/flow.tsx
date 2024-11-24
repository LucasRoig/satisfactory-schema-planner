import {
  Background,
  type IsValidConnection,
  type Node,
  ReactFlow,
  ReactFlowProvider,
  type XYPosition,
  getOutgoers,
  useReactFlow,
} from "@xyflow/react";
import { type MouseEventHandler, type ReactElement, createContext, useCallback, useRef, useState } from "react";
import "@xyflow/react/dist/style.css";
import { EdgeWithFlow } from "../edges/edge-with-flow";
import { FlowCalcContextProvider } from "../flow-calc/flow-calc-context";
import { BuildingNode } from "../nodes/building-node";
import { MergerNode } from "../nodes/merger-node";
import { type NodeType, nodeFactory } from "../nodes/nodes-types";
import { SourceNode } from "../nodes/source-node";
import { SplitterNode } from "../nodes/splitter-node";
import { ConfigPanel } from "../panels/config-panel";
import { useFetchSchema } from "../queries/use-fetch-schema";
import { useSchemaDrawerContext } from "../schema-drawer-context";
import { NodeCommandPicker } from "./node-command-picker";
import { useFlowState } from "./use-flow-state";

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
  const { getNodes, getEdges } = useReactFlow();

  const {
    nodes,
    edges,
    flowInfoMap,
    setSchema,
    onNodesChange,
    onEdgesChange,
    addNodes,
    onConnect,
    onDelete,
    updateFlowCalc,
  } = useFlowState();

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

  const { data: _data } = useFetchSchema(focusedSchemaId, {
    onSuccess: setSchema,
  });

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
              onDelete={onDelete}
              nodeTypes={nodeTypes}
              edgeTypes={edgeTypes}
            >
              <ConfigPanel nodes={nodes} edges={edges} flowInfoMap={flowInfoMap} updateFlowCalc={updateFlowCalc} />
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
