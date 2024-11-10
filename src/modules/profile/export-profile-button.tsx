import { Button } from "@/components/ui/button";
import { ProfileUseCases } from "@/use-cases/profile";
import { FileDown, Loader2 } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useProfileContext } from "./profile-context";

export function ExportProfileButton(props: { className?: string }) {
  const { selectedProfile } = useProfileContext();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleClick = async () => {
    if (selectedProfile) {
      try {
        setIsLoading(true);
        const json = await ProfileUseCases.profileToJson(selectedProfile.id);
        const blob = new Blob([json], { type: "text/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${selectedProfile.name}.json`;
        a.click();
        URL.revokeObjectURL(url);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        toast.error(`Something went wrong: ${msg}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Button className={props.className} disabled={selectedProfile === undefined || isLoading} onClick={handleClick}>
      {isLoading ? <Loader2 className="animate-spin" /> : <FileDown className="h-5 w-5" />}
      Export Profile
    </Button>
  );
}
