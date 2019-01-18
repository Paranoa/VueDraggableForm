import { clone } from '@/util'

const template = {
  singleInput: {
    type: 'singleInput',
    options: {
      label: '单行输入框',
      placeholder: '请输入'
    }
  },
  singleSelect: {
    type: 'singleSelect',
    options: {
      label: '单选框',
      placeholder: '请选择',
      opts: [{}]
    }
  }
}

const getTemplateInstance = function(names) {
  if (typeof names === 'string') {
    return clone(template[names])
  } else {
    const result = []
    for (const name of names) {
      result.push(clone(template[name]))
    }
    return result
  }
}


export {
  template,
  getTemplateInstance
}