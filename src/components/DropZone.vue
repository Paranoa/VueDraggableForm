<template>
  <div>
  </div>
</template>
<script>
  import DropZone from './DropZone.js'
  import { getOffset } from '@/util'

  export default {
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
        callback(this.dropZone.isHover)
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