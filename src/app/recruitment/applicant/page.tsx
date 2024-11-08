/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import applicantApiRequest from "@/apis/candidate.api";
import FormCRUD from "@/app/recruitment/applicant/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { Candidate, candidateDefault } from "@/data/schema/candidate.schema";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Recruitment",
    url: ""
  },
  {
    name: "Applicant",
    url: "/recruitment/Applicant"
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
  keyList: "applicants",
}

export default function SampleList() {
  const [detail, setDetail] = useState<Candidate>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => applicantApiRequest.getList(),
  });

  const columnsDef: ColumnDef<Candidate>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tên vị trí' />
      ),
      cell: ({ row }) => <div className='w-[100px]'>{row.getValue('name')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='email' />
      ),
      cell: ({ row }) => <div className='w-[100px]'>{row.getValue('email')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
        accessorKey: 'phone',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title='Điện thoại' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('phone')}</div>,
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: 'fileDataStore',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='file' />
        ),
        cell: ({ row }) => <div className='w-[300px]'>{row.getValue('fileDataStore')}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'positionName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Tên vị trí' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('positionName')}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'rate',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Điểm' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('rate')}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'testName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='Bộ test' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('testName')}</div>,
        enableSorting: false,
        enableHiding: false,
      },
      {
        accessorKey: 'interviewerName',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title='người phỏng vấn' />
        ),
        cell: ({ row }) => <div className='w-[100px]'>{row.getValue('interviewerName')}</div>,
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
    setDetail(candidateDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

//   const handleView = async (row: Row<Candidate>) => {
//     const id = row.original.id;
//     setMode(CRUD_MODE.VIEW);
//     const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
//     setDetail(selectedData);
//     setOpenCRUD(true);
//   };
const handleView = async (row: Row<Candidate>) => {
    const id = row.original.id;
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id === id) ?? {};

    if (selectedData.fileDataStore) {
        const cvUrl = "https://localhost:7025/" + `${selectedData.fileDataStore.replace(/\\/g, '/')}`;
        window.open(cvUrl, '_blank');
    } else {
        console.error('CV path not found for the selected candidate.');
    }
};
  const handleEdit = (row: Row<Candidate>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<Candidate>) => {
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
          <h2 className='text-2xl font-bold tracking-tight'>Applicant list</h2>
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