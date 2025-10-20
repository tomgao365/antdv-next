import Col from './col'
import useInternalBreakpoint from './hooks/useBreakpoint'
import Row from './row'

// Do not export params
export function useBreakpoint() {
  return useInternalBreakpoint()
}

export type { ColProps, ColSize } from './col'
export type { RowProps } from './row'
export { Col, Row }
