/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import payrollApiRequest from "@/apis/payroll.api";
import FormCRUD from "@/app/payroll/salary-history/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { PayrollHistory } from "@/data/schema/payroll.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PiTrashLight } from "react-icons/pi";
import { handleSuccessApi } from "@/lib/utils";

const pathList: Array<PathItem> = [
  {
    name: "Tính lương",
    url: "/payroll"
  },
  {
    name: "Lịch sử tổng hợp",
    url: "/payroll/salary-history"
  },
];
const currentMonth: number = new Date().getMonth() + 1;
const currenYear: number = new Date().getFullYear();
const dataFilter: Array<DataFilter> = [
  {
    columnName: 'year',
    title: 'Kì Lương',
    options: Array.from({ length: currentMonth }, (_v, i) => {
      const month = (currentMonth - i).toString().padStart(2, '0');
      return {
        label: `Tháng ${month}/${currenYear}`,
        value: `${month}/${currenYear}`
      };
    }),
  },
];
//react query key
const QUERY_KEY = {
  keyList: "salary-history",
}

export default function SalaryHistory() {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [openFormDelete, setOpenFormDelete] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => payrollApiRequest.getAllPayrollHistory(),

  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => payrollApiRequest.deletePayrollHistory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Deleted Successfully!" });
      setOpenFormDelete(false);
    }
  });
  const columnsDef: ColumnDef<PayrollHistory>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tên bảng lương' />
      ),
      cell: ({ row }) => <div className='font-semibold'>{row.getValue('name')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'year',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Kì lương' />
      ),
      cell: ({ row }) => <div>{row.original.month?.toString().padStart(2, '0') + "/" + row.original.year}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ngày/giờ lưu' />
      ),
      cell: ({ row }) => <div>{row.getValue('createdAt')}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'note',
      header: ({ column }) => (
        <DataTableColumnHeader className="ps-5" column={column} title='Ghi chú' />
      ),
      cell: ({ row }) => <div className='ps-5'>{row.getValue('note')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => <div className="flex space-x-1">
        <Button onClick={() => handleView(row)} className="h-[1.5rem]" size={"sm"}>
          <MdOutlineRemoveRedEye className='mr-2 h-4 w-4' />
          Chi tiết
        </Button>
        <Button onClick={() => handleDelete(row)} className="bg-red-500 h-[1.5rem]" size={"sm"}>
          <FaRegTrashAlt className='mr-1 h-4 w-4' />
          Xóa
        </Button>
      </div>
    },
  ];

  //ACTION HANDLER
  const handleView = async (row: Row<PayrollHistory>) => {
    const id = row.original.id;
    setSelectedId(id ?? 0);
    setOpenCRUD(true);
  };


  const handleDelete = (row: Row<PayrollHistory>) => {
    const id = row.original.id;
    setSelectedId(id ?? 0);
    setOpenFormDelete(true);
  };


  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Lịch sử tổng hợp lương</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DataTable data={listDataQuery.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="name" />
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} payrollHistoryId={selectedId} />
      <Dialog open={openFormDelete} onOpenChange={setOpenFormDelete}>
        <DialogContent className={`gap-0 top-[50%] border-none overflow-hidden p-0 w-[400px] sm:rounded-[0.3rem]`}>
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center pb-4 text-lg text-stone-700">
            Bạn có chắc chắn muốn xóa?
          </DialogDescription>
          <div className="text-center pt-8 pb-4 flex justify-center">
            <PiTrashLight size={100} color="rgb(248 113 113)" />
          </div>
          <DialogFooter className="!justify-center p-2 py-3 text-center">
            <Button onClick={() => setOpenFormDelete(false)} className="bg-gray-400  hover:bg-red-500" size='sm' >Close</Button>
            <Button className="" size='sm' onClick={()=>deleteDataMutation.mutate(selectedId)}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
};
