
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { Position, positionDefault, positionSchema } from "@/data/schema/position.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { IconTrash } from "@tabler/icons-react";
type FormProps = {
    open: boolean,
    setOpen: (open: boolean) => void,
    size?: number,
    mode?: CRUD_MODE,
    detail: Position,
    handleSave: (detail: Position) => void,
    deleteContent?: string
}


export default function FormCRUD(props: FormProps) {
    const { open = false, setOpen = () => { }, size = 600, mode = CRUD_MODE.VIEW, detail = {}, handleSave, deleteContent = "Are you absolutely sure to delete?" } = props;
    const [isDisabled, setIsDisabled] = useState<boolean>(false);
    // 1. Define your form.
    const form = useForm<Position>({
        resolver: zodResolver(positionSchema),
        defaultValues: positionDefault,
    });

    // 2. Define a submit handler.
    function onSubmit(data: Position) {
        console.log(data);
        //setDetail(data);
        handleSave(data);
    }

    useEffect(() => {
        console.log("in form :", detail);
        if (Object.keys(detail).length > 0) {
            form.reset(detail);
        }
        if (mode == CRUD_MODE.VIEW) setIsDisabled(true);
        else setIsDisabled(false);
    }, [detail, mode])

    return (
        <div>
            <AlertDialog open={open} onOpenChange={setOpen} >
                {mode != CRUD_MODE.DELETE ? <AlertDialogContent draggable={true}
                    className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
                    <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
                        <AlertDialogTitle className="text-slate-50">Sample Details</AlertDialogTitle>
                    </AlertDialogHeader>
                    <AlertDialogDescription />
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                            <div className="p-2 text-sm space-y-3">
                                {/* Edit field */}
                                <FormField control={form.control} name="id"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Id</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Identity" {...field} disabled={true} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField control={form.control} name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Full name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Enter full name" {...field} disabled={isDisabled} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                                <Button onClick={() => setOpen(false)} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                                {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                                <Button type="submit" size='sm'>Save</Button>}
                            </AlertDialogFooter>
                        </form>
                    </Form>
                </AlertDialogContent> :
                    //DELETE FORM
                    <AlertDialogContent draggable={true}
                        className={`gap-0 top-[50%] border-none overflow-hidden p-0 w-[400px] sm:rounded-[0.3rem]`}>
                        <AlertDialogHeader>
                            <AlertDialogTitle></AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="text-center pt-4 flex justify-center">
                            <IconTrash size={100} color="#ef4444" />
                        </div>
                        <AlertDialogDescription className="text-center pb-4">
                            {deleteContent}
                        </AlertDialogDescription>
                        <AlertDialogFooter className="!justify-center p-2 py-1 bg-secondary/80 text-center">
                            <Button onClick={() => setOpen(false)} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                            <Button  size='sm' onClick={() => onSubmit(detail)}>Confirm</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                }
            </AlertDialog>
        </div>
    )
}
