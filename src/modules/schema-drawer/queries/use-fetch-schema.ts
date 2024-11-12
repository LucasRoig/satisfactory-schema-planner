import { SchemaUseCases } from "@/use-cases/schema";
import { useQuery } from "@tanstack/react-query";

type FetchSchemaResults = Awaited<ReturnType<typeof SchemaUseCases.fetchSchemaById>>;

export const useFetchSchema = (
  schemaId: number | undefined,
  opts: {
    onSuccess?: (data: FetchSchemaResults) => void | Promise<void>;
  } = {},
) =>
  useQuery({
    enabled: schemaId !== undefined,
    queryKey: ["schema", schemaId],
    queryFn: async () => {
      const schema = await SchemaUseCases.fetchSchemaById(schemaId!);
      if (opts.onSuccess) {
        await opts.onSuccess(schema);
      }
      return schema;
    },
  });
