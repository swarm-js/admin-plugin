<template>
  <el-form
    ref="formRef"
    :model="data"
    :rules="rules"
    label-position="top"
    class="form-filler"
  >
    <h2 v-if="title.length">{{ title }}</h2>
    <el-form-item
      v-for="(valConf, key) in conf"
      :prop="key"
      :label="valConf.label"
    >
      <component
        ref="itemRefs"
        :is="types[valConf.type]"
        :conf="valConf"
        :baseValue="base"
        v-model="data[key]"
      ></component>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { parsePhoneNumber } from 'awesome-phonenumber'
const { t } = useI18n({ useScope: 'global' })

import ArrayType from './Types/Array'
import SubformType from './Types/Subform'
import TextType from './Types/Text'
import TextareaType from './Types/Textarea'
import EmailType from './Types/Email'
import PhoneType from './Types/Phone'
import NumberType from './Types/Number'
import RadioType from './Types/Radio'
import SelectType from './Types/Select'
import FileType from './Types/File'
import ImageType from './Types/Image'
import BooleanType from './Types/Boolean'
import MemberType from './Types/Member'
import DateType from './Types/Date'
import HourType from './Types/Hour'
import MoneyType from './Types/Money'

const conf = inject('conf')

const types = {
  array: ArrayType,
  subform: SubformType,
  text: TextType,
  textarea: TextareaType,
  email: EmailType,
  phone: PhoneType,
  number: NumberType,
  radio: RadioType,
  select: SelectType,
  file: FileType,
  image: ImageType,
  boolean: BooleanType,
  member: MemberType,
  date: DateType,
  hour: HourType,
  money: MoneyType
}

const props = defineProps({
  modelValue: {},
  baseValue: {
    default: null
  },
  conf: {},
  title: { type: String, default: '' }
})
const emit = defineEmits(['update:modelValue'])
const formRef = ref(null)
const itemRefs = ref([])

const data = ref(JSON.parse(JSON.stringify(props.modelValue ?? {})))
watch(
  _ => props.modelValue,
  _ => {
    if (JSON.stringify(props.modelValue) !== JSON.stringify(data.value))
      data.value = JSON.parse(JSON.stringify(props.modelValue))
  },
  { deep: true }
)

const base = props.baseValue ?? data.value

// Generate rules
const rules = {}
for (let key in props.conf) {
  const confItem = props.conf[key]
  if (data.value[key] === undefined && confItem.default !== undefined)
    data.value[key] = confItem.default

  const rule = []
  if (confItem.required)
    rule.push({
      required: true,
      message: t('Please fill this input'),
      trigger: 'blur'
    })
  switch (confItem.type) {
    case 'email':
      rule.push({
        validator (rule, value, callback) {
          if (!value) {
            return callback()
          }
          if (
            /^[A-Za-z0-9_!#$%&'*+\/=?`{|}~^.-]+@[A-Za-z0-9.-]+$/gm.test(
              value
            ) === false
          )
            return callback(new Error(t('Please enter a valid email address')))
          return callback()
        },
        trigger: 'blur'
      })
      break
    case 'rate':
      if (confItem.required)
        rule.push({
          validator (rule, value, callback) {
            if (!value) {
              return callback(new Error(t('Please select a value')))
            }
            return callback()
          },
          trigger: 'blur'
        })
      break
    case 'phone':
      rule.push({
        validator (rule, value, callback) {
          if (!value) {
            return callback()
          }

          const pn = parsePhoneNumber(value, {
            regionCode: conf.defaultCountry ?? 'US'
          })
          if (!pn.valid)
            return callback(new Error(t('Please enter a valid phone number')))
          data.value[key] = pn.number.e164
          return callback()
        },
        trigger: 'blur'
      })
      break
    case 'number':
      if (confItem.min !== undefined)
        rule.push({
          validator (rule, value, callback) {
            if (value < confItem.min)
              return callback(
                new Error(
                  t('Value should be greater or equal to {val}', {
                    val: confItem.min
                  })
                )
              )
            return callback()
          },
          trigger: 'blur'
        })
      if (confItem.max !== undefined)
        rule.push({
          validator (rule, value, callback) {
            if (value > confItem.max)
              return callback(
                new Error(
                  t('Value should be less or equal to {val}', {
                    val: confItem.max
                  })
                )
              )
            return callback()
          },
          trigger: 'blur'
        })
      break
    case 'radio':
    case 'select':
      if (confItem.multiple && confItem.min !== undefined)
        rule.push({
          validator (rule, value, callback) {
            if (value.length < confItem.min)
              return callback(
                new Error(
                  t('You must select at least {val} values', {
                    val: confItem.min
                  })
                )
              )
            return callback()
          },
          trigger: 'blur'
        })
      if (confItem.multiple && confItem.max !== undefined)
        rule.push({
          validator (rule, value, callback) {
            if (value.length > confItem.max)
              return callback(
                new Error(
                  t('You must select a maximum of {val} values', {
                    val: confItem.max
                  })
                )
              )
            return callback()
          },
          trigger: 'blur'
        })
      break
  }
  if (rule.length) rules[key] = rule
}
emit('update:modelValue', data.value)

watch(
  data,
  async _ => {
    emit('update:modelValue', data.value)
  },
  { deep: true }
)

async function validate () {
  const promises = [
    new Promise(async resolve => {
      try {
        const valid = await formRef.value.validate()
        resolve(valid)
      } catch {
        resolve(false)
      }
    })
  ]
  for (let item of itemRefs.value) {
    if (item.validate) {
      promises.push(
        new Promise(async resolve => {
          try {
            const valid = await item.validate()
            resolve(valid)
          } catch {
            resolve(false)
          }
        })
      )
    }
  }
  return (await Promise.all(promises)).findIndex(a => a === false) === -1
}

defineExpose({ validate })
</script>

<style lang="scss">
.form-filler {
  width: 100%;
}
</style>
