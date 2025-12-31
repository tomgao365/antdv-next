import type { AnyObject } from '../../_util/type.ts'
import type { ColumnGroupType, ColumnsType, ColumnTitleProps, ColumnType, TransformColumns } from '../interface.ts'
import { renderColumnTitle } from '../util.ts'

function fillTitle<RecordType extends AnyObject = AnyObject>(columns: ColumnsType<RecordType>, columnTitleProps: ColumnTitleProps<RecordType>) {
  const finalColumns = columns.map((column) => {
    const cloneColumn: ColumnGroupType<RecordType> | ColumnType<RecordType> = { ...column }
    cloneColumn.title = renderColumnTitle(column.title, columnTitleProps) as any
    if ('children' in cloneColumn) {
      cloneColumn.children = fillTitle<RecordType>(cloneColumn.children, columnTitleProps)
    }
    return cloneColumn
  })
  return finalColumns
}

export default function useTitleColumns<RecordType extends AnyObject = AnyObject>(
  columnTitleProps: ColumnTitleProps<RecordType>,
) {
  const filledColumns: TransformColumns<RecordType> = columns =>
    fillTitle<RecordType>(columns, columnTitleProps)
  return [filledColumns] as const
}
