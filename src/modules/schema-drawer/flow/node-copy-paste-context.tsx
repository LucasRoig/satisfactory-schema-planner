import React, { useContext, useRef } from "react";
import type { Edge, Node, XYPosition } from "@xyflow/react";
import { v4 as uuidv4 } from "uuid";
import { cloneDeep } from "lodash-es";

type NodeCopyPasteContextType = {
  copyNodes: (nodes: Node[], egdes: Edge[]) => void;
  pasteNodes: (position: XYPosition) => { newNodes: Node[], newEdges: Edge[] };
}

export type NodeCopyPasteContextProviderProps = {
  children: React.ReactNode;
};

const NodeCopyPasteContext = React.createContext<NodeCopyPasteContextType | undefined>(undefined);

function makeCopy(nodes: Node[], edges: Edge[]) {
  const newEdges = edges.map((edge) => {
    const newEdge = cloneDeep(edge);
    newEdge.id = uuidv4();
    return newEdge;
  });
  const newNodes: Node[] = [];
  for (const node of nodes) {
    const newNode = cloneDeep(node);
    newNode.id = uuidv4();
    for (const edge of newEdges) {
      if (edge.source === node.id) {
        edge.source = newNode.id;
      }
      if (edge.target === node.id) {
        edge.target = newNode.id;
      }
    }
    newNodes.push(newNode);
  }
  return {newNodes, newEdges};
}

export const NodeCopyPasteContextProvider: React.FC<NodeCopyPasteContextProviderProps> = (props) => {
  const copiedNodes = useRef<Node[]>([]);
  const copiedEdges = useRef<Edge[]>([]);

  const copyNodes = (nodes: Node[], edges: Edge[]) => {
    copiedNodes.current = nodes;
    const edgesInSelection: Edge[] = [];
    for (const edge of edges) {
      if (nodes.some(n => n.id === edge.source) && nodes.some(n => n.id === edge.target)) {
        edgesInSelection.push(edge);
      }
    }
    copiedEdges.current = edgesInSelection;
  };

  const pasteNodes = (position: XYPosition) => {
    if (copiedNodes.current.length === 0) {
      return {newNodes: [], newEdges: []};
    }
    const {newNodes, newEdges} = makeCopy(copiedNodes.current, copiedEdges.current);
    const initialFirstNodePosition = newNodes[0].position;

    const nodesWithUpdatedPosition = newNodes.map((node) => ({
      ...node,
      position: {
        x: node.position.x - initialFirstNodePosition.x + position.x,
        y: node.position.y - initialFirstNodePosition.y + position.y,
      }
    }));

    return {newNodes: nodesWithUpdatedPosition, newEdges};
  }

  const value: NodeCopyPasteContextType = {
    copyNodes,
    pasteNodes,
  };

  return (
    <NodeCopyPasteContext.Provider value={value}>
      {props.children}
    </NodeCopyPasteContext.Provider>
  );
};

export const useNodeCopyPasteContext = () => {
  const context = useContext(NodeCopyPasteContext);
  if (context === undefined) {
    throw new Error("useNodeCopyPasteContext must be used within a NodeCopyPasteContextProvider");
  }
  return context;
};
