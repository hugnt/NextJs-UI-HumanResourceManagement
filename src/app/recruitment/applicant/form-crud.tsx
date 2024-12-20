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
  Candidate,
  candidateDefault,
  candidateSchema,
} from "@/data/schema/candidate.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CandidateStatus } from "@/data/schema/candidate.schema";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import applicantApiRequest from "@/apis/candidate.api";
import { handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import testApiRequest from "@/apis/test.api";
import positionApiRequest from "@/apis/position.api";
import employeeApiRequest from "@/apis/employee.api";
type FormProps = {
  openCRUD: boolean;
  mode: CRUD_MODE;
  setOpenCRUD: (openCRUD: boolean) => void;
  size?: number;
  detail: Candidate;
};

//react query key
const QUERY_KEY = {
  keyList: "applicants",
  keysub: "tests",
  keysub2: "positions",
  keySub3: "employees",
};

export default function FormCRUD(props: FormProps) {
  const {
    openCRUD = false,
    setOpenCRUD = () => {},
    mode = CRUD_MODE.VIEW,
    detail = {},
  } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const addDataMutation = useMutation({
    mutationFn: (body: FormData) => applicantApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
      handleSuccessApi({ message: "Inserted Successfully!" });
      setOpenCRUD(false);
    },
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number; body: FormData }) =>
      applicantApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
      handleSuccessApi({ message: "Updated Successfully!" });
      setOpenCRUD(false);
    },
  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => applicantApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
      handleSuccessApi({ message: "Deleted Successfully!" });
      setOpenCRUD(false);
    },
  });

  const listDataTest = useQuery({
    queryKey: [QUERY_KEY.keysub],
    queryFn: () => testApiRequest.getList(),
  });

  const listDataPosition = useQuery({
    queryKey: [QUERY_KEY.keysub2],
    queryFn: () => positionApiRequest.getList(),
  });

  const listDataEmployee = useQuery({
    queryKey: [QUERY_KEY.keySub3],
    queryFn: () => employeeApiRequest.getList(),
  });

  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<Candidate>({
    resolver: zodResolver(candidateSchema),
    defaultValues: candidateDefault,
  });

  const onSubmit = (data: Candidate) => {
    const formData = new FormData();
    formData.append("name", data.name!);
    formData.append("email", data.email!);
    formData.append("phone", data.phone!);
    formData.append("file", file ?? "");
    formData.append("positionId", data.positionId?.toString() ?? "0");
    formData.append("rate", data.rate?.toString() ?? "0");
    formData.append("testId", data.testId?.toString() ?? "0");
    formData.append("interviewerId", data.interviewerId?.toString() ?? "0");
    formData.append("status", (data.status as number).toString());

    formData.forEach((value, key) => console.log(key, value));

    if (mode === CRUD_MODE.ADD) {
      addDataMutation.mutate(formData, {
        onSuccess: () => {
          setFile(null);
          form.reset(candidateDefault);
        },
      });
    } else if (mode === CRUD_MODE.EDIT) {
      updateDataMutation.mutate(
        { id: detail.id ?? 0, body: formData },
        {
          onSuccess: () => {
            setFile(null); //
            form.reset(detail); //
          },
        }
      );
    } else if (mode == CRUD_MODE.DELETE) {
      deleteDataMutation.mutate(data.id ?? 0);
    }
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
  }, [detail, mode]);

  return (
    <div>
      {mode != CRUD_MODE.DELETE ? (
        <Sheet open={openCRUD} onOpenChange={setOpenCRUD}>
          <SheetContent className="p-0 overflow-y-auto sm:max-w-[800px] !sm:w-[800px] min-w-[800px]">
            <SheetHeader className="px-4 pt-3">
              <SheetTitle>Chi tiết ứng viên</SheetTitle>
            </SheetHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-0"
              >
                <div className="p-2 text-sm space-y-3">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nhập tên"
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
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="nhập Email"
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Điện thoại</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Số điện thoại"
                            {...field}
                            disabled={isDisabled}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Chọn file tải lên:</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        id="avatar"
                        name="avatar"
                        accept="image/png, image/jpeg, application/pdf"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFile(e.target.files[0]);
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>

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
                              <SelectValue placeholder="Chọn Vị trí" />
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
                    name="rate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Điểm</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Điểm"
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
                    name="testId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chọn bộ test</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value?.toString()}
                          disabled={isDisabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn bộ test" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {listDataTest.data?.metadata?.map((item, index) => {
                              return (
                                <SelectItem
                                  key={index}
                                  value={item.id?.toString() ?? "0"}
                                >
                                  {item.name}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="interviewerId"
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
                              <SelectValue placeholder="Chọn người phỏng vấn" />
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
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tình trạng ứng viên</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          } // Parse the value as a number
                          defaultValue={field.value?.toString()}
                          disabled={isDisabled}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn bộ test" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={CandidateStatus.Wait.toString()}>
                              Đợi phỏng vấn
                            </SelectItem>
                            <SelectItem
                              value={CandidateStatus.Decline.toString()}
                            >
                              Từ chối
                            </SelectItem>
                            <SelectItem value={CandidateStatus.Pass.toString()}>
                              Đạt
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <AlertDialogFooter className="p-2 py-1 bg-secondary/80">
                  <Button
                    type="button"
                    onClick={handleCloseForm}
                    className="bg-gray-400  hover:bg-red-500"
                    size="sm"
                  >
                    Close
                  </Button>
                  {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => onSubmit(form.getValues())}
                    >
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
                type="button"
                onClick={handleCloseForm}
                className="bg-gray-400  hover:bg-red-500"
                size="sm"
              >
                Close
              </Button>
              <Button
                type="button"
                className=""
                size="sm"
                onClick={() => onSubmit(form.getValues())}
              >
                Confirm
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}
