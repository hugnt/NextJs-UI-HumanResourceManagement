/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Select as SelectOne, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Select from 'react-select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { handleErrorApi, handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import { IoMdClose } from "react-icons/io";
import LoadingSpinIcon from "@/components/loading-spin-icon";
import employeeApiRequest from "@/apis/employee.api";
import { FaSave } from "react-icons/fa";
import taxDeductionApiRequest from "@/apis/taxDeduction.api";
import { Employee, employeeDefault, employeeSchema } from "@/data/schema/employee.schema";
import { MdAttachEmail } from "react-icons/md";
import Link from "next/link";
type FormProps = {
  openCRUD: boolean,
  mode: CRUD_MODE,
  setOpenCRUD: (openCRUD: boolean) => void,
  detail: Employee
}

//react query key
const QUERY_KEY = {
  keyList: "employee-list",
  keyContractList: "contract-list",
  keyTaxDeductionList: "tax-deduction-list",
}

export default function FormCRUD(props: FormProps) {
  const { openCRUD = false, setOpenCRUD = () => { }, mode = CRUD_MODE.VIEW, detail = {} } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [lstContractIds, setLstContractIds] = useState<number[]>([]);

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const listDataContact = useQuery({
    queryKey: [QUERY_KEY.keyContractList],
    queryFn: () => employeeApiRequest.getAllContractNotInUsed(),
  });

  const listDataTaxDeduction = useQuery({
    queryKey: [QUERY_KEY.keyTaxDeductionList],
    queryFn: () => taxDeductionApiRequest.getList(),
  });

  const taxDeductionListOptions = listDataTaxDeduction.data?.metadata?.map((x) => {
    return {
      label: x.name,
      value: x.id,
    };
  });

  const addDataMutation = useMutation({
    mutationFn: (body: Employee) => employeeApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Inserted Successfully!" });
      setOpenCRUD(false);
    }
  });

  const sendEmailDataMutation = useMutation({
    mutationFn: (body: Employee) => employeeApiRequest.sendLoginInfo(body),
    onSuccess: () => {
      handleSuccessApi({ message: "Sent email Successfully!" });
      setOpenCRUD(false);
    }
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number, body: Employee }) => employeeApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Updated Successfully!" });
      setOpenCRUD(false);
    }
  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => employeeApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Deleted Successfully!" });
      setOpenCRUD(false);
    }
  });
  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<Employee>({
    resolver: zodResolver(employeeSchema),
    defaultValues: employeeDefault,
  });

  const handleSubmit = () => {
    const data = form.getValues();
    //console.log("form:",data);
    if (mode == CRUD_MODE.ADD) addDataMutation.mutate(data);
    else if (mode == CRUD_MODE.EDIT) updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
    else if (mode == CRUD_MODE.DELETE) deleteDataMutation.mutate(data.id ?? 0);
  }

  const handleSubmitAndSendEmail = () => {
    handleSubmit();
    const data = form.getValues();
    if (updateDataMutation.isSuccess || addDataMutation.isSuccess) {
      sendEmailDataMutation.mutate(data);
    }

  }

  const handleCloseForm = (e: any) => {
    e.preventDefault();
    setOpenCRUD(false);
  };

  const handleChangeContractId = (contractId: number) => {
    if (contractId == 0) return;
    const fetchData = async () => {
      try {
        const resAPI = await employeeApiRequest.getDetailByContractId(contractId);
        if (!resAPI.isSuccess) {
          throw Error("Không lấy đc dữ liệu");
        }
        form.reset(resAPI.metadata);
        //console.log("resAPI.metadata",resAPI.metadata)
      } catch (error) {
        handleErrorApi({ error: error });
      }

    }
    fetchData();
  }

  // #endregion

  useEffect(() => {
    if (Object.keys(detail).length > 0) {
      form.reset(detail);
    }
    if (mode == CRUD_MODE.VIEW) setIsDisabled(true);
    else setIsDisabled(false);

    if (mode == CRUD_MODE.ADD) {
      setLstContractIds(listDataContact?.data?.metadata ?? [])
    }
    else {
      setLstContractIds([
        ...(listDataContact?.data?.metadata ?? []),
        detail.id ?? 0
      ]);
    }


  }, [detail, mode, openCRUD, listDataContact.data])

  return (
    <div>
      {mode != CRUD_MODE.DELETE ?
        <Sheet open={openCRUD} onOpenChange={setOpenCRUD}>
          <SheetContent className="p-0 overflow-y-auto sm:max-w-[800px] !sm:w-[800px] min-w-[800px]">
            <SheetHeader className="px-4 pt-3">
              <SheetTitle>Thông tin nhân viên</SheetTitle>
              <SheetDescription>
                Form này chỉ cho phép cập nhật một số thông tin cơ bản của nhân viên, để cập nhật chi tiết vào hợp đồng
              </SheetDescription>
            </SheetHeader>
            <div>
              <Form {...form}>
                <form className="space-y-0 grid grid-cols-3 gap-2 py-2 p-4">
                  <FormField control={form.control} name="name"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Tên nhân viên</FormLabel>
                        <FormControl>
                          <Input placeholder="Nhập tên nhân viên" {...field} disabled={true} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="contractId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mã hợp đồng</FormLabel>
                        <SelectOne onValueChange={(e) => { field.onChange(e); handleChangeContractId(Number(e)) }}
                          value={field.value?.toString()} disabled={isDisabled} >
                          <FormControl >
                            <SelectTrigger >
                              <SelectValue placeholder="Chọn hợp đồng để thêm nhân viên" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {

                              lstContractIds?.map((x, i) => {
                                const paddedNumber = String(x).padStart(4, '0');
                                return <SelectItem key={i} value={x.toString() ?? "0"}>{"HD-" + paddedNumber}</SelectItem>
                              })
                            }

                          </SelectContent>
                        </SelectOne>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="departmentName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên nhân viên</FormLabel>
                        <FormControl>
                          <Input placeholder="Phòng ban" {...field} disabled={true} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="positionName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vị trí</FormLabel>
                        <FormControl>
                          <Input placeholder="Chức vụ" {...field} disabled={true} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div></div>
                  <FormField control={form.control} name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} disabled={isDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Số điện thoại</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="SĐT" {...field} disabled={isDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div></div>
                  <FormField control={form.control} name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ngày sinh</FormLabel>
                        <FormControl>
                          <Input type="date"
                            placeholder="Ngày sinh"
                            disabled={true}
                            value={field.value ? field.value.toString().split('T')[0] : new Date().toString()}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="gender" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giới tính</FormLabel>
                      <FormControl>
                        <SelectOne onValueChange={(value: string) => field.onChange(Boolean(value))}
                          value={field.value?.toString()} disabled={true}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={"true"}>Nam</SelectItem>
                            <SelectItem value={"false"}>Nữ</SelectItem>
                          </SelectContent>
                        </SelectOne>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="address" render={({ field }) => (
                    <FormItem className="col-span-3">
                      <FormLabel>Địa chỉ</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={true} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="taxDeductionIds"
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormLabel>Các loại giảm trừ thuế</FormLabel>
                        <Select
                          onChange={(selectedOptions) => {
                            field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
                          }}
                          value={taxDeductionListOptions?.filter(option => field.value?.includes(option.value ?? 0))}
                          closeMenuOnSelect={false}
                          isMulti
                          options={taxDeductionListOptions}
                          isDisabled={isDisabled}
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên tài khoản</FormLabel>
                        <FormControl>
                          <Input placeholder="Tên tài khoản" {...field} disabled={isDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mật khẩu</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Mật khẩu" {...field} disabled={isDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div></div>
                  <div className="col-span-3  flex justify-between items-center">
                    <div className="flex space-x-2 justify-start sticky bottom-0 py-2 bg-white border-t">
                      <Button type="button" onClick={handleCloseForm} size='sm' className='h-8 bg-red-500'><IoMdClose className='mr-1 h-4 w-4' />Đóng </Button>
                      {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                        <Button type="button" onClick={handleSubmit} disabled={updateDataMutation.isPending} size='sm' className='h-8 bg-primary'>
                          {updateDataMutation.isPending && <LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white " />}
                          <FaSave className='mr-1 h-4 w-4' />Cập nhật
                        </Button>}
                      {
                        mode == CRUD_MODE.VIEW && <div className="space-x-2">
                          <Button type="button" size='sm' className='h-8 bg-yellow-500'>
                            {detail.typeContract == 1 ? <Link href={`/history/attendance-tracking/${detail.id}`}>
                              Xem lịch sử chấm công partime
                            </Link> :
                              <Link href={`/history/fulltime-attendance/${detail.id}`}>
                                Xem lịch sử chấm công fulltime
                              </Link>}
                          </Button>
                        </div>
                      }
                    </div>
                    <div>
                      {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                        <Button type="button" onClick={handleSubmitAndSendEmail} size='sm' className='h-8 bg-yellow-500'>
                          <MdAttachEmail className='mr-1 h-4 w-4' />Cập nhật + gửi thông tin đăng nhập mới
                        </Button>}
                    </div>
                  </div>

                </form>
              </Form>
            </div>

          </SheetContent>
        </Sheet> :
        //DELETE FORM
        <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD} >
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
              <Button className="" size='sm' onClick={handleSubmit}>Confirm</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }

    </div >
  )
}
