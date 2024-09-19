import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'

import DataTableFacetedFilter from '@/components/data-table/data-table-faceted-filter'
import DataTableViewOptions from '@/components/data-table/data-table-view-options'

export interface DataFilter {
  columnName: string,
  title?: string,
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
};


export interface DataTableToolbarProps<TData> {
  table: Table<TData>,
  filters: Array<DataFilter>,
  searchField?: string,
  children?: React.ReactNode;
}

export default function DataTableToolbar<TData>({ table, filters, searchField, children}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder={`Filter ${searchField}...`}
          value={(searchField && table.getColumn(searchField)?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            searchField && table.getColumn(searchField)?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {
            filters && filters.length && filters.map((x, i) => {
              if (table.getColumn(x.columnName)) {
                return <DataTableFacetedFilter key={i}
                  column={table.getColumn(x.columnName)}
                  title={x.title ? x.title : x.columnName.charAt(0).toUpperCase() + x.columnName.slice(1)}
                  options={x.options}
                />
              }

            })
          }
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex justify-end align-middle'>
        {children}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
