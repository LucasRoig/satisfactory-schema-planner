import { useProfileContext } from "@/modules/profile/profile-context";
import { SchemaUseCases } from "@/use-cases/schema";
import { useDebounce } from "@/utils/use-debounce";
import { useMutation } from "@tanstack/react-query";
import {
  type Edge,
  type Node,
  type OnConnect,
  type OnDelete,
  type OnEdgesChange,
  type OnNodesChange,
  applyEdgeChanges,
  applyNodeChanges,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { v4 as uuid } from "uuid";
import { FlowCalc } from "../flow-calc/flow-calc";
import { useFlowCalcContext } from "../flow-calc/flow-calc-context";
import type { FetchSchemaResults } from "../queries/use-fetch-schema";
import { useSchemaDrawerContext } from "../schema-drawer-context";

export function useFlowState() {
  const { focusedSchemaId } = useSchemaDrawerContext();
  const { recipes } = useProfileContext();
  const { flowInfoMap, setFlowInfoMap } = useFlowCalcContext();
  const { getNodes, getEdges, addNodes: _addNodes, deleteElements, addEdges } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

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
  const debouncedUpdateNode = useDebounce(updateNodeMutation.mutate, 5000);

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
  const debouncedUpdateEdge = useDebounce(updateEdgeMutation.mutate, 5000);

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
      flushSync(() => {
        _addNodes(payload);
      });
      const flowCompute = new FlowCalc(getNodes(), getEdges(), recipes);
      setFlowInfoMap(flowCompute.computeFlowInfo());
    },
    [_addNodes, getNodes, getEdges, setFlowInfoMap, recipes],
  );

  const onDelete: OnDelete = useCallback(
    (props) => {
      flushSync(() => {
        deleteElements(props);
      });
      const flowCompute = new FlowCalc(getNodes(), getEdges(), recipes);
      setFlowInfoMap(flowCompute.computeFlowInfo());
    },
    [deleteElements, setFlowInfoMap, getEdges, getNodes, recipes],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
      flushSync(() => {
        addEdges([{ ...params, id: uuid(), animated: true, type: "edgeWithFlow" }]);
      });
      const flowCompute = new FlowCalc(getNodes(), getEdges(), recipes);
      setFlowInfoMap(flowCompute.computeFlowInfo());
    },
    [addEdges, getNodes, getEdges, setFlowInfoMap, recipes],
  );

  return {
    nodes,
    edges,
    flowInfoMap,
    setSchema: (data: FetchSchemaResults) => {
      if (data === undefined) {
        throw new Error("Schema not found");
      }
      setNodes(data.nodes);
      setEdges(data.edges);
      const flowCompute = new FlowCalc(data.nodes, data.edges, recipes);
      setFlowInfoMap(flowCompute.computeFlowInfo());
    },
    onNodesChange,
    onEdgesChange,
    addNodes,
    onDelete,
    onConnect,
  };
}
