import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BuildingsUseCases } from "@/use-cases/buildings";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProfileContext } from "../profile/profile-context";
import { SettingsBreadcrumbs } from "./settings-breadcrumbs";
import { useSettingsContext } from "./settings-context";

const buildingFormSchema = z.object({
  name: z.string().min(1),
  inputCount: z.number().min(1),
  outputCount: z.number().min(1),
});

type BuildingFormValues = z.infer<typeof buildingFormSchema>;

export function BuildingCreate() {
  const { openHome, openBuildingDetails } = useSettingsContext();
  const { selectedProfile } = useProfileContext();

  const createBuilding = useMutation({
    mutationFn: (item: BuildingFormValues) => {
      if (selectedProfile === undefined) {
        throw new Error("ProfileId is undefined");
      }
      return BuildingsUseCases.createBuilding({
        name: item.name,
        profileId: selectedProfile.id,
        icon: undefined,
        inputCount: item.inputCount,
        outputCount: item.outputCount,
      });
    },
    onSuccess: (data) => {
      openBuildingDetails(data.id);
    },
  });

  const form = useForm<BuildingFormValues>({
    resolver: zodResolver(buildingFormSchema),
    defaultValues: {
      name: "",
      inputCount: 1,
      outputCount: 1,
    },
  });

  const onSubmit = (data: BuildingFormValues) => {
    createBuilding.mutate(data);
  };

  return (
    <div className="w-full flex flex-col overflow-auto max-h-full h-full my-4 gap-4">
      <SettingsBreadcrumbs />
      <div className="grow flex flex-col overflow-auto max-h-full h-full">
        Building Create
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Building name..." {...field} />
                  </FormControl>
                  <FormDescription>The name of the building.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inputCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of inputs</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>The number of inputs in this building.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="outputCount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of outputs</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormDescription>The number of outputs in this building.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" onClick={openHome}>
                Cancel
              </Button>
              <Button type="submit" disabled={createBuilding.isPending}>
                {createBuilding.isPending ? <Loader2 className="animate-spin" /> : null}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
