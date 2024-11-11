import { useProfileContext } from "@/modules/profile/profile-context";
import { ItemsUseCases } from "@/use-cases/item";
import { useQuery } from "@tanstack/react-query";

export function useItemsForProfile() {
  const { selectedProfile } = useProfileContext();
  const query = useQuery({
    queryKey: ["items", selectedProfile?.id],
    enabled: selectedProfile !== undefined,
    initialData: [],
    queryFn: async () => {
      const items = await ItemsUseCases.fetchProfileItems(selectedProfile!.id);
      return items;
    },
  });
  return query;
}
