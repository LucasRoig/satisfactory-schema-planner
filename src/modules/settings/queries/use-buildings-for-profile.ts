import { BuildingsUseCases } from "@/use-cases/buildings";
import { useQuery } from "@tanstack/react-query";

export type FetchBuildingResults = Awaited<ReturnType<typeof BuildingsUseCases.fetchProfileBuildings>>;

export function useBuildingsForProfile(profileId: number | undefined) {
  const query = useQuery({
    queryKey: ["buildings", profileId],
    enabled: profileId !== undefined,
    initialData: [],
    queryFn: async () => {
      const buildings = await BuildingsUseCases.fetchProfileBuildings(profileId!);
      return buildings;
    },
  });
  return query;
}
