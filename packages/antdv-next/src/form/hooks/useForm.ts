import type { NamePath } from '../types'
import { toArray } from '../util'

export function toNamePathStr(name: NamePath) {
  const namePath = toArray(name)
  return namePath.join('_')
}
