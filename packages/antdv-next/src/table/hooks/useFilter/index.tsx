import type { Ref } from 'vue'
import type { AnyObject } from '../../../_util/type.ts'
import type {
  FilterDropdownProps as ColumnFilterDropdownProps,
  ColumnsType,
  ColumnTitleProps,
  ColumnType,
  FilterKey,
  FilterValue,
  GetPopupContainer,
  Key,
  SafeKey,
  TableLocale,
  TransformColumns,
} from '../../interface.ts'
import { computed, shallowRef, unref } from 'vue'
import { devUseWarning } from '../../../_util/warning.ts'
import { getColumnKey, getColumnPos, renderColumnTitle } from '../../util.ts'
import FilterDropdown, { flattenKeys } from './FilterDropdown'

export interface FilterState<RecordType = AnyObject> {
  column: ColumnType<RecordType>
  key: Key
  filteredKeys?: FilterKey
  forceFiltered?: boolean
}

function collectFilterStates<RecordType extends AnyObject = AnyObject>(columns: ColumnsType<RecordType>, init: boolean, pos?: string): FilterState<RecordType>[] {
  let filterStates: FilterState<RecordType>[] = []

  ;(columns || []).forEach((column, index) => {
    const columnPos = getColumnPos(index, pos)
    const filterDropdownIsDefined = column.filterDropdown !== undefined

    if (column.filters || filterDropdownIsDefined || 'onFilter' in column) {
      if ('filteredValue' in column) {
        let filteredValues = column.filteredValue
        if (!filterDropdownIsDefined) {
          filteredValues = (filteredValues as any)?.map(String) ?? filteredValues
        }
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: filteredValues as FilterKey,
          forceFiltered: column.filtered,
        })
      }
      else {
        filterStates.push({
          column,
          key: getColumnKey(column, columnPos),
          filteredKeys: (init && column.defaultFilteredValue
            ? column.defaultFilteredValue!
            : undefined) as FilterKey,
          forceFiltered: column.filtered,
        })
      }
    }

    if ('children' in column) {
      filterStates = [...filterStates, ...collectFilterStates(column.children, init, columnPos)]
    }
  })

  return filterStates
}

function injectFilter<RecordType extends AnyObject = AnyObject>(
  prefixCls: string,
  dropdownPrefixCls: string,
  columns: ColumnsType<RecordType>,
  filterStates: FilterState<RecordType>[],
  locale: TableLocale,
  triggerFilter: (filterState: FilterState<RecordType>) => void,
  getPopupContainer?: GetPopupContainer,
  pos?: string,
  rootClassName?: string,
  filterDropdown?: FilterConfig<RecordType>['filterDropdown'],
  filterIcon?: FilterConfig<RecordType>['filterIcon'],
): ColumnsType<RecordType> {
  return columns.map((column, index) => {
    const columnPos = getColumnPos(index, pos)
    const {
      filterOnClose = true,
      filterMultiple = true,
      filterMode,
      filterSearch,
    } = column as ColumnType<RecordType>

    let newColumn: ColumnsType<RecordType>[number] = column

    if (newColumn.filters || newColumn.filterDropdown) {
      const columnKey = getColumnKey(newColumn, columnPos)
      const filterState = filterStates.find(({ key }) => columnKey === key)

      newColumn = {
        ...newColumn,
        title: (renderProps: ColumnTitleProps<RecordType>) => (
          <FilterDropdown
            tablePrefixCls={prefixCls}
            prefixCls={`${prefixCls}-filter`}
            dropdownPrefixCls={dropdownPrefixCls}
            column={newColumn}
            filterDropdownRender={filterDropdown}
            filterIconRender={filterIcon}
            columnKey={columnKey}
            filterState={filterState}
            filterOnClose={filterOnClose}
            filterMultiple={filterMultiple}
            filterMode={filterMode}
            filterSearch={filterSearch}
            triggerFilter={triggerFilter}
            locale={locale}
            getPopupContainer={getPopupContainer}
            rootClassName={rootClassName}
          >
            {renderColumnTitle<RecordType>(column.title, renderProps)}
          </FilterDropdown>
        ),
      }
    }

    if ('children' in newColumn) {
      newColumn = {
        ...newColumn,
        children: injectFilter(
          prefixCls,
          dropdownPrefixCls,
          newColumn.children,
          filterStates,
          locale,
          triggerFilter,
          getPopupContainer,
          columnPos,
          rootClassName,
          filterDropdown,
          filterIcon,
        ),
      }
    }

    return newColumn
  })
}

function generateFilterInfo<RecordType extends AnyObject = AnyObject>(filterStates: FilterState<RecordType>[]) {
  const currentFilters: Record<string, FilterValue | null> = {}

  filterStates.forEach(({ key, filteredKeys, column }) => {
    const keyAsString = key as SafeKey
    const { filters, filterDropdown } = column
    if (filterDropdown) {
      currentFilters[keyAsString] = (filteredKeys as FilterValue) || null
    }
    else if (Array.isArray(filteredKeys)) {
      const keys = flattenKeys(filters)
      currentFilters[keyAsString] = keys.filter(originKey =>
        (filteredKeys as string[]).includes(String(originKey)),
      )
    }
    else {
      currentFilters[keyAsString] = null
    }
  })

  return currentFilters
}

