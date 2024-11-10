import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { useProfileContext } from "../profile/profile-context";

export function Graph() {
  const { selectedProfile, profiles, status: profileStatus, openCreateProfileModal } = useProfileContext();

  if (profileStatus === "pending") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="w-[100px] h-[100px] rounded-full" />
      </div>
    );
  } else if (profiles?.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Button onClick={openCreateProfileModal}>
          <PlusCircle className="h-5 w-5" />
          Create a profile
        </Button>
      </div>
    );
  }
  if (selectedProfile === undefined) {
    return <div className="w-full h-full flex items-center justify-center">Please select a profile</div>;
  }
}
