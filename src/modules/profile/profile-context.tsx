import type { InsertProfile } from "@/database/repositories/profile-repository";
import { ProfileUseCases } from "@/use-cases/profile";
import { useMutation } from "@tanstack/react-query";
import React, { useContext } from "react";
import { type FetchItemsResults, useItemsForProfile } from "../settings/queries/useItemsForProfile";
import { CreateProfileModal } from "./create-profile-modal";
import { type FetchAllProfilesResults, useQueryFetchAllProfiles } from "./queries/use-query-fetch-all-profiles";
import { type FetchSchemasResults, useQueryFetchAllSchemas } from "./queries/use-query-fetch-all-schemas";

type ProfileContextType = {
  profiles: FetchAllProfilesResults["profiles"] | undefined;
  selectedProfile: FetchAllProfilesResults["profiles"][number] | undefined;
  setSelectedProfile: (profileId: number) => void;
  status: "error" | "success" | "pending";
  openCreateProfileModal: () => void;
  schemas: Map<number, FetchSchemasResults[number]>;
  items: Map<number, FetchItemsResults[number]>;
};

export type ProfileContextProviderProps = {
  children: React.ReactNode;
};

const ProfileContext = React.createContext<ProfileContextType | undefined>(undefined);

export const ProfileContextProvider: React.FC<ProfileContextProviderProps> = (props) => {
  const [selectedProfile, setSelectedProfile] = React.useState<FetchAllProfilesResults["profiles"][number]>();
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = React.useState(false);

  const { data: schemas } = useQueryFetchAllSchemas(selectedProfile?.id);
  const { data: items } = useItemsForProfile(selectedProfile?.id);

  const { data: profiles, status } = useQueryFetchAllProfiles({
    onSuccess: (results) => {
      if (selectedProfile === undefined) {
        const defaultProfileId = results.defaultProfileId;
        let p = results.profiles[0];
        if (defaultProfileId !== undefined) {
          const defaultP = results.profiles.find((p) => p.id === defaultProfileId);
          if (defaultP !== undefined) {
            p = defaultP;
          }
        }
        setSelectedProfile(p);
      }
    },
  });

  const createProfile = useMutation({
    mutationFn: (profile: InsertProfile) => ProfileUseCases.createProfile(profile),
    onSuccess: (data) => {
      setSelectedProfile(data);
      ProfileUseCases.setProfileInConfig(data.id);
    },
  });

  const value: ProfileContextType = {
    status,
    profiles: profiles?.profiles,
    selectedProfile,
    openCreateProfileModal: () => setIsCreateProfileModalOpen(true),
    setSelectedProfile: (id: number) => {
      const profile = profiles?.profiles?.find((p) => p.id === id);
      if (profile) {
        ProfileUseCases.setProfileInConfig(id);
        setSelectedProfile(profile);
      }
    },
    schemas: new Map(schemas.map((s) => [s.id, s])),
    items: new Map(items.map((i) => [i.id, i])),
  };

  return (
    <ProfileContext.Provider value={value}>
      <CreateProfileModal
        isOpen={isCreateProfileModalOpen}
        setIsOpen={setIsCreateProfileModalOpen}
        onSubmit={(args) => {
          createProfile.mutate(args);
        }}
      />
      {props.children}
    </ProfileContext.Provider>
  );
};

export const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileContextProvider");
  }
  return context;
};
