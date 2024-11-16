/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import taxDeductionApiRequest from "@/apis/taxDeduction.api";
import FormCRUD from "@/app/salary-components/tax-deduction/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { TaxDeduction, taxDeductionDefault } from "@/data/schema/taxDeduction.schema";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Thành Phần Lương",
    url: "/salary-components"
  },
  {
    name: "Khấu Trừ Thuế",
    url: "/salary-components/tax-deduction"
  },
];

//Filter by
const dataFilter: Array<DataFilter> = [
  {
    columnName: 'fomulaType',
    title: 'Type',
    options: [
      {
        label: 'Type 1',
        value: '1'
      },
      {
        label: 'Type 2',
        value: '2'
      },
      {
        label: 'Type 3',
        value: '3'
      },
    ],
  },
];

//react query key
const QUERY_KEY = {
  keyList: "taxDeductions",
}

export default function SampleList() {
  const [detail, setDetail] = useState<TaxDeduction>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => taxDeductionApiRequest.getList(),
  });

  const columnsDef: ColumnDef<TaxDeduction>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tên Khấu Trừ Thuế' />
      ),
      cell: ({ row }) => <div className='w-[150px]'>{row.getValue('name')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'parameterName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tham số' />
      ),
      cell: ({ row }) => <div className='font-semibold italic'>{row.getValue('parameterName')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'fomulaType',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Loại' />
      ),
      cell: ({ row }) => <div className='font-semibold'>{row.getValue('fomulaType')}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: 'terms',
      header: ({ column }) => (
        <DataTableColumnHeader className="ps-5" column={column} title='Điều Khoản' />
      ),
      cell: ({ row }) => <div className='ps-5'>{row.getValue('terms')}</div>,
      enableSorting: false,
      enableHiding: true,
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
    setDetail(taxDeductionDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

  const handleView = async (row: Row<TaxDeduction>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleEdit = (row: Row<TaxDeduction>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<TaxDeduction>) => {
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
          <h2 className='text-2xl font-bold tracking-tight'>Danh Sách Khấu Trừ Thuế</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DataTable data={listDataQuery.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="name">
          <Button onClick={handleAddNew} variant='outline' size='sm'  className='ml-auto hidden h-8 lg:flex me-2 bg-primary text-white'>
            <IconPlus className='mr-2 h-4 w-4' />Thêm Mới
          </Button>
          
        </DataTable>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  )
};
