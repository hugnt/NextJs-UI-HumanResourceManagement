/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import positionApiRequest from "@/apis/position.api";
import { handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
type FormProps = {
  openCRUD: boolean,
  mode: CRUD_MODE,
  setOpenCRUD: (openCRUD: boolean) => void,
  size?: number,
  detail: Position
}

//react query key
const QUERY_KEY = {
  keyList: "positions",
}

export default function FormCRUD(props: FormProps) {
  const { openCRUD = false, setOpenCRUD = () => { }, size = 600, mode = CRUD_MODE.VIEW, detail = {} } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const addDataMutation = useMutation({
    mutationFn: (body: Position) => positionApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Inserted Successfully!" });
      setOpenCRUD(false);
    }
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number, body: Position }) => positionApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Updated Successfully!" });
      setOpenCRUD(false);
    }
  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => positionApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Deleted Successfully!" });
      setOpenCRUD(false);
    }
  });
  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<Position>({
    resolver: zodResolver(positionSchema),
    defaultValues: positionDefault,
  });

  const onSubmit = (data: Position) => {
    if (mode == CRUD_MODE.ADD) addDataMutation.mutate(data);
    else if (mode == CRUD_MODE.EDIT) updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
    else if (mode == CRUD_MODE.DELETE) deleteDataMutation.mutate(data.id ?? 0);

    
  }

  const handleCloseForm = (e: any) => {
    e.preventDefault();
    setOpenCRUD(false);
  };
  // #endregion

  useEffect(() => {
    if (Object.keys(detail).length > 0) {
      form.reset(detail);
    }
    if (mode == CRUD_MODE.VIEW) setIsDisabled(true);
    else setIsDisabled(false);
  }, [detail, mode])

  return (
    <div>
      <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD} >
        {mode != CRUD_MODE.DELETE ? <AlertDialogContent
          className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
          <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
            <AlertDialogTitle className="text-slate-50">Sample Details</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <div className="p-2 text-sm space-y-3">
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
                <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                  <Button type="submit" size='sm'>Save</Button>}
              </AlertDialogFooter>
            </form>
          </Form>
        </AlertDialogContent> :
          //DELETE FORM
          <AlertDialogContent
            className={`gap-0 top-[50%] border-none overflow-hidden p-0 w-[400px] sm:rounded-[0.3rem]`}>
            <AlertDialogHeader>
              <AlertDialogTitle></AlertDialogTitle>
            </AlertDialogHeader>
            <div className="text-center pt-8 pb-4 flex justify-center">
              <PiTrashLight  size={100} color="rgb(248 113 113)"/>
            </div>
            <AlertDialogDescription className="text-center pb-4 text-lg text-stone-700">
              Are you absolutely sure to delete?
            </AlertDialogDescription>
            <AlertDialogFooter className="!justify-center p-2 py-3 text-center">
              <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
              <Button className="" size='sm' onClick={() => onSubmit(detail)}>Confirm</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        }
      </AlertDialog>

    </div>
  )
}
