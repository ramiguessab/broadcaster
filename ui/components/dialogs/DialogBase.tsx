import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { IItem } from "../base/Select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import * as z from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Select from "../base/Select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useModelStore from "@/hooks/states/models";

interface IDialogBase {
    title: string;
    description: string;
    children: React.ReactNode;
}

export function DialogBase({ title, description, children }: IDialogBase) {
    const [isOpen, setClosed] = useModelStore((state) => [
        state.isOpen,
        state.setClosed,
    ]);

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(state) => {
                if (state === false) {
                    setClosed();
                }
            }}
        >
            <DialogContent className="dark:text-zinc-200 text-2xl font-bold">
                <DialogHeader>
                    <DialogTitle className="capitalize">{title}</DialogTitle>
                    <DialogDescription className="capitalize">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    );
}

interface IFormFieldSchema {
    name: string;
    label: string;
    placeholder: string;
    selectItems?: IItem[];
    type: "input" | "select";
}

interface IFromModel<T> {
    formHead?: (formValues: T) => React.ReactNode;
    defaultValues: { [k: string]: any };
    formName: string;
    formDescription: string;
    onSuccess: (values: T) => void;
    resolverSchema: z.AnyZodObject | z.ZodEffects<z.AnyZodObject>;
    schema: IFormFieldSchema[];
    submitLabel: string;
}

export function FormModel<T>({
    formHead = () => null,
    defaultValues,
    formName,
    formDescription,
    resolverSchema,
    schema,
    submitLabel,
    onSuccess,
}: IFromModel<T>) {
    const closeModel = useModelStore((state) => state.setClosed);
    const form = useForm({
        defaultValues,
        resolver: zodResolver(resolverSchema),
    });

    return (
        <DialogBase title={formName} description={formDescription}>
            <div className="flex justify-center items-center">
                {formHead(form.getValues() as T)}
            </div>
            <Form {...form}>
                <form
                    className="flex flex-col gap-4"
                    onSubmit={form.handleSubmit((values) => {
                        onSuccess(values as T);
                        closeModel();
                    })}
                >
                    {schema.map((formField) => (
                        <FormField
                            key={formField.name}
                            control={form.control}
                            name={formField.name}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="capitalize">
                                        {formField.label}
                                    </FormLabel>
                                    <FormControl>
                                        {formField.type === "input" ? (
                                            <Input
                                                placeholder={
                                                    formField.placeholder
                                                }
                                                {...field}
                                            />
                                        ) : (
                                            <Select
                                                {...field}
                                                items={formField.selectItems!}
                                                placeholder={
                                                    formField.placeholder
                                                }
                                                defaultValue={field.value}
                                            />
                                        )}
                                    </FormControl>
                                    <FormMessage className="capitalize" />
                                </FormItem>
                            )}
                        />
                    ))}
                    <Button className="w-full capitalize" type="submit">
                        {submitLabel}
                    </Button>
                </form>
            </Form>
        </DialogBase>
    );
}
