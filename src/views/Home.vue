<template>
  <div>
    <div style="margin-bottom: 20px">
      <Drag
        :drop="drop"
        @droped="index => droped(index, 'singleInput')">
        <div class="drag-item">单行输入框</div>
      </Drag>
      <Drag style="margin-left: 10px"
        :drop="drop"
        @droped="index => droped(index, 'singleSelect')">
        <div class="drag-item">单选框</div>
      </Drag>
    </div>
    <FormDrop ref="drop"
      class="drop-zone"
      :items="items"
      :activeItem="activeItem"
      @itemClicked="itemClicked"
      @itemRemoved="itemRemoved"
    />
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
          <li v-for="(opt, index) of editOptions.options.opts" :key="index">
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
  import Drag from '@/components/Drag/Drag'
  import FormDrop from '@/components/FormDrop'
  import { getTemplateInstance } from '@/components/FormItemTemplate'
  import { clone } from '@/util'

  export default {
    name: 'home',
    components: {
      Drag,
      FormDrop
    },
    data() {
      return {
        items: [],
        editOptions: {
          type: '',
          options: null
        },
        drop: null,
        activeItem: null
      }
    },
    methods: {
      droped(index, name) {
        this.items.splice(index, 0, getTemplateInstance(name))
        this.itemClicked(index)
      },
      itemClicked(index) {
        this.activeItem = this.items[index]
        this.editOptions = this.items[index]
      },
      itemRemoved() {
        // 删除一个模板后，当前编辑选项设为空
        this.editOptions = null
      },
      exportForm() {
        console.log(this.items)
      }
    },
    mounted () {
      // 默认FormDrop的第一个直接子组件是Drop
      this.drop = this.$refs.drop.$children[0]
      this.items = getTemplateInstance(['singleInput', 'singleSelect'])
    }
  }
</script>
