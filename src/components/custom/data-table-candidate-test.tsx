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

export default function DataTableCandidateActions<TData>({ row, handleView, handleEdit, handleTest, handleAddContract,handleDelete }: DataTableCandidateActionsProps<TData>) {
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
        <DropdownMenuItem onClick={handleView}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEdit}>Test</DropdownMenuItem>
        <DropdownMenuItem onClick={handleTest}>Score</DropdownMenuItem>
        <DropdownMenuItem onClick={handleAddContract}>Tạo hợp đồng</DropdownMenuItem>
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
