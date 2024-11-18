/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/custom/button";
import { AlertDialog, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { CRUD_MODE } from "@/data/const"
import { Formula, formulaDefault, formulaSchema, SalaryComponent } from "@/data/schema/formula.schema";
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
import React, { ChangeEvent, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import formulaApiRequest from "@/apis/formula.api";
import { handleSuccessApi } from "@/lib/utils";
import { PiTrashLight } from "react-icons/pi";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IoCaretDownOutline } from "react-icons/io5";
import { FaCircleChevronRight } from "react-icons/fa6";
import { toaster } from "@/components/custom/_toast"
import { GrCircleQuestion } from "react-icons/gr";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type FormProps = {
  openCRUD: boolean,
  mode: CRUD_MODE,
  setOpenCRUD: (openCRUD: boolean) => void,
  size?: number,
  detail: Formula
}

//react query key
const QUERY_KEY = {
  keyList: "formulas",
  keyListSalaryComponent: "salaryComponents"
}

export default function FormCRUD(props: FormProps) {
  const { openCRUD = false, setOpenCRUD = () => { }, size = 1200, mode = CRUD_MODE.VIEW, detail = {} } = props;
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const [descFormula, setDescFormula] = useState<string>("[số tiền]=");
  const [selectionStart, setSelectionStart] = useState<number>(0);

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();
  const addDataMutation = useMutation({
    mutationFn: (body: Formula) => formulaApiRequest.create(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyListSalaryComponent] });
      handleSuccessApi({ message: "Thêm Mới Thành Công!" });
      setOpenCRUD(false);
    }
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number, body: Formula }) => formulaApiRequest.update(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Cập Nhật Thành Công!" });
      setOpenCRUD(false);
    }
  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => formulaApiRequest.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Xóa Thành Công!" });
      setOpenCRUD(false);
    }
  });

  const salaryComponentCategories = useQuery({
    queryKey: [QUERY_KEY.keyListSalaryComponent],
    queryFn: () => formulaApiRequest.getAllSalaryComponents(),
  });
  // #endregion

  // #region + FORM SETTINGS
  const form = useForm<Formula>({
    resolver: zodResolver(formulaSchema),
    defaultValues: formulaDefault,
  });

  const onSubmit = (data: Formula) => {
    if (mode == CRUD_MODE.ADD) addDataMutation.mutate(data);
    else if (mode == CRUD_MODE.EDIT) updateDataMutation.mutate({ id: detail.id ?? 0, body: data });
    else if (mode == CRUD_MODE.DELETE) deleteDataMutation.mutate(data.id ?? 0);
  }

  const handleCloseForm = (e: any) => {
    e.preventDefault();
    setOpenCRUD(false);
  };
  // #endregion


  // #region + CUSTOME
  const handleChangeName = (e: ChangeEvent<HTMLInputElement>) => {
    const updatedValue = "FORMULA_" + e.target.value.trim().normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .toUpperCase().replace(/[^A-Z0-9]/g, '_')
      .replace(/_{2,}/g, '_');
    form.setValue('parameterName', updatedValue);
  }

  const handleChooseParam = (sc: SalaryComponent) => {
    const updatedValue = form.getValues('fomulaDetail') + "[" + sc.parameterName + "]";
    form.setValue('fomulaDetail', updatedValue);

    const updatedDesc = descFormula + "[" + sc.name + "]"
    setDescFormula(updatedDesc)
  }

  const handleChangeFormula = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const updatedDesc = generateFormulaDesc(e.target.value)
    setDescFormula(updatedDesc)
  }
  const handleClickFormula = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSelectionStart(e.target.selectionStart)
  }

  const handleCheckFormula = () => {
    const value = form.getValues('fomulaDetail') ?? ""
    const validExpress = isValidExpression(value)
    if (!validExpress[0]) {
      toaster.error({
        title: 'Phép tính sai định dạng',
        message: validExpress[1]
      }, {
        position: "bottom-right",
        autoClose: 2000
      })
    }
    else {
      toaster.success({
        title: 'Biểu thức hợp lệ'
      }, {
        position: "top-right",
        autoClose: 1000
      })
    }
  }

  const handleClearFormula = () => {
    form.setValue('fomulaDetail', '')
    setDescFormula("[số tiền]=")
  }

  const addOperator = (operator: string) => {
    const currValue = form.getValues('fomulaDetail') ?? ""
    const updatedValue = currValue.slice(0, selectionStart) + operator + currValue.slice(selectionStart);
    form.setValue('fomulaDetail', updatedValue);
    generateFormulaDesc(updatedValue)
    setSelectionStart(updatedValue.length)
  }

  const generateFormulaDesc = (formula: string): string => {
    // const matches2Braces = formula.match(/\[.*?\]/g);
    // const isEven = matches ? matches.length % 2 === 0 : false;

    const matches = formula.match(/\[([^\]]+)\]/g);
    const lstParameterName = matches ? matches.map(match => match.slice(1, -1)) : [];
    let res = formula;
    if (!salaryComponentCategories.data?.metadata) return "ERROR!";
    for (const category of salaryComponentCategories.data?.metadata) {
      for (const component of category.listSalaryComponents) {
        if (lstParameterName.includes(component.parameterName)) {
          res = res.replace(new RegExp(`\\[${component.parameterName}\\]`, 'g'), "[" + component.name + "]");
        }
      }
    }
    return "[số tiền]=" + res

  }

  const isValidExpression = (expression: string): [boolean, string] => {
    //const validChars = /^[\s\[\]A-Z_\d+\-*/()]*$/;  // Chỉ cho phép các ký tự hợp lệ
    const validChars = /^[\s\[\]A-Z_\d+\-*/.()]*$/;
    if (!validChars.test(expression)) {
      return [false, "Biểu thức chứa ký tự không hợp lệ."];
    }

    // const regex = /^(?:\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]|\s*[-+]?\d*\.?\d+)(?:\s*[-+*/:]\s*(?:\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]|\s*[-+]?\d*\.?\d+))*$/;
    const regex = /^(?:\(\s*(?:\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]|\s*[-+]?\d*\.?\d+)(?:\s*[-+*/:]\s*(?:\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]|\s*[-+]?\d*\.?\d+))*\s*\)|\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]|\s*[-+]?\d*\.?\d+)(?:\s*[-+*/:]\s*(?:\(\s*(?:\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]|\s*[-+]?\d*\.?\d+)(?:\s*[-+*/:]\s*(?:\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]|\s*[-+]?\d*\.?\d+))*\s*\)|\[\s*[a-zA-Z_][a-zA-Z0-9_]*\s*\]|\s*[-+]?\d*\.?\d+))*$/;
    const parenthesesBalance = (str: string): boolean => {
      let balance = 0;
      for (const char of str) {
        if (char === '(') balance++;
        if (char === ')') balance--;
        if (balance < 0) return false;
      }
      return balance === 0;
    };

    if (!regex.test(expression)) {
      return [false, "Biểu thức không đúng cấu trúc."];
    }

    if (!parenthesesBalance(expression)) {
      return [false, "Dấu ngoặc đơn không hợp lệ."];
    }

    return [true, "Biểu thức hợp lệ."];
  };
  // #endregion

  useEffect(() => {
  
    if (Object.keys(detail).length > 0) {
      form.reset(detail);
      const desc = generateFormulaDesc(detail?.fomulaDetail??"");
      setDescFormula(desc);
    }
    if (mode == CRUD_MODE.VIEW) setIsDisabled(true);
    else setIsDisabled(false);
  }, [detail, mode, openCRUD])

  return (
    <div>
      <AlertDialog open={openCRUD} onOpenChange={setOpenCRUD} >
        {mode != CRUD_MODE.DELETE ? <AlertDialogContent
          className={`gap-0 top-[50%] border-none overflow-hidden p-0 sm:min-w-[1200px] sm:max-w-[${size}px] !sm:w-[${size}px] sm:rounded-[0.3rem]`}>
          <AlertDialogHeader className='flex justify-between align-middle p-2 py-1 bg-primary h-fit'>
            <AlertDialogTitle className="text-slate-50">Thêm Mới</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription />
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0 ">
              <div className="flex justify-between h-[80vh]">
                <div className="w-1/2 relative overflow-y-auto">
                  <Table className="border-collapse border-slate-300 border-[1px] ">
                    <TableCaption>Danh mục thành phần lương</TableCaption>
                    <TableHeader className="bg-slate-200 sticky top-0">
                      <TableRow>
                        <TableHead className="border-collapse border-slate-300 border-[1px]">Tên thành phần</TableHead>
                        <TableHead className="border-collapse border-slate-300 border-[1px]">Tên biến thành phần</TableHead>
                        <TableHead className=""></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {
                        salaryComponentCategories && salaryComponentCategories.data?.metadata && salaryComponentCategories.data?.metadata.map((x, i) => (
                          <Collapsible key={i} asChild>
                            <>
                              <TableRow className="">
                                <TableCell colSpan={3} className="border-collapse border-slate-300 border-[1px]">
                                  <CollapsibleTrigger asChild >
                                    <div className="flex items-center font-medium ">
                                      <IoCaretDownOutline className="me-2" /> {x.name}
                                    </div>
                                  </CollapsibleTrigger>
                                </TableCell>
                              </TableRow>

                              <CollapsibleContent asChild>
                                <>
                                  {
                                    x.listSalaryComponents.map((y, j) => (
                                      <TableRow key={j} onDoubleClick={() => handleChooseParam(y)}>
                                        <TableCell className="ps-8 border-collapse border-slate-300 border-[1px]">{y.name}</TableCell>
                                        <TableCell className="border-collapse border-slate-300 border-[1px]">{y.parameterName}</TableCell>
                                        <TableCell className="border-collapse border-slate-300 border-[1px] text-center align-middle">
                                          <FaCircleChevronRight onClick={() => handleChooseParam(y)}
                                            size={20} className="text-green-400 hover:text-green-600 hover:scale-90" />
                                        </TableCell>
                                      </TableRow>
                                    ))
                                  }
                                </>
                              </CollapsibleContent>
                            </>
                          </Collapsible>
                        )
                        )
                      }
                    </TableBody>
                  </Table>
                </div>
                <div className="p-2 text-sm space-y-3 w-1/2">
                  <FormField control={form.control} name="name"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex justify-between items-center">
                          <FormLabel>Tên Công Thức</FormLabel>
                          <DropdownMenu>
                            <DropdownMenuTrigger >
                              <GrCircleQuestion size={16} className="me-1 hover:text-primary hover:scale-110" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[500px]">
                              <DropdownMenuLabel>Quy cách đặt tên</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                  <div className="flex space-x-1">
                                    <span className="font-medium whitespace-nowrap">Lương thời gian: </span>
                                    <span className="">trong tên công thức có chứa từ 
                                      <span className="font-medium"> &quot;lương thời gian&quot;</span> 
                                    </span>
                                  </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                  <div className="flex space-x-1">
                                    <span className="font-medium whitespace-nowrap">Tổng thu nhập: </span>
                                    <span className="">trong tên công thức có chứa từ 
                                      <span className="font-medium"> &quot;tổng thu nhập&quot;</span> 
                                    </span>
                                  </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                  <div className="flex space-x-1">
                                    <span className="font-medium whitespace-nowrap">Thuế TNCN: </span>
                                    <span className="">sẽ được tự động tính toán dựa theo tổng thu nhập và các khoản giảm trừ (nếu có) </span>
                                  </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>

                        </div>
                        <FormControl>
                          <Input placeholder="Nhập tên công thức" {...field} disabled={isDisabled} onChange={(e) => { field.onChange(e); handleChangeName(e); }} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="parameterName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tham Số</FormLabel>
                        <FormControl>
                          <Input placeholder="FORMULA_<>" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="fomulaDetail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Chi Tiết Công Thức</FormLabel>
                        <FormControl>
                          <Textarea placeholder="[PARAM_BONUS_KPI10]+[PARAM_BONUS_PROJECTA]-[PARAM_DEDUCTION_LATE]"
                            {...field} disabled={isDisabled} onClick={(e:any) => handleClickFormula(e)} onChange={(e) => { field.onChange(e); handleChangeFormula(e); }} />
                        </FormControl>
                        <FormControl>
                          <div className="bg-slate-300 px-3 py-2 border border-input rounded-md">
                            <div className="mb-2 font-semibold">Diễn giải</div>
                            <textarea value={descFormula} className="bg-transparent w-full h-full focus-visible:outline-none" />
                          </div>
                        </FormControl>
                        <div className="flex justify-between">
                          <div className="space-x-1 flex items-center">
                            <Button type="button" size='sm' className="bg-yellow-100 text-black text-l" onClick={() => addOperator("+")}>+</Button>
                            <Button type="button" size='sm' className="bg-yellow-100 text-black text-lg" onClick={() => addOperator("-")}>-</Button>
                            <Button type="button" size='sm' className="bg-yellow-100 text-black text-lg" onClick={() => addOperator("*")}>*</Button>
                            <Button type="button" size='sm' className="bg-yellow-100 text-black text-lg" onClick={() => addOperator("/")}>/</Button>
                            <Button type="button" size='sm' className="bg-yellow-100 text-black text-lg" onClick={() => addOperator("(")}>(</Button>
                            <Button type="button" size='sm' className="bg-yellow-100 text-black text-lg" onClick={() => addOperator(")")}>)</Button>
                          </div>
                          <div className="space-x-1">
                            <Button type="button" size='sm' className="bg-red-500" onClick={handleClearFormula}>Xóa</Button>
                            <Button type="button" size='sm' className="bg-green-500" onClick={handleCheckFormula}>Kiểm Tra Công Thức</Button>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField control={form.control} name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ghi Chú</FormLabel>
                        <FormControl>
                          <Input placeholder="Ghi chú cho công thức" {...field} disabled={isDisabled} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <AlertDialogFooter className="p-2 py-1 bg-secondary/80 h-fit">
                <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Đóng</Button>
                {(mode === CRUD_MODE.ADD || mode === CRUD_MODE.EDIT) &&
                  <Button type="submit" size='sm'>Lưu</Button>}
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
            Bạn có chắc chắn muốn xóa bản ghi này?
            </AlertDialogDescription>
            <AlertDialogFooter className="!justify-center p-2 py-3 text-center">
              <Button onClick={handleCloseForm} className="bg-gray-400  hover:bg-red-500" size='sm' >Đóng</Button>
              <Button className="" size='sm' onClick={() => onSubmit(detail)}>Xác nhận</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        }
      </AlertDialog>
    </div>
  )
}
