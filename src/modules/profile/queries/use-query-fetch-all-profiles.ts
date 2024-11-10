import { ProfileUseCases } from "@/use-cases/profile";
import { useQuery } from "@tanstack/react-query";

export type FetchAllProfilesResults = Awaited<ReturnType<typeof ProfileUseCases.fetchAllProfilesAndDefaultProfile>>;
type Config = {
  onSuccess?: (data: FetchAllProfilesResults) => void | Promise<void>;
};

export const useQueryFetchAllProfiles = (config: Config = {}) =>
  useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const results = await ProfileUseCases.fetchAllProfilesAndDefaultProfile();
      if (config.onSuccess) {
        await config.onSuccess(results);
      }
      return results;
    },
  });
