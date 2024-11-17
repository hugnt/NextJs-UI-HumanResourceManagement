/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import advanceApiRequest from "@/apis/advance.api";
import FormCRUD from "@/app/payroll/salary-advance/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { Advance, advanceDefault } from "@/data/schema/advance.schema";
import { IconPlus } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge";
import { FaCheck } from "react-icons/fa";
import { MdOutlineCancel } from "react-icons/md";
import { handleSuccessApi } from "@/lib/utils";
import { FaRegTrashAlt } from "react-icons/fa";
import { GrCircleQuestion } from "react-icons/gr";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


const pathList: Array<PathItem> = [
  {
    name: "Salary components",
    url: ""
  },
  {
    name: "Advance",
    url: "/salary-components/advance"
  },
];
const currentMonth: number = new Date().getMonth() + 1;
const currenYear: number = new Date().getFullYear();
//Filter by
const dataFilter: Array<DataFilter> = [
  {
    columnName: 'payPeriod',
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
  keyList: "advances",
  keyListByEmployee:"advances-employee"
}

export default function AdvanceList() {
  const [detail, setDetail] = useState<Advance>(advanceDefault);
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const role = 0;
  const employeeId = 2;

  const queryClient = useQueryClient();
  const listDataQuery = useQuery({
    queryKey: role===0?[QUERY_KEY.keyList]:[QUERY_KEY.keyListByEmployee,employeeId],
    queryFn: () => {
      return role===0?advanceApiRequest.getList():advanceApiRequest.getListByEmployee(employeeId)
    },
  });

  const updateDataStatus = useMutation({
    mutationFn: ({ id, status }: { id: number, status: number }) => advanceApiRequest.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.keyList] })
      handleSuccessApi({ message: "Updated status Successfully!" });
      setOpenCRUD(false);
    }
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
      cell: ({ row }) => <div className='w-[100px]'>{`${row.original.month}/${row.original.year}`}</div>,
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
      cell: ({ row }) => <div className='w-[100px]'>
        <Badge className="py-0 px-2">
          {row.getValue('statusName')}
        </Badge>
      </div>,
      enableSorting: false,
      enableHiding: false,
    }
  ];
  const columnsDefPendingAdmin: ColumnDef<Advance>[] = [
    ...columnsDef,
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => <div className="flex space-x-1">
        <Button onClick={() => handleUpdateStatus(row, 1)} className="h-[1.5rem]" size={"sm"}>
          <FaCheck className='mr-2 h-3 w-3' />
          Duyệt
        </Button>
        <Button onClick={() => handleUpdateStatus(row, 2)} className="bg-red-500 h-[1.5rem]" size={"sm"}>
          <MdOutlineCancel className='mr-1 h-4 w-4' />
          Từ chối
        </Button>
      </div>,
    }
  ];
  const columnsDefPendingEmployee: ColumnDef<Advance>[] = [
    ...columnsDef,
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => <DataTableRowActions row={row}
        handleView={() => handleView(row)}
        handleEdit={() => handleEdit(row)}
        handleDelete={() => handleDelete(row)} />,
    }
  ];
  const columnsDefConfirm: ColumnDef<Advance>[] = [
    ...columnsDef,
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) => <Button onClick={() => handleUpdateStatus(row, 0)} className="bg-yellow-500 h-[1.5rem]" size={"sm"}>
        <MdOutlineCancel className='mr-1 h-4 w-4' />
        Hủy
      </Button>,
    }
  ];
  const columnsDefRefused: ColumnDef<Advance>[] = [
    ...columnsDef,
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Action' />
      ),
      cell: ({ row }) =>
        <Button className="bg-red-500 h-[1.5rem]" onClick={() => handleDelete(row)} size={"sm"}>
          <FaRegTrashAlt className='mr-1 h-4 w-4' />
          Xóa
        </Button>
    }
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

  //ACTION HANDLER
  const handleUpdateStatus = (row: Row<Advance>, status: number) => {
    const id = row.original.id;
    if (id) updateDataStatus.mutate({ id, status });
  };
  return (
    <>
      <div className='mb-2 flex items-center justify-between space-y-2'>
        <div>
          <h2 className='text-2xl font-bold tracking-tight'>Advance list</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <Tabs defaultValue="pendding" className="">
          <TabsList>
            <TabsTrigger value="pendding">
              Chờ duyệt
              <Badge className="ms-1 py-0 px-2 bg-yellow-500">{listDataQuery.data?.metadata?.filter(x => x.status == 0)?.length ?? 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="approved">
              Đã duyệt
              <Badge className="ms-1 py-0 px-2">{listDataQuery.data?.metadata?.filter(x => x.status == 1)?.length ?? 0}</Badge>
            </TabsTrigger>
            <TabsTrigger value="refused">
              Từ chối
              <Badge className="ms-1 py-0 px-2 bg-red-500">{listDataQuery.data?.metadata?.filter(x => x.status == 2)?.length ?? 0}</Badge>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="pendding">
            <DataTable data={listDataQuery.data?.metadata?.filter(x => x.status == 0) ?? []} columns={role === 0 ? columnsDefPendingAdmin : columnsDefPendingEmployee} filters={dataFilter} searchField="employeeName">
              <DropdownMenu>
                <DropdownMenuTrigger >
                  <Button  variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex me-2 bg-yellow-500'>
                    <GrCircleQuestion size={18} className=" hover:text-primary hover:scale-110 text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[500px]">
                  <DropdownMenuLabel>Quy định ứng lương</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <div><span className="font-semibold italic">Mỗi nhân viên</span> chỉ được phép ứng lương tối đa 2 lần trong một kì lương</div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div><span className="font-semibold italic">Số lương ứng tối đa</span> không được phép vượt quá 70% lương thời gian nhận được ở thời điểm hiện tại</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleAddNew} variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex me-2 bg-primary text-white'>
                <IconPlus className='mr-2 h-4 w-4' />Add new
              </Button>
            </DataTable>
          </TabsContent>
          <TabsContent value="approved">
            <DataTable data={listDataQuery.data?.metadata?.filter(x => x.status == 1) ?? []} columns={role === 0 ? columnsDefConfirm : columnsDef} filters={dataFilter} searchField="employeeName" />
          </TabsContent>
          <TabsContent value="refused">
            <DataTable data={listDataQuery.data?.metadata?.filter(x => x.status == 2) ?? []} columns={role === 0 ? columnsDefRefused : columnsDef} filters={dataFilter} searchField="employeeName" />
          </TabsContent>
        </Tabs>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  )
};
