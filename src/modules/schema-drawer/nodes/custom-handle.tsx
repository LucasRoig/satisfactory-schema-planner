import { Handle, useHandleConnections } from "@xyflow/react";
import type { CSSProperties, ComponentProps } from "react";

export function CustomHandle(props: ComponentProps<typeof Handle>) {
  const connections = useHandleConnections({
    id: props.id,
    type: props.type,
  });

  let style: CSSProperties =
    props.type === "target"
      ? {
          backgroundColor: "transparent",
          border: "1px solid black",
        }
      : {};
  style = {
    ...style,
    ...props.style,
  };

  return <Handle {...props} style={style} isConnectable={connections.length === 0} />;
}
