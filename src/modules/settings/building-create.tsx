import { SettingsBreadcrumbs } from "./settings-breadcrumbs";

// const itemFormSchema = z.object({
//   name: z.string().min(1),
// });

// type ItemFormValues = z.infer<typeof itemFormSchema>;

export function BuildingCreate() {
  // const { openHome, openItemDetails } = useSettingsContext();
  // const { selectedProfile } = useProfileContext();

  // const createItem = useMutation({
  //   mutationFn: (item: ItemFormValues) => {
  //     if (selectedProfile === undefined) {
  //       throw new Error("ProfileId is undefined");
  //     }
  //     return ItemsUseCases.createItem({
  //       name: item.name,
  //       profileId: selectedProfile.id,
  //       icon: undefined,
  //     });
  //   },
  //   onSuccess: (data) => {
  //     openItemDetails(data.id);
  //   },
  // });

  // const form = useForm<ItemFormValues>({
  //   resolver: zodResolver(itemFormSchema),
  // });

  // const onSubmit = (data: ItemFormValues) => {
  //   createItem.mutate(data);
  // };

  return (
    <div className="w-full flex flex-col overflow-auto max-h-full h-full my-4 gap-4">
      <SettingsBreadcrumbs />
      <div className="grow flex flex-col overflow-auto max-h-full h-full">
        Building Create
        {/* <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Item name..." {...field} />
                  </FormControl>
                  <FormDescription>The name of the item.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button variant="outline" onClick={openHome}>
                Cancel
              </Button>
              <Button type="submit" disabled={createItem.isPending}>
                {createItem.isPending ? <Loader2 className="animate-spin" /> : null}
                Create
              </Button>
            </div>
          </form>
        </Form> */}
      </div>
    </div>
  );
}
