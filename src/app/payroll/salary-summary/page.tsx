/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import advanceApiRequest from "@/apis/advance.api";
import FormCRUD from "@/app/payroll/salary-advance/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DatePickerRange } from "@/components/custom/date-picker-range";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CRUD_MODE } from "@/data/const";
import { Advance, advanceDefault } from "@/data/schema/advance.schema";
import { IconClearFormatting, IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Salary components",
    url: ""
  },
  {
    name: "Payroll Calculation",
    url: "/salary-components/payroll-calculation"
  },
];
const currentMonth: number = new Date().getMonth() + 1;
const currenYear: number = new Date().getFullYear();
//Filter by
const dataFilter: Array<DataFilter> = [
  {
    columnName: 'payPeriod',
    title: 'Kì Lương',
    options: Array.from({ length: currentMonth }, (v, i) => {
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
  keyList: "advances",
}

export default function SalarySummaryList() {
  const [detail, setDetail] = useState<Advance>(advanceDefault);
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);
  const currentMonth: number = new Date().getMonth() + 1;
  const currenYear: number = new Date().getFullYear();

  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => advanceApiRequest.getList(),
  });

  const columnsDef: ColumnDef<Advance>[] = [
    {
      accessorKey: 'employeeName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Employee Name' />
      ),
      cell: ({ row }) => <div className='w-[200px]'>{row.getValue('employeeName')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'payPeriod',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Period' />
      ),
      cell: ({ row }) => <div className='w-[100px]'>{row.getValue('payPeriod')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'amount',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Amount' />
      ),
      cell: ({ row }) => <div className='w-[200px]'>{row.getValue('amount')}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'statusName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => <div className='w-[100px]'>{row.getValue('statusName')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => <DataTableRowActions row={row}
        handleView={() => handleView(row)}
        handleEdit={() => handleEdit(row)}
        handleDelete={() => handleDelete(row)} />,
    },
  ];

  //ACTION HANDLER
  const handleAddNew = () => {
    setDetail(advanceDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

  const handleView = async (row: Row<Advance>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? advanceDefault;
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleEdit = (row: Row<Advance>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? advanceDefault;
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<Advance>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.DELETE);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? advanceDefault;
    setDetail(selectedData);
    setOpenCRUD(true);
  };


  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Payroll Calculation</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>
      <div className="flex justify-between space-x-2">
        <div className="flex space-x-2">
          <DatePickerRange />
          <Select>
            <SelectTrigger className="w-[140px] h-8">
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
          <Button variant='outline' size='sm' className='bg-primary ml-auto hidden h-8 lg:flex text-white'>
            <IconSearch className='h-4 w-4 me-1' />Lọc
          </Button>
        </div>
        <div className="flex space-x-1 justify-end">
          <Button variant='outline' size='sm' className='bg-green-500 ml-auto hidden h-8 lg:flex text-white'>
            <IconRefresh className='mr-2 h-4 w-4' />Sync
          </Button>
          <Button variant='outline' size='sm' className='bg-gray-500 ml-auto hidden h-8 lg:flex text-white'>
            <IconPlus className='h-4 w-4 mr-2' />Thêm khoản khác
          </Button>
          <Button variant='outline' size='sm' className='bg-yellow-500 ml-auto hidden h-8 lg:flex text-white'>
            <IconClearFormatting className='h-4 w-4 mr-2' />Cập nhật công thức
          </Button>
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DataTable data={listDataQuery.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="employeeName">

          <Button onClick={handleAddNew} variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex me-2 bg-primary text-white'>
            <IconPlus className='mr-2 h-4 w-4' />Thêm nhân viên
          </Button>
        </DataTable>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  )
};