export function getFilterData<RecordType extends AnyObject = AnyObject>(data: RecordType[], filterStates: FilterState<RecordType>[], childrenColumnName: string) {
  const filterDatas = filterStates.reduce<RecordType[]>((currentData, filterState) => {
    const {
      column: { onFilter, filters },
      filteredKeys,
    } = filterState
    if (onFilter && filteredKeys && (filteredKeys as any).length) {
      return (
        currentData
          .map(record => ({ ...record }))
          .filter((record: any) =>
            (filteredKeys as any).some((key: any) => {
              const keys = flattenKeys(filters)
              const keyIndex = keys.findIndex(k => String(k) === String(key))
              const realKey = keyIndex !== -1 ? keys[keyIndex] : key

              if (record[childrenColumnName]) {
                record[childrenColumnName] = getFilterData(
                  record[childrenColumnName],
                  filterStates,
                  childrenColumnName,
                )
              }

              return onFilter(realKey as any, record)
            }),
          )
      )
    }
    return currentData
  }, data)
  return filterDatas
}

type MaybeRef<T> = T | Ref<T>

export interface FilterConfig<RecordType = AnyObject> {
  prefixCls: MaybeRef<string>
  dropdownPrefixCls: MaybeRef<string>
  mergedColumns: MaybeRef<ColumnsType<RecordType>>
  locale: MaybeRef<TableLocale>
  filterDropdown?: (ctx: ColumnFilterDropdownProps & { column: ColumnType<RecordType> }) => any
  filterIcon?: (ctx: { column: ColumnType<RecordType>, filtered: boolean }) => any
  onFilterChange: (
    filters: Record<string, FilterValue | null>,
    filterStates: FilterState<RecordType>[],
  ) => void
  getPopupContainer?: MaybeRef<GetPopupContainer | undefined>
  rootClassName?: MaybeRef<string | undefined>
}

function getMergedColumns<RecordType extends AnyObject = AnyObject>(rawMergedColumns: ColumnsType<RecordType>): ColumnsType<RecordType> {
  return rawMergedColumns.flatMap((column) => {
    if ('children' in column) {
      return [column, ...getMergedColumns<RecordType>(column.children || [])]
    }
    return [column]
  })
}

export default function useFilter<RecordType extends AnyObject = AnyObject>(
  props: FilterConfig<RecordType>,
) {
  const {
    prefixCls: rawPrefixCls,
    dropdownPrefixCls: rawDropdownPrefixCls,
    mergedColumns: rawMergedColumns,
    onFilterChange,
    getPopupContainer: rawGetPopupContainer,
    locale: rawTableLocale,
    rootClassName: rawRootClassName,
    filterDropdown,
    filterIcon,
  } = props
  const warning = devUseWarning('Table')

  const prefixCls = computed(() => unref(rawPrefixCls))
  const dropdownPrefixCls = computed(() => unref(rawDropdownPrefixCls))
  const mergedColumns = computed(() => getMergedColumns<RecordType>(unref(rawMergedColumns) || []))
  const tableLocale = computed(() => unref(rawTableLocale))
  const getPopupContainer = computed(() => unref(rawGetPopupContainer))
  const rootClassName = computed(() => unref(rawRootClassName))

  const filterStates = shallowRef<FilterState<RecordType>[]>(
    collectFilterStates(mergedColumns.value, true),
  )

  const mergedFilterStates = computed(() => {
    const collectedStates = collectFilterStates(mergedColumns.value, false)
    if (collectedStates.length === 0) {
      return collectedStates
    }
    let filteredKeysIsAllNotControlled = true
    let filteredKeysIsAllControlled = true
    collectedStates.forEach(({ filteredKeys }) => {
      if (filteredKeys !== undefined) {
        filteredKeysIsAllNotControlled = false
      }
      else {
        filteredKeysIsAllControlled = false
      }
    })

    if (filteredKeysIsAllNotControlled) {
      const keyList = (mergedColumns.value || []).map((column, index) =>
        getColumnKey(column, getColumnPos(index)),
      )
      return filterStates.value
        .filter(({ key }) => keyList.includes(key))
        .map((item) => {
          const col = mergedColumns.value[keyList.indexOf(item.key)]
          return {
            ...item,
            column: {
              ...item.column,
              ...col,
            },
            forceFiltered: col?.filtered as any,
          }
        })
    }

    warning(
      filteredKeysIsAllControlled,
      'usage',
      'Columns should all contain `filteredValue` or not contain `filteredValue`.',
    )

    return collectedStates
  })

  const filters = computed(() => generateFilterInfo<RecordType>(mergedFilterStates.value))

  const triggerFilter = (filterState: FilterState<RecordType>) => {
    const newFilterStates = mergedFilterStates.value.filter(({ key }) => key !== filterState.key)
    newFilterStates.push(filterState)
    filterStates.value = newFilterStates
    onFilterChange(generateFilterInfo<RecordType>(newFilterStates), newFilterStates)
  }

  const transformColumns: TransformColumns<RecordType> = innerColumns =>
    injectFilter(
      prefixCls.value,
      dropdownPrefixCls.value,
      innerColumns,
      mergedFilterStates.value,
      tableLocale.value,
      triggerFilter,
      getPopupContainer.value,
      undefined,
      rootClassName.value,
      filterDropdown,
      filterIcon,
    )

  return [transformColumns, mergedFilterStates, filters] as const
}

export { flattenKeys }
