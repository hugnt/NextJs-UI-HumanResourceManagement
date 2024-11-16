/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { Contract, contractDefault, ContractForm, contractSchema, contractSchemaForm } from "@/data/schema/contract.schema";
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
  const { openCRUD = false, setOpenCRUD = () => { }, size = 1000, mode = CRUD_MODE.VIEW, detail = {} } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
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

  useEffect(() => {
    if (Object.keys(detail).length > 0) {
      form.reset(detail);
    }
    if (mode == CRUD_MODE.VIEW) setIsDisabled(true);
    else setIsDisabled(false);
  }, [detail, mode, openCRUD])

  //List Option
  const allowanceListOptions = listDataAllowance.data?.metadata?.map((item, i) => {
    return {
      label: `Name: ${item.name} - Amount: ${item.amount}`,
      value: item.id, // Assuming `item.id` is the identifier for each allowance
    };
  });

  const insuranceListOptions = listDataInurance.data?.metadata?.map((item, i) => {
    return {
      label: `Name: ${item.name} - Company: ${item.percentCompany}% - Employee: ${item.percentEmployee}%`,
      value: item.id, // Assuming `item.id` is the identifier for each allowance
    };
  });

  return (
    <div>
      <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD} >
        {mode != CRUD_MODE.DELETE ? <AlertDialogContent
          className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[800px] sm:max-w-[800px] !sm:w-[800px] sm:rounded-[0.3rem]`}>
          <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary'>
            <AlertDialogTitle className="text-slate-50">Contract Details</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
              <div className="p-2 text-sm space-y-3 grid grid-cols-2 gap-1" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Employee Name</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="dateOfBirth" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
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
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <Select2 onValueChange={(value) => field.onChange(Boolean(value))} defaultValue={field.value?.toString()} disabled={isDisabled}>
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
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="countrySide" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Countryside</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="nationalID" render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="nationalAddress" render={({ field }) => (
                  <FormItem>
                    <FormLabel>National ID Address</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="nationalStartDate" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of making ID</FormLabel>
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
                    <FormLabel>Education Level</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="major" render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>Major</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isDisabled} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="contractTypeId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Choose contract type</FormLabel>
                      <Select2 onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger >
                            <SelectValue placeholder="Chose contract type for this contract" />
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
                      <FormLabel>Choose contract type 2</FormLabel>
                      <FormControl>
                        <Select2 onValueChange={(value) => field.onChange(Number(value))} defaultValue={field.value?.toString()} disabled={isDisabled} >
                          <FormControl >
                            <SelectTrigger >
                              <SelectValue placeholder="Choose loại hợp đồng-2 này" />
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
                      <FormLabel>Start Date</FormLabel>
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
                      <FormLabel>End Date</FormLabel>
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
                      <FormLabel>Choose phòng ban</FormLabel>
                      <Select2 onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger >
                            <SelectValue placeholder="Choose phòng ban cho vị trí này" />
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
                      <FormLabel>Choose chức vụ</FormLabel>
                      <Select2 onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger >
                            <SelectValue placeholder="Choose chức vụ cho vị trí này" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listDataPosition.data?.metadata?.map((item, index) => {
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
                      <FormLabel>Choose lương</FormLabel>
                      <Select2 onValueChange={field.onChange} defaultValue={field.value?.toString()} disabled={isDisabled} >
                        <FormControl >
                          <SelectTrigger >
                            <SelectValue placeholder="Choose lương cho vị trí này" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {
                            listDataContractSalary.data?.metadata?.map((item, index) => {
                              return <SelectItem key={index} value={item.id?.toString() ?? "0"}>
                                Base Salary: {item.baseSalary}<br />
                                Base Insurance: {item.baseInsurance}<br />
                                Factor: {item.factor}<br />
                                Required Days: {item.requiredDays}<br />
                                Required Hours: {item.requiredHours}<br />
                                Wage Daily: {item.wageDaily}<br />
                                Wage Hourly: {item.wageHourly}<br />
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
                      <FormLabel>Choose Allowance</FormLabel>
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
                      <FormLabel>Choose Insurance</FormLabel>
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
