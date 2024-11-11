import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { pathSchema } from "@/database/types/schema";
import { SchemaUseCases } from "@/use-cases/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogClose } from "@radix-ui/react-dialog";
import { useMutation } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useProfileContext } from "../profile/profile-context";
import { useSchemaDrawerContext } from "./schema-drawer-context";

const schemaFormSchema = z.object({
  name: z.string().min(1),
  path: pathSchema,
});

type SchemaFormValues = z.infer<typeof schemaFormSchema>;

export function CreateSchemaModal(props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit?: (args: { name: string }) => void;
}) {
  const { openSchema } = useSchemaDrawerContext();
  const { selectedProfile } = useProfileContext();
  const form = useForm<SchemaFormValues>({
    resolver: zodResolver(schemaFormSchema),
    defaultValues: {
      name: "",
      path: "/",
    },
  });

  const createSchema = useMutation({
    mutationFn: (schema: SchemaFormValues) => {
      if (selectedProfile === undefined) {
        throw new Error("ProfileId is undefined");
      }
      return SchemaUseCases.insertSchema({
        name: schema.name,
        profileId: selectedProfile.id,
        icon: undefined,
        path: schema.path,
      });
    },
    onSuccess: (data) => {
      props.setIsOpen(false);
      form.reset();
      openSchema(data.id);
    },
  });

  const onSubmit = (data: SchemaFormValues) => {
    createSchema.mutate(data);
  };

  return (
    <Dialog open={props.isOpen} onOpenChange={props.setIsOpen}>
      <DialogContent className="max-w-[60vw] min-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create a new Schema</DialogTitle>
          <DialogDescription>Create a new schema. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <div className="grow flex flex-col overflow-auto max-h-full h-full">
            <form id="create-schema-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Schema name..." {...field} />
                    </FormControl>
                    <FormDescription>The name of the schema.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="path"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Path</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>The path of the schema.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button form="create-schema-form" type="submit" disabled={createSchema.isPending}>
              {createSchema.isPending ? <Loader2 className="animate-spin" /> : null}
              Create schema
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
