/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { Advance, advanceDefault, advanceSchema } from "@/data/schema/advance.schema";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import advanceApiRequest from "@/apis/advance.api";
import { handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import employeeApiRequest from "@/apis/employee.api";
type FormProps = {
  openCRUD: boolean,
  mode: CRUD_MODE,
  setOpenCRUD: (openCRUD: boolean) => void,
  size?: number,
  detail: Advance
}

//react query key
const QUERY_KEY = {
  keyList: "advances",
  keySub: "employees"
}

export default function FormCRUD(props: FormProps) {
  const { openCRUD, setOpenCRUD = () => { }, size = 600, mode = CRUD_MODE.VIEW, detail = advanceDefault } = props;
  //const { openCRUD = false, setOpenCRUD = () => { }, size = 600, mode = CRUD_MODE.VIEW, detail = {} } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  // const [selectedPeriod, setSelectedPeriod] = useState<string>('10/2024');
  const currentMonth: number = new Date().getMonth() + 1;
  const currenYear: number = new Date().getFullYear();

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const addDataMutation = useMutation({
    mutationFn: (body: Advance) => advanceApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Inserted Successfully!" });
      setOpenCRUD(false);
    }
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number, body: Advance }) => advanceApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Updated Successfully!" });
      setOpenCRUD(false);
    }
  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => advanceApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Deleted Successfully!" });
      setOpenCRUD(false);
    }
  });

  const listDataEmployee = useQuery({
    queryKey: [QUERY_KEY.keySub],
    queryFn: () => employeeApiRequest.getList()
  });
  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<Advance>({
    resolver: zodResolver(advanceSchema),
    defaultValues: advanceDefault,
  });

  const onSubmit = (data: Advance) => {
    if (data.payPeriod) {
      data.month = Number(data.payPeriod.split('/')[0]);
      data.year = Number(data.payPeriod.split('/')[1]);
    }
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
  }, [detail, mode, openCRUD])



  return (
    <div>
      <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD} >
        {mode != CRUD_MODE.DELETE ? <AlertDialogContent
          className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
          <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
            <AlertDialogTitle className="text-slate-50">Details</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <div className="grid grid-cols-2 gap-2 gap-y-3 p-2 text-sm">
                <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nhân viên</FormLabel>
                      <Select 
                        value={field.value?.toString()}
                        onValueChange={field.onChange}
                        disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger>
                            <SelectValue placeholder="Nhân viên cần ứng lương" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listDataEmployee.data?.metadata?.map((e, i) => {
                              return <SelectItem key={i} value={e.id?.toString() ?? "0"}>{e.name}</SelectItem>
                            })
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-2 ">
                  <FormField control={form.control} name="payPeriod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kì lương</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={field.onChange}
                            disabled={isDisabled}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn kì lương" />
                            </SelectTrigger>
                            <SelectContent>
                              {
                                Array.from({ length: currentMonth }, (v, i) => {
                                  const month = (currentMonth - i).toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={i} value={`${month}/${currenYear}`}>
                                      {`${month}/${currenYear}`}
                                    </SelectItem>
                                  );
                                })
                              }
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value?.toString()}
                            onValueChange={field.onChange}
                            disabled={true}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Trạng thái ứng lương" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">Chờ duyệt</SelectItem>
                              <SelectItem value="1">Đã duyệt</SelectItem>
                              <SelectItem value="2">Từ chối</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="col-span-2">
                  <FormField control={form.control} name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Advance Amount</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter advance amount"
                            type="number"
                            {...field}
                            value={field.value ?? ''}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField control={form.control} name="reason"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reason</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter why you need to advance the salary" {...field} value={field.value ?? ''} disabled={isDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="col-span-2">
                  <FormField control={form.control} name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Enter note" {...field} value={field.value ?? ''} disabled={isDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
              <PiTrashLight size={100} color="rgb(248 113 113)" />
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
