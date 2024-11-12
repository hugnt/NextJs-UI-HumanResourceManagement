/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const";
import {
  JobPosting,
  jobPostingDefault,
  jobPostingSchema,
} from "@/data/schema/jobPosting,schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jobPostingApiRequest from "@/apis/jobPosting.api";
import { handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import positionApiRequest from "@/apis/position.api";
import employeeApiRequest from "@/apis/employee.api";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
type FormProps = {
  openCRUD: boolean;
  mode: CRUD_MODE;
  setOpenCRUD: (openCRUD: boolean) => void;
  size?: number;
  detail: JobPosting;
};

//react query key
const QUERY_KEY = {
  keyList: "jobPostings",
  keySub: "employees",
  keySub2: "positions",
};

export default function FormCRUD(props: FormProps) {
  const {
    openCRUD = false,
    setOpenCRUD = () => {},
    size = 600,
    mode = CRUD_MODE.VIEW,
    detail = {},
  } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const addDataMutation = useMutation({
    mutationFn: (body: JobPosting) => jobPostingApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
      handleSuccessApi({ message: "Inserted Successfully!" });
      setOpenCRUD(false);
    },
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: JobPosting }) =>
      jobPostingApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
      handleSuccessApi({ message: "Updated Successfully!" });
      setOpenCRUD(false);
    },
  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => jobPostingApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
      handleSuccessApi({ message: "Deleted Successfully!" });
      setOpenCRUD(false);
    },
  });

  const listDataPosition = useQuery({
    queryKey: [QUERY_KEY.keySub2],
    queryFn: () => positionApiRequest.getList(),
  });
  const listDataEmployee = useQuery({
    queryKey: [QUERY_KEY.keySub],
    queryFn: () => employeeApiRequest.getList(),
  });
  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<JobPosting>({
    resolver: zodResolver(jobPostingSchema),
    defaultValues: jobPostingDefault,
  });

  const onSubmit = (data: JobPosting) => {
    if (mode == CRUD_MODE.ADD) addDataMutation.mutate(data);
    else if (mode == CRUD_MODE.EDIT)
      updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
    else if (mode == CRUD_MODE.DELETE) deleteDataMutation.mutate(data.id ?? 0);
  };

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
  }, [detail, mode, openCRUD]);

  return (
    <div>
      {mode != CRUD_MODE.DELETE ? (
        <Sheet open={openCRUD} onOpenChange={setOpenCRUD}>
          <SheetContent className="p-0 overflow-y-auto sm:max-w-[800px] !sm:w-[800px] min-w-[800px]">
            <SheetHeader className="px-4 pt-3">
              <SheetTitle>Chi tiết lương</SheetTitle>
              <SheetDescription>
                Hiển thị chi tiết thông tin về các khoản lương, thành phần lương
                của nhân viên được trong tháng
              </SheetDescription>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-0"
              >
                <div className="p-2 text-sm space-y-3">
                  <FormField
                    control={form.control}
                    name="positionId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn vị trí</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                          disabled={isDisabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn vị trí" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listDataPosition.data?.metadata?.map(
                              (item, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={item.id?.toString() ?? "0"}
                                  >
                                    {item.name}
                                  </SelectItem>
                                );
                              }
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nhập mô tả</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập mô tả"
                            {...field}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Địa điểm phỏng vấn</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Địa điểm phỏng vấn"
                            {...field}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salaryRangeMin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lương tối thiểu</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Lương tối thiểu"
                            {...field}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="salaryRangeMax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lương tối đa</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Lương tối đa"
                            {...field}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postingDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày đăng</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                            }
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="expirationDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày hết hạn</FormLabel>
                        <FormControl>
                          <Input
                            type="datetime-local"
                            {...field}
                            value={
                              field.value
                                ? new Date(field.value)
                                    .toISOString()
                                    .slice(0, 16)
                                : ""
                            }
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="experienceRequired"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Kinh nghiệm yêu cầu</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Kinh nghiệm yêu cầu"
                            {...field}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* <FormField
                  control={form.control}
                  name="employeeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Id nhân viên đăng bài</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Id nhân viên đăng bài" {...field} disabled={isDisabled} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                  <FormField
                    control={form.control}
                    name="employeeId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn người đăng bài</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                          disabled={isDisabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn người đăng bài" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listDataEmployee.data?.metadata?.map(
                              (item, index) => {
                                return (
                                  <SelectItem
                                    key={index}
                                    value={item.id?.toString() ?? "0"}
                                  >
                                    {item.name}
                                  </SelectItem>
                                );
                              }
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                  <Button
                    onClick={handleCloseForm}
                    className="bg-gray-400  hover:bg-red-500"
                    size="sm"
                  >
                    Close
                  </Button>
                  {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) && (
                    <Button type="submit" size="sm">
                      Save
                    </Button>
                  )}
                </AlertDialogFooter>
              </form>
            </Form>
          </SheetContent>
        </Sheet>
      ) : (
        <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD}>
          //DELETE FORM
          <AlertDialogContent
            className={`gap-0 top-[50%] border-none overflow-hidden p-0 w-[400px] sm:rounded-[0.3rem]`}
          >
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
              <Button
                onClick={handleCloseForm}
                className="bg-gray-400  hover:bg-red-500"
                size="sm"
              >
                Close
              </Button>
              <Button className="" size="sm" onClick={() => onSubmit(detail)}>
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
