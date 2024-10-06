/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import insuranceApiRequest from "@/apis/insurance.api";
import FormCRUD from "@/app/contract/insurance/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { Insurance, insuranceDefault } from "@/data/schema/insurance.schema";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Contract",
    url: ""
  },
  {
    name: "Insurance",
    url: "/Contract/Insurance"
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
  keyList: "insurances",
}

export default function InsuranceList() {
  const [detail, setDetail] = useState<Insurance>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => insuranceApiRequest.getList(),
  });

  const columnsDef: ColumnDef<Insurance>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Insurance name' />
      ),
      cell: ({ row }) => <div className='w-[200px]'>{row.getValue('name')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
        accessorKey: 'percentEmployee',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Percent of Employee' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('percentEmployee')}</div>,
        enableSorting: true,
        enableHiding: false,
    },
    {
        accessorKey: 'percentCompany',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Percent of Company' />
        ),
        cell: ({ row }) => <div className='w-[200px]'>{row.getValue('percentCompany')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'parameterName',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Parameter Name' />
        ),
        cell: ({ row }) => <div className='w-[200px]'>{row.getValue('parameterName')}</div>,
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
    setDetail(insuranceDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

  const handleView = async (row: Row<Insurance>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleEdit = (row: Row<Insurance>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<Insurance>) => {
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
          <h2 className='text-2xl font-bold tracking-tight'>Insurance List</h2>
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
