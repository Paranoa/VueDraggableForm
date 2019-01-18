<template>
  <Drag :drop="drop" @dragmove="dragmove" @dragend="dragend" @droped="droped">
    <div @mousedown="mousedown">
      <template v-if="type === 'singleInput'">
        <div class="form-item">
          <i @mousedown.stop="remove" class="form-item-remove">x</i>
          <label>{{ options.label }}</label>
          <span class="fr">{{ placeholder }}</span>
        </div>
      </template>
      <template v-else-if="type === 'singleSelect'">
        <div class="form-item" style="line-height: 60px">
          <i @mousedown.stop="remove" class="form-item-remove">x</i>
          <label>{{ options.label }}</label>
          <span class="fr">{{ placeholder }} ></span>
        </div>
      </template>
    </div>
  </Drag>
</template>
<script>
/**
* @desc 单个表单项拖拽组件
*
* @prop {String} [type]                   - 类型,区别不同种类的表单控件 
* @prop {Object} [options]                - 表单控件的初始化参数
* @prop {Drop Component Instance} [drop]  - 监听此drag的drop组件实例(必须)
*
* @event [mousedown]                      - mousedown事件 
* @event [templateRemove]                 - 点击x触发删除事件
* @event [templateMove]                   - 拖拽结束,并在drop中发生移动时触发, 回调参数: 移动至的索引
*/
import Drag from '@/components/Drag/Drag'
export default {
  props: {
    type: {
      type: String,
      default: 'singleInput'
    },
    options: {
      type: Object,
      default () {
        return {
          label:'标题',
          placeholder: '请输入'
        }
      }
    },
    drop: {
      type: Object,
      required: true
    }
  },
  computed: {
    placeholder () {
      return this.options.placeholder + (this.options.required ? '（必填）' : '')
    }
  },
  components: {
    Drag
  },
  methods: {
    dragmove() {
      $(this.$el).addClass('dragging')
    },
    dragend() {
      $(this.$el).removeClass('dragging')
    },
    mousedown () {
      this.$emit('mousedown')
    },
    droped() {
      this.drop.$emit('dropTemplateToMark', this, toIndex => {
        this.$emit('templateMove', toIndex)
      })
    },
    remove() {
      this.$emit('templateRemove')
    }
  }
}
</script>
