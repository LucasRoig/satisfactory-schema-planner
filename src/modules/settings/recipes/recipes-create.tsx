import { ItemCombobox } from "@/components/item-combobox";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useProfileContext } from "@/modules/profile/profile-context";
import { RecipesUseCases } from "@/use-cases/recipes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useCallback, useMemo } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { z } from "zod";
import { SettingsBreadcrumbs } from "../settings-breadcrumbs";
import { useSettingsContext } from "../settings-context";

const baseSchema = z.object({
  name: z.string().min(1),
  inputs: z.array(
    z.object({
      itemId: z.number(),
      quantity: z.number().min(1),
    }),
  ),
  outputs: z.array(
    z.object({
      itemId: z.number(),
      quantity: z.number().min(1),
    }),
  ),
});

//TODO: retravailler la gestion des erreurs dans ce formulaire
export function RecipesCreate(props: { buildingId: number }) {
  const { buildings, selectedProfile } = useProfileContext();
  const { openBuildingDetails } = useSettingsContext();
  const building = useMemo(() => buildings.get(props.buildingId), [props.buildingId, buildings]);

  const createRecipe = useMutation({
    mutationFn: (recipe: z.infer<typeof baseSchema>) => {
      if (selectedProfile === undefined) {
        throw new Error("ProfileId is undefined");
      }
      return RecipesUseCases.createRecipe({
        name: recipe.name,
        profileId: selectedProfile.id,
        buildingId: props.buildingId,
        inputs: recipe.inputs,
        outputs: recipe.outputs,
        icon: undefined,
      });
    },
    onSuccess: () => {
      openBuildingDetails(props.buildingId);
    },
  });

  const resolver: Resolver<z.infer<typeof baseSchema>> = useCallback(
    async (values, ctx, opts) => {
      if (building === undefined) {
        return {
          values: {},
          errors: {
            name: {
              message: "Building not found",
              type: "deps",
            },
          },
        };
      }
      const baseResolver = zodResolver(baseSchema);
      const baseResult = await baseResolver(values, ctx, opts);
      if (Object.keys(baseResult.errors).length > 0) {
        return baseResult;
      }
      const inputsCount = values.inputs.length;
      const outputsCount = values.outputs.length;
      const hasErrors = inputsCount !== building.inputCount || outputsCount !== building.outputCount;
      if (hasErrors) {
        return {
          values: {},
          errors: {
            inputs: {
              type: "deps",
              message: "Inputs or outputs count does not match building",
            },
            outputs: {
              type: "deps",
              message: "Inputs or outputs count does not match building",
            },
          },
        };
      }
      return {
        values,
        errors: {},
      };
    },
    [building],
  );

  const form = useForm<z.infer<typeof baseSchema>>({
    resolver,
    defaultValues: {
      name: "",
      inputs: [],
      outputs: [],
    },
  });

  const onSubmit = (data: z.infer<typeof baseSchema>) => {
    createRecipe.mutate(data);
  };

  return (
    <div className="w-full flex flex-col overflow-auto max-h-full h-full my-4 gap-4">
      <SettingsBreadcrumbs />
      <div className="grow flex flex-col overflow-auto max-h-full h-full">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Recipe name..." {...field} />
                  </FormControl>
                  <FormDescription>The name of the recipe.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <div className="text-lg font-medium mb-2">Inputs</div>
              <FormField control={form.control} name="inputs" render={() => <FormMessage />} />
              <div className="flex flex-col gap-4">
                {Array(building?.inputCount ?? 0)
                  .fill(0)
                  .map((_, i) => (
                    <FormField
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={i}
                      control={form.control}
                      name="inputs"
                      render={() => (
                        <div className="flex gap-8">
                          <FormItem className="flex flex-col">
                            <FormLabel>Item</FormLabel>
                            <ItemCombobox
                              selectedItemId={form.watch(`inputs.${i}.itemId`)}
                              onSelect={(itemId) => form.setValue(`inputs.${i}.itemId`, itemId)}
                            />
                          </FormItem>
                          <FormItem className="flex flex-col">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={form.watch(`inputs.${i}.quantity`)}
                                onChange={(e) => form.setValue(`inputs.${i}.quantity`, e.target.valueAsNumber)}
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                      )}
                    />
                  ))}
              </div>
            </div>
            <div>
              <div className="text-lg font-medium mb-2">Outputs</div>
              <FormField control={form.control} name="outputs" render={() => <FormMessage />} />
              <div className="flex flex-col gap-4">
                {Array(building?.outputCount ?? 0)
                  .fill(0)
                  .map((_, i) => (
                    <FormField
                      // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
                      key={i}
                      control={form.control}
                      name="outputs"
                      render={() => (
                        <div className="flex gap-8">
                          <FormItem className="flex flex-col">
                            <FormLabel>Item</FormLabel>
                            <ItemCombobox
                              selectedItemId={form.watch(`outputs.${i}.itemId`)}
                              onSelect={(itemId) => form.setValue(`outputs.${i}.itemId`, itemId)}
                            />
                          </FormItem>
                          <FormItem className="flex flex-col">
                            <FormLabel>Quantity</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                value={form.watch(`outputs.${i}.quantity`)}
                                onChange={(e) => form.setValue(`outputs.${i}.quantity`, e.target.valueAsNumber)}
                              />
                            </FormControl>
                          </FormItem>
                        </div>
                      )}
                    />
                  ))}
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" onClick={() => openBuildingDetails(props.buildingId)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRecipe.isPending}>
                {createRecipe.isPending ? <Loader2 className="animate-spin" /> : null}
                Create
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
