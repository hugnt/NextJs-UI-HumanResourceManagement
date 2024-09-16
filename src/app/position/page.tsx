/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import positionApiRequest from "@/apis/position.api";
import FormCRUD from "@/app/position/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { Position, positionDefault } from "@/data/schema/position.schema";
import { handleSuccessApi } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Employee",
    url: "/Employee"
  },
  {
    name: "Position",
    url: "/Employee/Position"
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
  keyList: "positions",
}

export default function SampleList() {
  const [detail, setDetail] = useState<Position>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  // #region +TANSTACK QUERY
  const queryClient = useQueryClient();

  const dataList = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => positionApiRequest.getList(),
  });

  const addDataMutation = useMutation({
    mutationFn: (body: Position) => {
      return positionApiRequest.create(body);
    },
    onSuccess: (_, variables) => {
      const newData = variables;
      queryClient.setQueryData([QUERY_KEY.keyList], (oldData: any) => {
        if (!oldData) return { metadata: [newData] }; // Initialize if no old data
        // Lấy id lớn nhất từ metadata
        const maxId = Math.max(...oldData.metadata.map((item: { id: any; }) => item.id), 0);
        newData.id = maxId + 1; // Gán id mới cho newData
        return {
          ...oldData,
          metadata: [...oldData.metadata, newData], // Correctly spread old metadata
        };
      });
      setDetail(newData);
      setMode(CRUD_MODE.VIEW);
      handleSuccessApi({ message: "Inserted Successfully!" });
    }
  });

  const updateDataMutation = useMutation({
    mutationFn: ({ id, body }: { id: number, body: Position }) => {
      return positionApiRequest.update(id, body)
    },
    onSuccess: (_, variables) => {
      const { id, body } = variables;
      queryClient.setQueryData([QUERY_KEY.keyList], (oldData: any) => {
        if (!oldData) return { metadata: [] }; // Handle case where old data doesn't exist
        return {
          ...oldData,
          metadata: oldData.metadata.map((item: { id: number; }) =>
            item.id === id ? { ...item, ...body } : item // Update the specific item
          ),
        };
      });
      setDetail(body);
      setMode(CRUD_MODE.VIEW);
      handleSuccessApi({ message: "Updated Successfully!" });
    }
  });

  const deleteDataMutation = useMutation({
    mutationFn: (id: number) => positionApiRequest.delete(id),
    onSuccess: (_, id) => {
      queryClient.setQueryData([QUERY_KEY.keyList], (oldData: any) => {
        if (!oldData) return { metadata: [] };
        return {
          ...oldData,
          metadata: oldData.metadata.filter((item: { id: number; }) => item.id !== id),
        };
      });
      setMode(CRUD_MODE.NO_ACTION);
      handleSuccessApi({ message: "Deleted Successfully!" });
      setOpenCRUD(false);
    }
  });
  // #endregion

  const columnsDef: ColumnDef<Position>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='ID' />
      ),
      cell: ({ row }) => <div className='w-[3px] text-center'>{row.getValue('id')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Full name' />
      ),
      cell: ({ row }) => <div className='w-[200px]'>{row.getValue('name')}</div>,
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
    setDetail(positionDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

  const handleView = async (row: Row<Position>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = dataList.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleEdit = (row: Row<Position>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = dataList.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<Position>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.DELETE);
    const selectedData = dataList.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  //Save
  const handleSave = (data: Position) => {
    if (mode == CRUD_MODE.ADD) addDataMutation.mutate(data);
    else if (mode == CRUD_MODE.EDIT) updateDataMutation.mutate({ id: data.id ?? 0, body: data });
    else if (mode == CRUD_MODE.DELETE) deleteDataMutation.mutate(data.id ?? 0);
  }

  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Position list</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DataTable data={dataList.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="name" handleAddNew={handleAddNew} />
      </div>

      <FormCRUD open={openCRUD} setOpen={setOpenCRUD} mode={mode} detail={detail} handleSave={handleSave} />
    </>
  )
};
