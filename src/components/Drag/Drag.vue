<template>
  <div class="ui-draggable" @mousedown="mousedown($event)">
    <slot></slot>
  </div>
</template>
<script>
/**
* @desc 拖拽组件
*
* @prop {Drop Component Instance} [drop]    - 监听此drag的drop组件实例
* @prop {String} [dragHtml]                 - 拖拽显示的html，不指定将显示该组件的innerHTML
*
* @event [dragstart]    - 拖拽动作开始时 param: 原生event
* @event [dragmove]     - 拖拽移动时 param: { left, top, width, height }
* @event [dragend]      - 拖拽结束时 param: 原生event
* @event [droped]       - 有drop prop时有效, 在drop上方dragend发生时, 触发droped. param: 当前dropIndex
*/
import Store from './DragStore.js'
import { getOffset } from '@/util'
export default {
  name: 'Drag',
  props: {
    drop: {
      type: Object
    },
    dragHtml: {
      type: String
    }
  },
  methods: {
    mousedown (event) {
      event.preventDefault()
      const element = event.target
      const { left: l, top: t } = getOffset(event.target)
      this.isMouseDown = true
      this.x = event.clientX + window.scrollX
      this.y = event.clientY + window.scrollY
      this.l = l
      this.t = t

      // 没有dragHtml属性则复制组件的innerHtml用于拖拽显示
      if (Store.getProxyElement() !== element) {
        Store.setProxyElement(element, this.dragHtml || this.$el.innerHTML)
      }
      this.$emit('dragstart', event)
    },
    mousemove (event) {
      if (this.isMouseDown) {
        const proxyContainer = Store.getProxyContainer()
        const nx = event.clientX
        const ny = event.clientY
        // 计算mousemove偏移量
        const nl = this.l + (nx - this.x)
        const nt = this.t + (ny - this.y)

        const width = this.$el.offsetWidth
        const height = this.$el.offsetHeight

        proxyContainer.style.left = nl + 'px'
        proxyContainer.style.top = nt + 'px'
        proxyContainer.style.display = 'block'

        const offsets = {
          left: nl + window.scrollX,
          top: nt + window.scrollY,
          width,
          height
        }

        this.$emit('dragmove', event, offsets)
        if (this.drop) {
          this.drop.$emit('draggableMove', offsets)
        }
      }
    },
    mouseup (event) {
      if (this.isMouseDown) {
        const proxyContainer = Store.getProxyContainer()
        proxyContainer.style.display = 'none'

        this.isMouseDown = false
        this.$emit('dragend', event)

        if (this.drop) {
          this.drop.$emit('draggableDragend', index => {
            index > -1 && this.$emit('droped', index)
          })
        }
      }
    }
  },
  mounted () {
    if (!Store.getProxyContainer()) {
      Store.initProxyContainer(this.$root.$el)
    } 

    window.addEventListener('mousemove', this.mousemove)
    window.addEventListener('mouseup', this.mouseup)
  },
  beforeDestroy () {
    window.removeEventListener('mousemove', this.mousemove)
    window.removeEventListener('mouseup', this.mouseup)
  }
}
</script>
<style>
  .proxy-container { position: fixed; cursor: move; display: none }
  .ui-draggable { display: inline-block; cursor: move; }
</style>