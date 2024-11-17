import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { IconTrash } from '@tabler/icons-react'


interface DataTableCandidateActionsProps<TData> {
  row: Row<TData>,
  handleView?: () => void,
  handleEdit?: () => void,
  handleAddTest?: () => void,
  handleDelete?: () => void,
  handleTest?: () => void,
  handleAddContract?: () => void,
}

export default function DataTableCandidateActions<TData>({ handleView, handleEdit, handleAddTest, handleTest, handleAddContract,handleDelete }: DataTableCandidateActionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onClick={handleView}>Xem hồ sơ</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>Sửa ứng viên</DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddTest}>Thay bộ kiểm tra</DropdownMenuItem>
        <DropdownMenuItem onClick={handleTest}>Phỏng vấn</DropdownMenuItem>
        {handleAddContract && (
          <DropdownMenuItem onClick={handleAddContract}>Tạo hợp đồng</DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} className='text-red-500'>
          Xóa
          <DropdownMenuShortcut>
        
            <IconTrash size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
