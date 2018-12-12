<template></template>
<script>
  export default {
    created () {
      this.$on('draggable-move', function ({ left, top, width, height }) {
        // 获取横纵坐标跨度
        const minx = left, maxx = left + width, miny = top, maxy = top + height
        // 元素位置+宽高检测hover, x y轴均有交集即为hover
        if (!(minx > this.left + this.width || maxx < this.left) && !(miny > this.top + this.height || maxy < this.top)) {
          // 高度差+1/2元素高度作为插入位置判断标准
          const blockIndex = this.getHoverIndex(top - this.top + height * 0.5)

          // 已有mark 位置相同时不做操作
          if (this.isHover && this.insertingTemplate && this.insertingTemplate.blockIndex === blockIndex) {
            return
          }
          this.addMark(blockIndex)
          this.isHover = true
          this.insertingTemplate = {
            blockIndex
          }
        } else {
          // 未hover时移除mark
          this.isHover = false
          this.insertingTemplate = null
          this.removeMark()
        }
      })
    }
  }
</script>