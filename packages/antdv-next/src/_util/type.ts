import type { VNode, VNodeChild } from 'vue'

export type AnyObject = Record<PropertyKey, any>

export type RenderNodeFn<Args extends any[] = any[]> = (...args: Args) => VNodeChild

export type VueNode = RenderNodeFn | boolean | string | number | null | undefined | VNode

export type EmitsArrToEvent<T extends Record<string, any>> = {
  [K in keyof T]: T[K] extends any[] ? (...args: T[K]) => void : T[K]
}

export type EmitsType<T extends Record<string, any>> = EmitsArrToEvent<T> & {
  [key: string]: (...args: any[]) => void
}

export type SlotsDefineType<T extends Record<string, any> = Record<string, any>> = {
  default?: () => any
} & T
