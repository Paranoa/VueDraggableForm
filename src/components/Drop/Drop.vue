<template>
  <div class="ui-dropzone">
  </div>
</template>
<script>
  import DropZone from './DropZone.js'
  import FormItem from '@/components/FormItem'
  import { getOffset } from '@/util'

  export default {
    data() {
      return {
        formItems: []
      }
    },
    components: {
      FormItem
    },
    mounted () {
      const vm = this
      const el = this.$el
      const offset = getOffset(el)

      this.dropZone = new DropZone(el, {
        ref: this,
        left: offset.left,
        top: offset.top,
        width: el.offsetWidth,
        height: el.offsetHeight,
        onTemplateClicked(item) {
          vm.$emit('templateClicked', item)
        },
        onTemplateRemoved() {
          vm.$emit('templateRemoved')
        }
      })

      this.$on('draggableMove', ({ left, top, width, height }) => {
        this.dropZone.detectMove({ left, top, width, height })
      })

      this.$on('draggableDragend', callback => {
        this.dropZone.removeMark()
        // 回调当前是否有元素位于Drop上方
        callback(this.dropZone.inserting.blockIndex !== -1)
      })

      this.$on('removeItem', item => {
        this.dropZone.removeItem(item)
      })

      this.$on('moveTemplateToMark', item => {
        this.dropZone.moveTemplateToMark(item)
      })

      this.$on('insertTemplateToMark', option => {
        this.dropZone.insertTemplateToMark(option)
      })
    }
  }
</script>