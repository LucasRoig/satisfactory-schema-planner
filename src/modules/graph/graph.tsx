import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { PlusCircle, Settings } from "lucide-react";
import { useProfileContext } from "../profile/profile-context";

export function Graph() {
  const { selectedProfile, profiles, status: profileStatus, openCreateProfileModal } = useProfileContext();

  if (profileStatus === "pending") {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <Skeleton className="w-[100px] h-[100px] rounded-full" />
      </div>
    );
  }
  if (profiles?.length === 0) {
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
  return (
    <div className="w-full h-full relative">
      <SettingsButton className="absolute top-2 left-2" />
    </div>
  );
}

function SettingsButton({ className }: { className?: string }) {
  return (
    <Button variant="outline" className={cn("rounded-full", className)} size="icon">
      <Settings className="h-5 w-5" />
    </Button>
  );
}
