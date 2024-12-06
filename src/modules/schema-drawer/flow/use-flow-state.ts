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
  useStore,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import { flushSync } from "react-dom";
import { v4 as uuid } from "uuid";
import { FlowCalc } from "../flow-calc/flow-calc";
import { useFlowCalcContext } from "../flow-calc/flow-calc-context";
import type { FetchSchemaResults } from "../queries/use-fetch-schema";
import { useSchemaDrawerContext } from "../schema-drawer-context";

export function useFlowState() {
  const addSelectedNodes = useStore(store => store.addSelectedNodes);
  const unselectNodesAndEdges = useStore(store => store.unselectNodesAndEdges);

  const { focusedSchemaId } = useSchemaDrawerContext();
  const { recipes } = useProfileContext();
  const { flowInfoMap, setFlowInfoMap } = useFlowCalcContext();
  const { getNodes, getEdges, addNodes: _addNodes, deleteElements, addEdges: _addEdges } = useReactFlow();

  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const setSelectedNodes = useCallback((localNodes: Node[]) => {
    const selectedNodes = nodes.filter(n => n.selected);
    const selectedEdges = edges.filter(e => e.selected);
    flushSync(() => {
      unselectNodesAndEdges({
        nodes: selectedNodes,
        edges: selectedEdges,
      });
    });
    addSelectedNodes(localNodes.map(n => n.id));
  }, [addSelectedNodes, unselectNodesAndEdges, edges, nodes]);

  const updateFlowCalc = useCallback(() => {
    const flowCompute = new FlowCalc(getNodes(), getEdges(), recipes);
    setFlowInfoMap(flowCompute.computeFlowInfo());
  }, [getNodes, getEdges, recipes, setFlowInfoMap]);

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
      updateFlowCalc();
    },
    [_addNodes, updateFlowCalc],
  );

  const addEdges = useCallback(
    (payload: Edge | Edge[]) => {
      flushSync(() => {
        _addEdges(payload);
      });
      updateFlowCalc();
    },
    [_addEdges, updateFlowCalc],
  );

  const onDelete: OnDelete = useCallback(
    (props) => {
      flushSync(() => {
        deleteElements(props);
      });
      updateFlowCalc();
    },
    [deleteElements, updateFlowCalc],
  );

  const onConnect: OnConnect = useCallback(
    (params) => {
        addEdges([{ ...params, id: uuid(), animated: true, type: "edgeWithFlow" }]);
    },
    [addEdges],
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
    updateFlowCalc,
    setSelectedNodes,
    addEdges,
  };
}
