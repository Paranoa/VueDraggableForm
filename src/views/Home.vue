<template>
  <div>
    <div style="margin-bottom: 20px">
      <Drag
        :dropzone="dropzone"
        @droped="drop => droped(drop, formItemTemplate.singleInput)">
        <div class="drag-item">单行输入框</div>
      </Drag>
      <Drag style="margin-left: 10px"
        :dropzone="dropzone"
        @droped="drop => droped(drop, formItemTemplate.singleSelect)">
        <div class="drag-item">单选框</div>
      </Drag>
    </div>
    <drop class="drop-zone" ref="dropzone">
      <FormItem
        type="singleInput"
        :dropzone="dropzone"
        :options="formItemTemplate.singleInput.opts"
        :onMousedown="onTemplateClicked"
        :onRemove="onTemplateRemoved" />

      <FormItem
        type="singleInput"
        :dropzone="dropzone"
        :options="formItemTemplate.singleInput.opts"
        :onMousedown="onTemplateClicked"
        :onRemove="onTemplateRemoved" />
    </drop>
    <div v-if="editOptions" style="float:left; margin-left: 100px; border: 1px solid #aaa">
      <template v-if="editOptions.type === 'singleInput'">
        单行输入框
        标题: <input v-model="editOptions.options.label">
        提示文字: <input v-model="editOptions.options.placeholder">
        验证： <input type="checkbox" v-model="editOptions.options.required">
      </template>
      <template v-if="editOptions.type === 'singleSelect'">
        单行选择框
        标题: <input v-model="editOptions.options.label">
        提示文字: <input v-model="editOptions.options.placeholder">
        选项:
        <ul>
          <li v-for="(opt, index) of editOptions.options.opts">
            <input v-model="opt.value">
            <span style="padding: 5px" @click="editOptions.options.opts.push({})">+</span>
            <span v-if="editOptions.options.opts.length > 1" style="padding: 5px" @click="editOptions.options.opts.splice(index, 1)">-</span>
          </li>  
        </ul>
        验证： <input type="checkbox" v-model="editOptions.options.required">
      </template>
    </div>
    <button @click="exportForm">导出</button>
    <div style="clear: both"></div>
  </div>
</template>
<script>
  import Vue from 'vue'
  import Drag from '@/components/Drag/Drag'
  import Drop from '@/components/Drop/Drop'
  import FormItem from '@/components/FormItem'

  export default {
    name: 'home',
    components: {
      Drag,
      Drop,
      FormItem
    },
    data() {
      return {
        formItemTemplate: {
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
        },
        editOptions: {
          type: '',
          options: null
        },
        dropzone: null
      }
    },
    methods: {
      droped(drop, options) {
        // 实例化参数是一个复制
        const newOptions = JSON.parse(JSON.stringify(options))
        const formItemConstructor = Vue.extend(FormItem)
        
        drop.$emit('insertTemplateToMark', {
          constructor: formItemConstructor,
          propsData: {
            dropzone: this.dropzone,
            ...newOptions,
            onMousedown: this.onTemplateClicked,
            onRemove: this.onTemplateRemoved
          }
        }, item => {
          this.onTemplateClicked(item)
        })
      },
      exportForm() {
        console.log(this.dropzone.dropZone.formItems)
      },
      onTemplateClicked(item) {
        $(item.$el).addClass('active').siblings('.ui-draggable').removeClass('active')

        // 插入一个模板后，设置当前的编辑选项
        this.editOptions.type = item.$props.type
        this.editOptions.options = item.$props.options
      },
      onTemplateRemoved() {
        // 删除一个模板后，当前编辑选项设为空
        this.editOptions.type = ''
      },
      formItemClick() {
        console.log(arguments)
      }
    },
    mounted () {
      this.dropzone = this.$refs.dropzone
    }
  }
</script>

<style>
  .drop-zone-mark { border: 1px solid red; width: 100%; margin: 5px 0;}
</style>
<style scoped>
  .drag-item { width: 200px; height: 40px; border: 1px solid #aaa; background: #eee }
  .drop-zone { float:left; width: 300px; border: 1px solid #aaa; height: 500px; position: relative; margin-left: 100px }
</style>
