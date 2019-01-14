
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
    render: function(h) {
      console.log('render')
      return h(
        'h' + this.level,   // 标签名称
        this.$slots.default // 子元素数组
      )
    },
    mounted () {
      const vm = this
      const el = this.$el
      const offset = getOffset(el)

      this.dropZone = new DropZone(el, {
        left: offset.left,
        top: offset.top,
        width: el.offsetWidth,
        height: el.offsetHeight
      })

      this.$on('draggableMove', this.dropZone.detectMove.bind(this.dropZone))

      this.$on('draggableDragend', callback => {
        this.dropZone.removeMark()
        // 回调当前是否有元素位于Drop上方
        callback(this.dropZone.inserting.blockIndex !== -1)
      })

      this.$on('removeItem', this.dropZone.removeItem.bind(this.dropZone))

      this.$on('moveTemplateToMark', this.dropZone.moveTemplateToMark.bind(this.dropZone))

      this.$on('insertTemplateToMark', this.dropZone.insertTemplateToMark.bind(this.dropZone))
    }
  }
</script>