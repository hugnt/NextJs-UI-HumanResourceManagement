/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import contractSalaryApiRequest from "@/apis/contractSalary.api";
import FormCRUD from "@/app/contractSalary/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { ContractSalary, contractSalaryDefault } from "@/data/schema/contractSalary.schema";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Employee",
    url: "/Employee"
  },
  {
    name: "ContractSalary",
    url: "/Employee/ContractSalary"
  },
];

//Filter by
const dataFilter: Array<DataFilter> = [
  {
    columnName: 'name',
    title: 'Name',
    options: [
      {
        label: 'Start with W',
        value: 'W'
      },
      {
        label: 'Start with H',
        value: 'H'
      }
    ],
  },
];

//react query key
const QUERY_KEY = {
  keyList: "contractSalarys",
}

export default function SampleList() {
  const [detail, setDetail] = useState<ContractSalary>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => contractSalaryApiRequest.getList(),
  });

  const columnsDef: ColumnDef<ContractSalary>[] = [
    {
        accessorKey: 'baseSalary',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Base Salary' />
        ),
        cell: ({ row }) => <div className='w-[150px]'>{row.getValue('baseSalary')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'baseInsurance',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Base Insurance' />
        ),
        cell: ({ row }) => <div className='w-[150px]'>{row.getValue('baseInsurance')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'requiredDays',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Required Days' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('requiredDays')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'requiredHours',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Required Hours' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('requiredHours')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'wageDaily',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Wage Daily' />
        ),
        cell: ({ row }) => <div className='w-[150px]'>{row.getValue('wageDaily')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'wageHourly',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Wage Hourly' />
        ),
        cell: ({ row }) => <div className='w-[150px]'>{row.getValue('wageHourly')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'factor',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Factor' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('factor')}</div>,
        enableSorting: true,
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
    setDetail(contractSalaryDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

  const handleView = async (row: Row<ContractSalary>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleEdit = (row: Row<ContractSalary>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<ContractSalary>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.DELETE);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };


  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Contract Salary List</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DataTable data={listDataQuery.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="name">
          <Button onClick={handleAddNew} variant='outline' size='sm'  className='ml-auto hidden h-8 lg:flex me-2 bg-primary text-white'>
            <IconPlus className='mr-2 h-4 w-4' />Add new
          </Button>
          
        </DataTable>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  )
};
