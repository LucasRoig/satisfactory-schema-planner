import { RecipesUseCases } from "@/use-cases/recipes";
import { useQuery } from "@tanstack/react-query";

export type FetchRecipesResults = Awaited<ReturnType<typeof RecipesUseCases.fetchProfileRecipes>>;

export function useRecipesForProfile(profileId: number | undefined) {
  const query = useQuery({
    queryKey: ["recipes", profileId],
    enabled: profileId !== undefined,
    initialData: [],
    queryFn: async () => {
      const recipes = await RecipesUseCases.fetchProfileRecipes(profileId!);
      return recipes;
    },
  });
  return query;
}
