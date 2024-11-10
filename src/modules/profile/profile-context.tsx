import type { InsertProfile } from "@/database/repositories/profile-repository";
import { ProfileUseCases } from "@/use-cases/profile";
import { useMutation } from "@tanstack/react-query";
import React, { useContext } from "react";
import { CreateProfileModal } from "./create-profile-modal";
import { type FetchAllProfilesResults, useQueryFetchAllProfiles } from "./queries/use-query-fetch-all-profiles";

type ProfileContextType = {
  profiles: FetchAllProfilesResults | undefined;
  selectedProfile: FetchAllProfilesResults[number] | undefined;
  setSelectedProfile: (profileId: number) => void;
  status: "error" | "success" | "pending";
  openCreateProfileModal: () => void;
};

export type ProfileContextProviderProps = {
  children: React.ReactNode;
};

const ProfileContext = React.createContext<ProfileContextType | undefined>(undefined);

export const ProfileContextProvider: React.FC<ProfileContextProviderProps> = (props) => {
  const [selectedProfile, setSelectedProfile] = React.useState<FetchAllProfilesResults[number]>();
  const [isCreateProfileModalOpen, setIsCreateProfileModalOpen] = React.useState(false);
  const { data: profiles, status } = useQueryFetchAllProfiles({
    onSuccess: (results) => {
      if (selectedProfile === undefined) {
        setSelectedProfile(results[0]);
      }
    },
  });

  const createProfile = useMutation({
    mutationFn: (profile: InsertProfile) => ProfileUseCases.createProfile(profile),
    onSuccess: () => {},
  });

  const value: ProfileContextType = {
    status,
    profiles,
    selectedProfile,
    openCreateProfileModal: () => setIsCreateProfileModalOpen(true),
    setSelectedProfile: (id: number) => {
      const profile = profiles?.find((p) => p.id === id);
      if (profile) {
        setSelectedProfile(profile);
      }
    },
  };

  return (
    <ProfileContext.Provider value={value}>
      <CreateProfileModal
        isOpen={isCreateProfileModalOpen}
        setIsOpen={setIsCreateProfileModalOpen}
        onSubmit={(args) => {
          createProfile.mutate(args, {
            onSuccess: (data) => {
              setSelectedProfile(data);
            },
          });
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
