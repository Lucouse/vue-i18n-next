import { h, Fragment, SetupContext, VNodeChild, RenderFunction } from 'vue'
import { Composer, ComposerInternal, TransrateVNodeSymbol } from '../composer'
import { useI18n } from '../i18n'
import { TranslateOptions } from '../core'
import { NamedValue } from '../message/runtime'
import { isNumber, isString, isObject } from '../utils'
import { baseFormatProps, BaseFormatProps } from './base'

export interface TranslationProps extends BaseFormatProps {
  keypath: string
  plural?: number | string
}

export const Translation = {
  /* eslint-disable */
  name: 'i18n-t',
  props: {
    ...baseFormatProps,
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (val: any): boolean => isNumber(val) || !isNaN(val)
    }
  },
  /* eslint-enable */
  setup(props: TranslationProps, context: SetupContext): RenderFunction {
    const { slots, attrs } = context
    const i18n = useI18n({ useScope: props.scope }) as Composer &
      ComposerInternal
    const keys = Object.keys(slots).filter(key => key !== '_')

    return (): VNodeChild => {
      const options = {} as TranslateOptions
      if (props.locale) {
        options.locale = props.locale
      }
      if (props.plural !== undefined) {
        options.plural = isString(props.plural) ? +props.plural : props.plural
      }
      const arg = getInterpolateArg(context, keys)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const children = (i18n as any)[TransrateVNodeSymbol](
        props.keypath,
        arg,
        options
      )
      // prettier-ignore
      return isString(props.tag)
        ? h(props.tag, { ...attrs }, children)
        : isObject(props.tag)
          ? h(props.tag, { ...attrs }, children)
          : h(Fragment, { ...attrs }, children)
    }
  }
}

function getInterpolateArg(
  { slots }: SetupContext,
  keys: string[]
): NamedValue | unknown[] {
  if (keys.length === 1 && keys[0] === 'default') {
    // default slot only
    return slots.default ? slots.default() : []
  } else {
    // named slots
    return keys.reduce((arg, key) => {
      const slot = slots[key]
      if (slot) {
        arg[key] = slot()
      }
      return arg
    }, {} as NamedValue)
  }
}
