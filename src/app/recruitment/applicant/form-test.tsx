/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { Question, questionDefault, questionSchema } from "@/data/schema/question.schema";
import { TestResult, testResultDefault, testResultSchema } from "@/data/schema/testResult.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {Controller, useForm, useFieldArray } from "react-hook-form";
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
import { handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import { SelectTrigger, SelectValue } from "@/components/ui/select";
import { Select, SelectContent, SelectItem } from "@/components/ui/select";
import questionApiRequest from "@/apis/question.api";
import applicantApiRequest from "@/apis/candidate.api";
import testApiRequest from "@/apis/test.api";
import testResultApiRequest from "@/apis/testResult.api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import test from "node:test";
import { number } from "prop-types";
import { Candidate } from "@/data/schema/candidate.schema";
type FormTest = {
  openTest: boolean,
  setOpenTest: (openTest: boolean) => void,
  size?: number,
  detail: TestResult
}

//react query key
const QUERY_KEY = {
  keyList: "testResults",
  keyadd: "testResultsadd",
  keySub: "questions",
  keySub2: "applicants",
  keySub3: "tests",
}

export default function FormTest(props: FormTest) {
  const { openTest = false, setOpenTest = () => { }, size = 600, detail ={}} = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [points, setPoints] = useState<{ [key: number]: number }>({});
  // #region +HOOK FORM
  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const addDataMutation = useMutation({
    mutationFn: async(body: TestResult[]) => await testResultApiRequest.createList(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Inserted Successfully!" });
      setOpenTest(false);
    }
  });
  const updateDataMutation = useMutation({
    mutationFn: async({ id, point }: { id: number, point: number }) => {
      return await applicantApiRequest.updatePoint(id, point);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Updated Successfully!" });
    }
  });

  const listDataResult = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => testResultApiRequest.getListById(detail.applicantTestId ?? 0)
  });
  const listDataQuestion = useQuery({
    queryKey: [QUERY_KEY.keySub],
    queryFn: () => questionApiRequest.getListById(detail.applicantTestId ?? 0)
  });
  const listDataApplicant = useQuery({
    queryKey: [QUERY_KEY.keySub2],
    queryFn: () => applicantApiRequest.getList()
  });
  const listDataTest = useQuery({
    queryKey: [QUERY_KEY.keySub3],
    queryFn: () => testApiRequest.getList()
  });
  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<TestResult>({
    resolver: zodResolver(testResultSchema),
    defaultValues: testResultDefault,
  });

  const onSubmit = (data: TestResult) => {
    
    const formattedData = listDataQuestion.data?.metadata?.map((item) => ({
      questionsId: item.id,
      applicantId: data.applicantId,
      point: points[item.id ?? 0] || 0, // Lấy điểm từ state points
      comment: data.comment,
    }));
    const totalPoints = formattedData?.reduce((acc, item) => acc + item.point, 0) || 0;
    console.log(data.applicantId);
    
    if (formattedData) {
      const fetchData = async () => {
        await testResultApiRequest.createList(formattedData);
        await applicantApiRequest.updatePoint(data.applicantId ?? 0, totalPoints );
        queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keySub2] })
        handleSuccessApi({ message: "Inserted Successfully!" });
        setOpenTest(false);
      }
      fetchData();
    }
   };
  const handleCloseForm = (e: any) => {
    e.preventDefault();
    setOpenTest(false);
  };
  // #endregion

    useEffect(() => {
      if (Object.keys(detail).length > 0) {
        form.reset(detail);
      }
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keySub] })
    }, [detail,openTest])

  return (
    <div>
        <Sheet open={openTest} onOpenChange={setOpenTest}>
          <SheetContent className="p-0 overflow-y-auto sm:max-w-[800px] !sm:w-[800px] min-w-[800px]">
            <SheetHeader className="px-4 pt-3">
              <SheetTitle>Chi tiết công việc</SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                <div className="p-2 text-sm space-y-3">
                <FormField
                    control={form.control}
                    name="applicantId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ứng viên</FormLabel>
                        <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value?.toString()}>
                          <FormControl >
                            <SelectTrigger >
                              <SelectValue  placeholder="Tên ứng viên" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {
                              listDataApplicant.data?.metadata?.map((item, index) => {
                                return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                              })
                            }
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="applicantTestId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn test</FormLabel>
                        <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value?.toString()}>
                          <FormControl >
                            <SelectTrigger disabled>
                              <SelectValue  placeholder="Tên bộ Test" />
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
                  {listDataQuestion.data?.metadata?.map((item, index) => (
                    <div key={index} >
                      <FormField
                        name="point"
                        control={form.control}
                        render={({ field }) => (
                          <FormItem className="flex items-center justify-between space-x-3 w-full">
                              <FormLabel className="whitespace-nowrap">{item.questionText}</FormLabel>
                              <Input 
                              type="number" 
                              placeholder="Nhập điểm"
                              value={points[item.id ?? 0] || ""}  // Sử dụng giá trị từ state `points`
                              onChange={(e) => {const newPoints = { ...points, [item.id ?? 0]: Number(e.target.value) };
                              setPoints(newPoints);}}
                              className="input-class p-1 border border-gray-300 rounded"
                              />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <FormField control={form.control} name="comment"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Điểm tổng</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhận xét" {...field} disabled={isDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                    <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                    <Button type="submit" size='sm'>Save</Button>
                </AlertDialogFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
    </div>
  )
}