<template>
  <div>
    <div style="margin-bottom: 20px">
      <Drag
        :drop="drop"
        @droped="index => droped(index, formItemTemplate.singleInput)">
        <div class="drag-item">单行输入框</div>
      </Drag>
      <Drag style="margin-left: 10px"
        :drop="drop"
        @droped="index => droped(index, formItemTemplate.singleSelect)">
        <div class="drag-item">单选框</div>
      </Drag>
    </div>
    <Drop class="drop-zone" ref="drop">
      <FormItem v-for="(item, index) in items"
        :class="{ 'active': activeIndex === index }"
        :type="item.type"
        :options="item.options"
        :drop="drop"
        @mousedown="onTemplateClicked(index)"
        @templateMove="toIndex => onTemplateMove(index, toIndex)"
        @templateRemove="onTemplateRemove(index)"/>
    </Drop>
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
  import formItemTemplate from '@/components/FormItemTemplate'

  export default {
    name: 'home',
    components: {
      Drag,
      Drop,
      FormItem
    },
    data() {
      return {
        formItemTemplate,
        items: [],
        editOptions: {
          type: '',
          options: null
        },
        drop: null,
        activeIndex: -1
      }
    },
    methods: {
      droped(index, options) {
        this.items.splice(index, 0, {
          ...options,
        })
      },
      onTemplateClicked(index) {
        this.activeIndex = index
        this.editOptions = this.items[index]
      },
      onTemplateMove(index, toIndex) {
        const item = this.items[index]
        this.items.splice(index, 1) 
        this.items.splice(toIndex, 0, item)
      },
      onTemplateRemove(index) {
        // 删除一个模板后，当前编辑选项设为空
        this.items.splice(index, 1)
        this.editOptions.type = ''
      },
      exportForm() {
        console.log(this.items)
      }
    },
    mounted () {
      this.drop = this.$refs.drop
      this.items = [{
        type: 'singleInput',
        options: {
          label: '单行输入框',
          placeholder: '请输入'
        }
      },{
        type: 'singleSelect',
        options: {
          label: '选择',
          placeholder: '请选择',
          opts: [{}]
        }
      }]
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
