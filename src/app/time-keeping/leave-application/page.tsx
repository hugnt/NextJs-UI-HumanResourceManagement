/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import leaveApplicationApiRequest from "@/apis/leaveApplication.api";
import FormCRUD from "@/app/time-keeping/leave-application/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";
import { CRUD_MODE } from "@/data/const";
import { leaveApplication } from "@/data/schema/leaveApplication.schema";
import { DataFilter } from "@/components/data-table/data-table-toolbar";

const pathList: Array<PathItem> = [
  {
    name: "Time keeping",
    url: "/time-keeping"
  },
  {
    name: "Leave applications",
    url: "/time-keeping/leave-applications"
  },
];

const dataFilter: Array<DataFilter> = [
  {
    columnName: 'statusLeave',
    title: 'Status Leave',
    options: [
      {
        label: 'Draft',
        value: '1'
      },
      {
        label: 'Approved',
        value: '2'
      },
      {
        label: 'Refuse',
        value: '3'
      }
    ],
  },
];

export default function LeaveApplicationList() {
  const [detail, setDetail] = useState<leaveApplication>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const listDataQuery = useQuery({
    queryKey: ["leave-application"],
    queryFn: () => leaveApplicationApiRequest.getList(),
  });

  const columnsDef: ColumnDef<leaveApplication>[] = [
    {
      accessorKey: 'employeeId',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Employee ID' />
      ),
      cell: ({ row }) => <div>{row.getValue('employeeId')}</div>,
    },
    {
      accessorKey: 'timeLeave',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Time Leave' />
      ),
      cell: ({ row }) => <div>{row.getValue('timeLeave')}</div>,
    },
    {
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Description' />
      ),
      cell: ({ row }) => <div>{row.getValue('description')}</div>,
    },
    {
      accessorKey: 'statusLeave',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status Leave' />
      ),
      cell: ({ row }) => <div>{row.getValue('statusLeave')}</div>,
    },
    {
      accessorKey: 'replyMessage',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Reply Message' />
      ),
      cell: ({ row }) => <div>{row.getValue('replyMessage')}</div>,
    },
    {
      accessorKey: 'refuseReason',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Refuse Reason' />
      ),
      cell: ({ row }) => <div>{row.getValue('refuseReason')}</div>,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          handleView={() => handleView(row)}
          handleEdit={() => handleEdit(row)}
          handleDelete={() => handleDelete(row)}
        />
      ),
    },
  ];

  // ACTION HANDLER
  const handleAddNew = () => {
    setDetail({});
    setMode(CRUD_MODE.ADD);
    setOpenCRUD(true);
  };

  const handleView = (row: Row<leaveApplication>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id === id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleEdit = (row: Row<leaveApplication>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id === id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<leaveApplication>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.DELETE);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id === id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Leave Application List</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
        <Button onClick={handleAddNew} variant='outline' size='sm' className='bg-primary text-white'>
          Add New
        </Button>
      </div>

      <div className='overflow-auto'>
        <DataTable data={listDataQuery.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="name" />
      </div>

      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  );
}