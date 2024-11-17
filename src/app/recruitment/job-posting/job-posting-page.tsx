/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import jobPostingApiRequest from "@/apis/jobPosting.api";
import FormCRUD from "@/app/recruitment/job-posting/form-crud";
import FormPost from "@/app/recruitment/job-posting/form-postweb";
import AppBreadcrumb, { PathItem } from "@/components/custom/_breadcrumb";
import { Button } from "@/components/custom/button";
import DataTableJobPostingActions from "@/components/custom/data-table-job-posting-action";
import { DataTable, DataTableColumnHeader} from "@/components/data-table";
import { DataFilter } from "@/components/data-table/data-table-toolbar";
import { CRUD_MODE } from "@/data/const";
import { JobPosting, jobPostingDefault } from "@/data/schema/jobPosting,schema";
import { RecruitmentWeb } from "@/data/schema/recruitmentWeb.schema";
import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef, Row } from '@tanstack/react-table';
import { useState } from "react";

const pathList: Array<PathItem> = [
  {
    name: "Tuyển dụng",
    url: ""
  },
  {
    name: "Đăng bài tuyển dụng",
    url: "/recruitment/job-posting"
  },
];

//Filter by
const dataFilter: Array<DataFilter> = [
  {
    columnName: 'description',
    title: 'Mô tả',
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
  keyList: "jobPostings",
}

export default function JobpostingPage() {
  const [rwdetail, rwsetDetail] = useState<RecruitmentWeb>({});
  const [detail, setDetail] = useState<JobPosting>({});
  const [openCRUD, setOpenCRUD] = useState<boolean>(false);
  const [openPost, setOpenPost] = useState<boolean>(false);
  const [mode, setMode] = useState<CRUD_MODE>(CRUD_MODE.VIEW);

  const listDataQuery = useQuery({
    queryKey: [QUERY_KEY.keyList],
    queryFn: () => jobPostingApiRequest.getList(),
  });

  const columnsDef: ColumnDef<JobPosting>[] = [
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
      accessorKey: 'description',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Mô tả' />
      ),
      cell: ({ row }) => <div className='w-[200px]'>{row.getValue('description')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'location',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Địa điểm' />
      ),
      cell: ({ row }) => <div className='w-[100px]'>{row.getValue('location')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'salaryRangeMin',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Lương tối thiểu' />
      ),
      cell: ({ row }) => <div className='w-[50px]'>{row.getValue('salaryRangeMin')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'salaryRangeMax',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Lương tối đa' />
      ),
      cell: ({ row }) => <div className='w-[50px]'>{row.getValue('salaryRangeMax')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'postingDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ngày đăng' />
      ),
      cell: ({ row }) => {
        const postingDate = row.getValue('postingDate');
        return (
          <div className='w-[100px]'>
            {postingDate ? new Date(postingDate as string | number | Date).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : 'N/A'}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'expirationDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Ngày hết hạn' />
      ),
      cell: ({ row }) => {
        const expirationDate = row.getValue('expirationDate');
        return (
          <div className='w-[100px]'>
            {expirationDate ? new Date(expirationDate as string | number | Date).toLocaleString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            }) : 'N/A'}
          </div>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'experienceRequired',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Kinh nghiệm yêu cầu' />
      ),
      cell: ({ row }) => <div className='w-[100px]'>{row.getValue('experienceRequired')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'employeeName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Người đăng' />
      ),
      cell: ({ row }) => <div className='w-[100px]'>{row.getValue('employeeName')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      id: 'actions',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Chọn' />
      ),
      cell: ({ row }) => <DataTableJobPostingActions row={row}
        handleView={() => handleView(row)}
        handleEdit={() => handleEdit(row)}
        handlePosting={() => handlePosting(row)}
        handleDelete={() => handleDelete(row)} />,
    },
  ];

  //ACTION HANDLER
  const handleAddNew = () => {
    setDetail(jobPostingDefault);
    setMode(CRUD_MODE.ADD)
    setOpenCRUD(true);
  };

  const handleView = async (row: Row<JobPosting>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.VIEW);
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handlePosting = (row: Row<JobPosting>) => {
    const id = row.original.id;
    const selectedRecruitmentWeb: RecruitmentWeb = { jobPostingId: id, webId: 0 };
    //console.log(selectedData)
    rwsetDetail(selectedRecruitmentWeb);
    setOpenPost(true);
  };

  const handleEdit = (row: Row<JobPosting>) => {
    const id = row.original.id;
    setMode(CRUD_MODE.EDIT)
    const selectedData = listDataQuery.data?.metadata?.find(x => x.id == id) ?? {};
    setDetail(selectedData);
    setOpenCRUD(true);
  };

  const handleDelete = (row: Row<JobPosting>) => {
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
          <h2 className='text-2xl font-bold tracking-tight'>Danh sách bài đăng</h2>
          <AppBreadcrumb pathList={pathList} className="mt-2" />
        </div>
      </div>

      <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <DataTable data={listDataQuery.data?.metadata} columns={columnsDef} filters={dataFilter} searchField="description">
          <Button onClick={handleAddNew} variant='outline' size='sm'  className='ml-auto hidden h-8 lg:flex me-2 bg-primary text-white'>
            <IconPlus className='mr-2 h-4 w-4' />Thêm mới
          </Button>
          
        </DataTable>
      </div>
      <FormCRUD openCRUD={openCRUD} setOpenCRUD={setOpenCRUD} mode={mode} detail={detail} />
      <FormPost openPost={openPost} setOpenPost={setOpenPost} detail={rwdetail}/>
    </>
  )
};
