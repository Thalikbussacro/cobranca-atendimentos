import { TableHead } from '@/components/ui/table'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SortableHeader({ children, field, currentField, currentDirection, onSort, className }) {
  const isActive = currentField === field

  return (
    <TableHead
      className={cn('cursor-pointer select-none hover:bg-muted/70 transition-colors', className)}
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        <span className="text-muted-foreground">
          {isActive ? (
            currentDirection === 'asc' ? (
              <ArrowUp className="h-3.5 w-3.5" />
            ) : (
              <ArrowDown className="h-3.5 w-3.5" />
            )
          ) : (
            <ArrowUpDown className="h-3.5 w-3.5 opacity-50" />
          )}
        </span>
      </div>
    </TableHead>
  )
}
