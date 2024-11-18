/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import employeeApiRequest from "@/apis/employee.api";
import FormCRUD from "@/app/company/employee-list/form-crud";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import { DataTable, DataTableColumnHeader, DataTableRowActions } from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { Employee, employeeDefault } from "@/data/schema/employee.schema";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useEffect, useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Company",
    url: "/company"
  },
  {
    name: "Employee List",
    url: "/company/employee-list"
  },
];

//react query key
const QUERY_KEY = {
  keyList: "employee-list",
}

export default function EmployeeList() {
  const [dataFilter, setDataFilter] = useState<Array<DataFilter>>([]);
  const [detail, setDetail] = useState<Employee>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => employeeApiRequest.getList(),

  });

  useEffect(() => {
    if(!listDataQuery.data) return;
    const lstDepartment = listDataQuery.data.metadata?.map(x => x.departmentName) ?? [];
    const lstPosition = listDataQuery.data.metadata?.map(x => x.positionName) ?? [];
    const lstDataFilter: Array<DataFilter> = [
      {
        columnName: 'departmentName',
        title: 'Phòng ban',
        options: lstDepartment.map(x => ({
          label: x ?? "",
          value: x ?? ""
        })),
      },
      {
        columnName: 'positionName',
        title: 'Chức vụ',
        options: lstPosition.map(x => ({
          label: x ?? "",
          value: x ?? ""
        })),
      },
    ];
    setDataFilter(lstDataFilter);
  }, [listDataQuery.data])


  const columnsDef: ColumnDef<Employee>[] = [
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Tên nhân viên' />
      ),
      cell: ({ row }) => <div className='w-[150px] font-semibold'>{row.getValue('name')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'departmentName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Phòng ban' />
      ),
      cell: ({ row }) => <div>{row.getValue('departmentName')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'positionName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Chức vụ' />
      ),
      cell: ({ row }) => <div>{row.getValue('positionName')}</div>,
      enableSorting: true,
      enableHiding: false,
    },
    {
      accessorKey: 'phoneNumber',
      header: ({ column }) => (
        <DataTableColumnHeader className="ps-5" column={column} title='SĐT' />
      ),
      cell: ({ row }) => <div className='ps-5'>{row.getValue('phoneNumber')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader className="ps-5" column={column} title='Email' />
      ),
      cell: ({ row }) => <div className='ps-5'>{row.getValue('email')}</div>,
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: 'tenure',
      header: ({ column }) => (
        <DataTableColumnHeader className="ps-5" column={column} title='Thâm niên' />
      ),
      cell: ({ row }) => <div className='ps-5'>{row.getValue('tenure')}</div>,
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
    setDetail(employeeDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

  const handleView = async (row: Row<Employee>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleEdit = (row: Row<Employee>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<Employee>) => {
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
          <h2 className='text-2xl font-bold tracking-tight'>Danh sách nhân viên</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DataTable data={listDataQuery.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="name">
          <Button onClick={handleAddNew} variant='outline' size='sm' className='ml-auto hidden h-8 lg:flex me-2 bg-primary text-white'>
            <IconPlus className='mr-2 h-4 w-4' />Thêm
          </Button>

        </DataTable>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
    </>
  )
};
