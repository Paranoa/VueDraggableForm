export default class DropZone {
  constructor(el, { left, top, width, height, childs = [] }) {
    this.el = el
    this.left = left
    this.top = top
    this.width = width
    this.height = height
    this.childs = childs // 内部Vue实例List
    this.inserting = {  // 当前插入位置信息
      blockIndex: -1
    },
    this.markHeight = 11  // 标记高度
    this.markClassName = 'drop-zone-mark' // 标记className
  }

  detectMove({ left, top, width, height }) {
    // 获取横纵坐标跨度
    const minx = left, maxx = left + width, miny = top, maxy = top + height
    // 元素位置+宽高检测, x y轴均有交集即为hover
    if (!(minx > this.left + this.width || maxx < this.left) && 
        !(miny > this.top + this.height || maxy < this.top)) {
      // 高度差+1/2元素高度作为插入位置判断标准
      const blockIndex = this.getHoverIndex(top - this.top + height * 0.5)

      // 已有mark 位置相同时不做操作
      if (this.inserting.blockIndex === blockIndex) {
        return
      }
      this.inserting = {
        blockIndex
      }
      this.addMark(blockIndex)
    } else {
      // 未hover时移除mark
      this.resetInsert()
      this.removeMark()
    }
  }

  getHoverIndex(top) {
    if (this.childs.length) {
      // 总高度有一个初始值 即插入标记本身所占高度
      let totalHeight = this.markHeight
      let i = 0
      for (;i < this.childs.length; i++) {
        const height = this.childs[i].$el.offsetHeight
        totalHeight += height
        if (totalHeight >= top) {
          // 超过当前元素高度的一半，返回下一个插入位置
          if (totalHeight - 0.5 * height <= top) {
            return i + 1
          }
          return i
        }
      }
      // 高度大于总体元素高度，返回最大索引
      return i
    } else {
      return 0
    }
  }

  addMark(blockIndex) {
    this.removeMark()
    this.mark = document.createElement('div')
    this.mark.className = this.markClassName

    const before = this.el.childNodes[blockIndex]
    this.el.insertBefore(this.mark, before)
  }

  removeMark() {
    if (this.mark) {
      this.mark.parentNode.removeChild(this.mark)
      this.mark = null
    }
  }

  getMoveToIndex(item) {
    const moveFrom = this.childs.indexOf(item)
    const moveTo = this.inserting.blockIndex
    // moveTo为moveFrom 或 moveFrom+1则未移动,不回调
    if (!(moveTo === moveFrom || moveTo === moveFrom + 1)) {
      return (moveTo > moveFrom ? moveTo - 1: moveTo)
    }
    return -1
  }

  setChilds(items) {
    this.childs = items
  }

  resetInsert() {
    this.inserting.blockIndex = -1
  }
}
