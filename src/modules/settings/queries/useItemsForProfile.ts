import { ItemsUseCases } from "@/use-cases/item";
import { useQuery } from "@tanstack/react-query";

export type FetchItemsResults = Awaited<ReturnType<typeof ItemsUseCases.fetchProfileItems>>;

export function useItemsForProfile(profileId: number | undefined) {
  const query = useQuery({
    queryKey: ["items", profileId],
    enabled: profileId !== undefined,
    initialData: [],
    queryFn: async () => {
      const items = await ItemsUseCases.fetchProfileItems(profileId!);
      return items;
    },
  });
  return query;
}
