/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { Contract, contractDefault, ContractForm, contractSchemaForm } from "@/data/schema/contract.schema";
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
import contractApiRequest from "@/apis/contract.api";
import { handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import contractTypeApiRequest from '@/apis/contractType.api';
import { Select as Select2, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import contractSalaryApiRequest from "@/apis/contractSalary.api";
import departmentApiRequest from "@/apis/department.api";
import positionApiRequest from "@/apis/position.api";
import allowanceApiRequest from "@/apis/allowance.api";
import insuranceApiRequest from "@/apis/insurance.api";
import Select from 'react-select';
import { FaFilePdf } from "react-icons/fa";
import envConfig from "@/config";
import LoadingSpinIcon from "@/components/loading-spin-icon";
import { Position } from "@/data/schema/position.schema";
type FormProps = {
  openCRUD: boolean,
  mode: CRUD_MODE,
  setOpenCRUD: (openCRUD: boolean) => void,
  size?: number,
  detail: Contract
}

//react query key
const QUERY_KEY = {
  keyList: "contracts",
  keySubContractType: "contractTypes",
  keySubDepartment: "departments",
  keySubPosition: "positions",
  keySubContractSalary: "contractSalarys",
  keySubAllowance: "allowances",
  keySubInsurance: "insurances",
}

export default function FormCRUD(props: FormProps) {
  const { openCRUD = false, setOpenCRUD = () => { }, mode = CRUD_MODE.VIEW, detail = {} } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [openPDF, setOpenPDF] = useState<boolean>(false);
  const [positionList, setPositionList] = useState<Position[]>([]);
  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const addDataMutation = useMutation({
    mutationFn: (body: Contract) => contractApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Inserted Successfully!" });
      setOpenCRUD(false);
    }
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number, body: Contract }) => contractApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Updated Successfully!" });
      setOpenCRUD(false);
    }
  });

  const generateContractDataMutation = useMutation({
    mutationFn: ({ id }: { id: number }) => contractApiRequest.generateContractPDF(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Cập nhật bản mềm thành công!" });
      setOpenPDF(false);
      setOpenCRUD(false);
    }
  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => contractApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Deleted Successfully!" });
      setOpenCRUD(false);
    }
  });

  //List data
  const listDataContractType = useQuery({
    queryKey: [QUERY_KEY.keySubContractType],
    queryFn: () => contractTypeApiRequest.getList()
  });
  const listDataDepartment = useQuery({
    queryKey: [QUERY_KEY.keySubDepartment],
    queryFn: () => departmentApiRequest.getList()
  });
  const listDataPosition = useQuery({
    queryKey: [QUERY_KEY.keySubPosition],
    queryFn: () => positionApiRequest.getList()
  });
  const listDataContractSalary = useQuery({
    queryKey: [QUERY_KEY.keySubContractSalary],
    queryFn: () => contractSalaryApiRequest.getList()
  });
  const listDataAllowance = useQuery({
    queryKey: [QUERY_KEY.keySubAllowance],
    queryFn: () => allowanceApiRequest.getList()
  });
  const listDataInurance = useQuery({
    queryKey: [QUERY_KEY.keySubInsurance],
    queryFn: () => insuranceApiRequest.getList()
  });

  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<ContractForm>({
    resolver: zodResolver(contractSchemaForm),
    defaultValues: contractDefault,
  });

  const onSubmit = (data: ContractForm) => {
    if (mode == CRUD_MODE.ADD) addDataMutation.mutate(data);
    else if (mode == CRUD_MODE.EDIT) updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
    else if (mode == CRUD_MODE.DELETE) deleteDataMutation.mutate(data.id ?? 0);
  }

  const handleCloseForm = (e: any) => {
    e.preventDefault();
    setOpenCRUD(false);
  };
  // #endregion

  const handleChangeDepartmentId = (departmentId: number) => {
    const lstSelectedPosition = listDataPosition.data?.metadata?.filter(x => x.departmentId == departmentId) ?? [];
    setPositionList(lstSelectedPosition);
  }

  useEffect(() => {
    const allPossition =  listDataPosition.data?.metadata??[];
    setPositionList(allPossition);
    if (Object.keys(detail).length > 0) {
      form.reset(detail);
    }
    if (mode == CRUD_MODE.VIEW) setIsDisabled(true);
    else setIsDisabled(false);
  }, [detail, mode, openCRUD])

  //List Option
  const allowanceListOptions = listDataAllowance.data?.metadata?.map((item) => {
    return {
      label: `Tên loại: ${item.name} - Định mức: ${item.amount}`,
      value: item.id, // Assuming `item.id` is the identifier for each allowance
    };
  });

  const insuranceListOptions = listDataInurance.data?.metadata?.map((item) => {
    return {
      label: `Tên loại: ${item.name} - Cty: ${item.percentCompany}% - NLĐ: ${item.percentEmployee}%`,
      value: item.id, // Assuming `item.id` is the identifier for each allowance
    };
  });

  return (
    <div>
      <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD} >
        {mode != CRUD_MODE.DELETE ? <AlertDialogContent
          className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[800px] sm:max-w-[800px] !sm:w-[800px] sm:rounded-[0.3rem]`}>
          <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
            <AlertDialogTitle className="text-slate-50">Chi tiết hợp đồng</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <div className="p-2 text-sm space-y-3 grid grid-cols-2 gap-1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Tên nhân viên</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <Input type="date"
                        onChange={field.onChange}
                        value={field.value ? field.value.toString().split('T')[0] : new Date().toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="gender" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <Select2 onValueChange={(value) => field.onChange(Boolean(value))} value={field.value?.toString()} disabled={isDisabled}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={"true"}>Male</SelectItem>
                          <SelectItem value={"false"}>Female</SelectItem>
                        </SelectContent>
                      </Select2>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="address" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="countrySide" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quê quán</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="nationalID" render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCCD</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="nationalAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nơi cấp</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="nationalStartDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày cấp</FormLabel>
                    <FormControl>
                      <Input type="date"
                        onChange={field.onChange}
                        value={field.value ? field.value.toString().split('T')[0] : new Date().toString()}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="level" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trình độ học vấn</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="major" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Chuyên ngành</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="contractTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại hợp đồng</FormLabel>
                      <Select2 onValueChange={field.onChange} value={field.value?.toString()} disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger >
                            <SelectValue placeholder="Chọn loại hợp đồng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listDataContractType.data?.metadata?.map((item, index) => {
                              return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                            })
                          }
                        </SelectContent>
                      </Select2>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="typeContract"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại nhân viên</FormLabel>
                      <FormControl>
                        <Select2 onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()} disabled={isDisabled} >
                          <FormControl >
                            <SelectTrigger >
                              <SelectValue placeholder="Chọn loại nhân viên" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value={"1"}>
                              Partime
                            </SelectItem>
                            <SelectItem value={"2"}>
                              Fulltime
                            </SelectItem>
                          </SelectContent>
                        </Select2>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày bắt đầu</FormLabel>
                      <FormControl>
                        <Input type="date"
                          onChange={field.onChange}
                          value={field.value ? field.value.toString().split('T')[0] : new Date().toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField control={form.control} name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ngày kết thúc</FormLabel>
                      <FormControl>
                        <Input type="date"
                          onChange={field.onChange}
                          value={field.value ? field.value.toString().split('T')[0] : new Date().toString()}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="departmentId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phòng ban</FormLabel>
                      <Select2 onValueChange={(e) => { field.onChange(e); handleChangeDepartmentId(Number(e)) }} value={field.value?.toString()} disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger >
                            <SelectValue placeholder="Chọn phòng ban" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listDataDepartment.data?.metadata?.map((item, index) => {
                              return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                            })
                          }
                        </SelectContent>
                      </Select2>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="positionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Chức vụ</FormLabel>
                      <Select2 onValueChange={field.onChange} value={field.value?.toString()} disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger >
                            <SelectValue placeholder="Chọn chức vị" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            positionList?.map((item, index) => {
                              return <SelectItem key={index} value={item.id?.toString() ?? "0"}>{item.name}</SelectItem>
                            })
                          }
                        </SelectContent>
                      </Select2>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contractSalaryId"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Quy định lương</FormLabel>
                      <Select2 onValueChange={field.onChange} value={field.value?.toString()} disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger >
                            <SelectValue placeholder="Chọn quy định lương cho nhân viên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listDataContractSalary.data?.metadata?.map((item, index) => {
                              return <SelectItem key={index} value={item.id?.toString() ?? "0"}>
                                Lương CB: {item.baseSalary}<br />
                                Mức đóng BH: {item.baseInsurance}<br />
                                Hệ số: {item.factor}<br />
                                Số giờ quy định: {item.requiredHours}<br />
                                Số công (theo giờ): {item.wageHourly}/h<br />
                              </SelectItem>
                            })
                          }
                        </SelectContent>
                      </Select2>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allowanceIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Các loại phụ cấp</FormLabel>
                      <Select
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
                        }}
                        value={allowanceListOptions?.filter(option => field.value?.includes(option.value ?? 0))}
                        closeMenuOnSelect={false}
                        isMulti
                        options={allowanceListOptions}
                        isDisabled={isDisabled}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="insuranceIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Các loại BH</FormLabel>
                      <Select
                        onChange={(selectedOptions) => {
                          field.onChange(selectedOptions ? selectedOptions.map(option => option.value) : []);
                        }}
                        value={insuranceListOptions?.filter(option => field.value?.includes(option.value ?? 0))}
                        closeMenuOnSelect={false}
                        isMulti
                        options={insuranceListOptions}
                        isDisabled={isDisabled}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <AlertDialogFooter className="flex !justify-between p-2 py-1 bg-secondary/80">
                <div>
                  {(mode === CRUD_MODE.VIEW || mode === CRUD_MODE.EDIT) &&
                    <Button type="button" onClick={() => setOpenPDF(true)} className="bg-yellow-400  hover:bg-yellow-500" size='sm' >
                      <FaFilePdf className="me-1" /> Xem bản mềm
                    </Button>}
                </div>
                <div className="space-x-1">
                  <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
                  {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                    <Button type="submit" size='sm'>Save</Button>}
                </div>
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

      <AlertDialog open={openPDF} onOpenChange={setOpenPDF} >
        <AlertDialogContent
          className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[800px] sm:max-w-[800px] !sm:w-[800px] sm:rounded-[0.3rem]`}>
          <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
            <AlertDialogTitle className="text-slate-50">Hợp đồng PDF</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <iframe src={`${envConfig.NEXT_PUBLIC_API_HOST}/Contract/${detail.fireUrlBase}`} className="w-full h-[70vh]" />
          <AlertDialogFooter className="flex !justify-between p-2 py-1 bg-secondary/80">
            {detail.id != 0 && <Button onClick={() => generateContractDataMutation.mutate({ id: detail.id ?? 0 })}
              className="bg-green-400  hover:bg-green-500" size='sm'>
              {(generateContractDataMutation.isPending || generateContractDataMutation.isPending) && <LoadingSpinIcon className="w-[22px] h-[22px] !border-[4px] !border-t-white " />}
              Tạo mới
            </Button>}
            <Button onClick={() => setOpenPDF(false)} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
