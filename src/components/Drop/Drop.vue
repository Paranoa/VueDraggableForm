<template>
  <div class="ui-dropzone">
    <slot></slot>
  </div>
</template>
<script>
import DropZone from './DropZone.js'
import FormItem from '@/components/FormItem'
import { getOffset } from '@/util'
/**
* @desc 放置组件
*
* @listen [draggableMove]       - 监听drag拖拽中
* @listen [draggableDragend]    - 监听drag拖拽动作结束
* @listen [moveTemplateToMark]  - 监听子组件拖拽动作结束时
*/
export default {
  updated() {
    // update时 同步更新formItems
    this.$nextTick(() => {
      this.dropZone.setFormItems(this.$children)
      this.dropZone.inserting.blockIndex = -1
    })
  },
  components: {
    FormItem
  },
  mounted () {
    const el = this.$el
    const offset = getOffset(el)

    this.dropZone = new DropZone(el, {
      left: offset.left,
      top: offset.top,
      width: el.offsetWidth,
      height: el.offsetHeight,
      formItems: this.$children,
    })

    /**
    * @desc 拖拽动作发生时调用
    * @param {{left, top, width, height}} [offset]  - 拖拽移动信息
    */
    this.$on('draggableMove', offset => this.dropZone.detectMove(offset))

    /**
    * @desc 拖拽动作结束时调用
    * @param {function} [callback]    - callback将被调用,参数为当前插入的索引
    */
    this.$on('draggableDragend', callback => {
      callback(this.dropZone.inserting.blockIndex)
      this.dropZone.removeMark()
      this.dropZone.resetInsert()
    })

    /**
    * @desc 拖拽子组件动作结束时调用
    * @param {Vue instance} [item]    - 被移动的子组件Vue实例
    * @param {function} [callback]    - 发生移动时,callback将被调用,参数为移动至的索引
    */
    this.$on('moveTemplateToMark', (item, callback) => {
      const moveToIndex = this.dropZone.getMoveToIndex(item) 
      moveToIndex !== -1 && callback(moveToIndex)
    })
  }
}
</script>