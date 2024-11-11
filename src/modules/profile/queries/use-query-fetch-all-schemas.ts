import { SchemaUseCases } from "@/use-cases/schema";
import { useQuery } from "@tanstack/react-query";

export type FetchSchemasResults = Awaited<ReturnType<typeof SchemaUseCases.fetchProfileSchema>>;

export const useQueryFetchAllSchemas = (profileId: number | undefined) =>
  useQuery({
    queryKey: ["schemas", profileId],
    enabled: profileId !== undefined,
    queryFn: async () => {
      const schemas = await SchemaUseCases.fetchProfileSchema(profileId!);
      return schemas;
    },
    initialData: [],
  });
