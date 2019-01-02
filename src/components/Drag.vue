<template>
  <div class="ui-draggable" @mousedown="mousedown($event)">
    <slot></slot>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { getOffset } from '@/util'
  export default {
    name: 'drag',
    props: {
      dropzoneName: {
        type: String,
      },
      dropzone: {
        type: Object
      }
    },
    computed: {
      ...mapState([
        'proxyContainer',
        'proxyedElement'
      ])
    },
    methods: {
      mousedown (event) {
        event.preventDefault()
        const element = event.target
        const { left: l, top: t } = getOffset(event.target)
        this.isMouseDown = true
        this.x = event.clientX
        this.y = event.clientY
        this.l = l
        this.t = t

        const htmlStr = this.$el.innerHTML
        // 复制组件的innerHtml用于拖拽显示
        if (this.proxyedElement !== element) {
          this.proxyContainer.innerHTML = htmlStr
        }
        this.$store.commit('setProxyElement', element)
        this.$emit('dragstart', event)
      },
      mousemove (event) {
        if (this.isMouseDown) {
          const nx = event.clientX
          const ny = event.clientY
          // 计算mousemove偏移量
          const nl = this.l + (nx - this.x)
          const nt = this.t + (ny - this.y)

          const width = this.$el.offsetWidth
          const height = this.$el.offsetHeight

          this.proxyContainer.style.left = nl + 'px'
          this.proxyContainer.style.top = nt + 'px'
          this.proxyContainer.style.display = 'block'
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
          this.proxyContainer.style.display = 'none'
          this.isMouseDown = false
          this.$emit('dragend', event)

          const xOffset = event.clientX - this.x
          const yOffset = event.clientY - this.y
          // 未发生偏移时(只原地点击,未发生拖动) 不触发droped事件
          if (!(xOffset === 0 && yOffset === 0) && this.dropzone) {
            this.dropzone.$emit('draggableDragend', isHover => {
              isHover && this.$emit('droped')
            })
          }
        }
      }
    },
    mounted () {
      if (!this.proxyContainer) {
        const el = document.createElement('div')
        el.className = 'proxy-container'
        this.$root.$el.appendChild(el)
        this.$store.commit('setProxyContainer', el)
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