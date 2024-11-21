/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { Candidate, candidateDefault, candidateSchema } from "@/data/schema/candidate.schema";
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
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import applicantApiRequest from "@/apis/candidate.api";
import { handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import testApiRequest from "@/apis/test.api";
type FormProps = {
  openAddTest: boolean,
  mode: CRUD_MODE,
  setOpenAddTest: (openAddTest: boolean) => void,
  size?: number,
  detail: Candidate
}

//react query key
const QUERY_KEY = {
  keyList: "applicants",
  keysub: "tests",
  keysub2: "positions"
}

export default function FormAddTest(props: FormProps) {
  const { openAddTest = false, setOpenAddTest = () => { }, size = 600, mode = CRUD_MODE.VIEW, detail = {} } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  // const addDataMutation = useMutation({
  //   mutationFn: (body: FormData) => applicantApiRequest.create(body),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
  //     handleSuccessApi({ message: "Inserted Successfully!" });
  //     setOpenAddTest(false);
  //   }
  // });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number, body: Candidate }) => applicantApiRequest.updateTest(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Updated Successfully!" });
      setOpenAddTest(false);
    }
  });

  // const deleteDataMutation = useMutation({
  //   mutationFn: (id: number) => applicantApiRequest.delete(id),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
  //     handleSuccessApi({ message: "Deleted Successfully!" });
  //     setOpenAddTest(false);
  //   }
  // });

  const listDataTest = useQuery({
    queryKey: [QUERY_KEY.keysub],
    queryFn: () => testApiRequest.getList()
  });

  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<Candidate>({
    resolver: zodResolver(candidateSchema),
    defaultValues: candidateDefault,
  });

  const onSubmit = (data: Candidate) => {
    // const formData = new FormData();
    // formData.append("name", data.name!);
    // formData.append("email", data.email!);
    // formData.append("phone", data.phone!);
    // formData.append("positionId", data.positionId?.toString() ?? "0");
    // formData.append("rate", data.rate?.toString() ?? "0");
    // formData.append("testId", data.testId?.toString() ?? "0");
    // formData.append("interviewerId", data.interviewerId?.toString() ?? "0");
    // formData.append("status", (data.status as number).toString()); 
    // formData.forEach((value, key) => console.log(key, value));
    
    if (mode === CRUD_MODE.EDIT) updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
    // if (mode === CRUD_MODE.ADD) {
    //   addDataMutation.mutate(formData);
    // } else if (mode === CRUD_MODE.EDIT) {
    //   updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
    // } else if (mode == CRUD_MODE.DELETE) {
    //   deleteDataMutation.mutate(data.id ?? 0)
    // };
  };

  const handleCloseForm = (e: any) => {
    e.preventDefault();
    setOpenAddTest(false);
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
      <AlertDialog open={openAddTest} onOpenChange={setOpenAddTest} >
        {mode != CRUD_MODE.DELETE ? <AlertDialogContent
          className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[500px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
          <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
            <AlertDialogTitle className="text-slate-50">Sample Details</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <div className="p-2 text-sm space-y-3">
                <FormField
                    control={form.control}
                    name="testId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn bộ test</FormLabel>
                        <Select  onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={isDisabled} >
                          <FormControl >
                            <SelectTrigger >
                              <SelectValue  placeholder="Chọn bộ test" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {
                              listDataTest.data?.metadata?.map((item, index) => {
                                return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                              })
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
              </div>
              <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                  <Button type="submit" size='sm' onClick={() => onSubmit(form.getValues())}>Save</Button>}
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

