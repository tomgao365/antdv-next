import type { VNode, VNodeChild } from 'vue'
import { toArray } from 'es-toolkit/compat'

export default function useHasSider(
  siders: string[],
  children?: VNodeChild,
  hasSider?: boolean,
) {
  if (typeof hasSider === 'boolean') {
    return hasSider
  }
  if (siders.length) {
    return true
  }
  const childNodes = toArray(children)

  return childNodes.some((node: VNode) => node?.type === 'Sider')
}
