// biome-ignore lint/correctness/noUnusedImports: <explanation>
import type { Register } from "@tanstack/react-query";
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidates?: "none" | "all";
    };
  }
}
