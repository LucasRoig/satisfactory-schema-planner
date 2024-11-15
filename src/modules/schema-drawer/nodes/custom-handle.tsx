import { Handle } from "@xyflow/react";
import type { CSSProperties, ComponentProps } from "react";

export function CustomHandle(props: ComponentProps<typeof Handle>) {
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

  return <Handle {...props} style={style} />;
}
