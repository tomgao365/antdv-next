import type { App, Plugin } from 'vue'
import Group from './group'
import Radio from './radio'
import Button from './radioButton'

export type {
  RadioChangeEvent,
  RadioEmits,
  RadioGroupEmits,
  RadioGroupOptionType,
  RadioGroupProps,
  RadioGroupSlots,
  RadioProps,
  RadioSlots,

} from './interface'

export const RadioGroup = Group
export const RadioButton = Button

type CompoundedComponent = typeof Radio & Plugin & {
  Group: typeof Group
  Button: typeof Button
  /** @internal */
  __ANT_RADIO: boolean
}
const RadioCompounded = Radio as CompoundedComponent
RadioCompounded.Button = Button
RadioCompounded.Group = Group
RadioCompounded.__ANT_RADIO = true

RadioCompounded.install = (app: App) => {
  app.component(Radio.name, RadioCompounded)
  app.component(RadioGroup.name, RadioGroup)
  app.component(RadioButton.name, RadioButton)
}

export default RadioCompounded
