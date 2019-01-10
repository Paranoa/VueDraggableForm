<template>
  <div class="ui-draggable" @mousedown="mousedown($event)">
    <slot></slot>
  </div>
</template>
<script>
  import Store from './DragStore.js'
  import { getOffset } from '@/util'
  export default {
    name: 'Drag',
    props: {
      dropzone: {
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

        // 复制组件的innerHtml用于拖拽显示
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
            left: nl, top: nt, width, height
          }

          this.$emit('dragmove', event, offsets)

          if (this.dropzone) {
            this.dropzone.$emit('draggableMove', offsets)
          }
        }
      },
      mouseup (event) {
        if (this.isMouseDown) {
          const proxyContainer = Store.getProxyContainer()
          
          proxyContainer.style.display = 'none'
          this.isMouseDown = false
          this.$emit('dragend', event)

          const xOffset = event.clientX - this.x
          const yOffset = event.clientY - this.y
          // 未发生偏移时(只原地点击,未发生拖动) 不触发droped事件
          if (this.dropzone) {
            this.dropzone.$emit('draggableDragend', isHover => {
              isHover && this.$emit('droped', this.dropzone)
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