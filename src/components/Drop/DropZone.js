import Vue from 'vue'
import FormItem from '@/components/FormItem'

export default class DropZone {
  constructor(el, { ref, left, top, width, height, onTemplateClicked, onTemplateRemoved }) {
    this.ref = ref
    this.el = el
    this.left = left
    this.top = top
    this.width = width
    this.height = height
    this.markHeight = 11
    this.formItems = []
    this.inserting = {
      blockIndex: -1
    },
    this.markClassName = 'drop-zone-mark'
    this.onTemplateClicked = onTemplateClicked
    this.onTemplateRemoved = onTemplateRemoved
  }

  detectMove({ left, top, width, height }) {
    // 获取横纵坐标跨度
    const minx = left, maxx = left + width, miny = top, maxy = top + height
    // 元素位置+宽高检测, x y轴均有交集即为hover
    if (!(minx > this.left + this.width - window.scrollX || maxx < this.left) && 
        !(miny > this.top + this.height - window.scrollY || maxy < this.top)) {
      // 高度差+1/2元素高度作为插入位置判断标准
      const blockIndex = this.getHoverIndex(top - this.top + window.scrollY + height * 0.5)

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
      this.inserting.blockIndex = -1
      this.removeMark()
    }
  }

  getHoverIndex(top) {
    if (this.formItems.length) {
      // 总高度有一个初始值 等于插入标记自身所占高度
      let totalHeight = this.markHeight
      let i=0
      for (;i <this.formItems.length; i++) {
        const height = this.formItems[i].$el.offsetHeight
        totalHeight += height
        if (totalHeight >= top) {
          // 超过当前元素高度的一半，返回下一个插入位置
          if (totalHeight - 0.5 * height <= top) {
            return i + 1
          }
          return i
        }
      }
      // 高度大于总体元素高度，返回i
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

  insertTemplateToMark(options) {
    // 创建并插入空div用于挂载FormItem
    const div = document.createElement('div')
    const beforeElement = this.el.childNodes[this.inserting.blockIndex]
    this.el.insertBefore(div, beforeElement)

    // 初始化参数是一个复制
    const newOptions = JSON.parse(JSON.stringify(options))
    const formItemConstructor = Vue.extend(FormItem)

    // click时设置active className
    const onMouseDown = () => {
      this.onTemplateClicked && this.onTemplateClicked(formItem)
    }

    const formItem = new formItemConstructor({
      el: div,
      propsData: {
        dropzone: this.ref,
        ...newOptions,
        onmousedown: onMouseDown
      }
    })

    onMouseDown()
    // 同步数据模型
    this.formItems.splice(this.inserting.blockIndex, 0, formItem)
    this.inserting.blockIndex = -1
  }


  moveTemplateToMark(item) {
    const moveFrom = this.formItems.indexOf(item)
    const moveTo = this.inserting.blockIndex
    // moveTo为moveFrom和moveFrom+1则未移动
    if (!(moveTo === moveFrom || moveTo === moveFrom + 1)) {
      // 下标越界(beforeElement不存在)即为append
      const beforeElement = this.el.childNodes[moveTo]
      this.el.insertBefore(item.$el, beforeElement)
      // 同步数据模型
      this.formItems.splice(moveFrom, 1) 
      this.formItems.splice(moveTo > moveFrom? moveTo - 1: moveTo, 0, item)
      this.inserting.blockIndex = -1
    }
  }

  removeItem(item) {
    const removeIndex = this.formItems.indexOf(item)
    this.formItems.splice(removeIndex, 1)
    if (item.$el && item.$el.parentNode) {
      item.$el.parentNode.removeChild(item.$el)
    }
    item.$destroy()
    this.onTemplateRemoved && this.onTemplateRemoved()
  }
}
