<template>
  <Drop ref="drop">
    <FormItem v-for="(item, index) in items"
      :key="index"
      :class="{ 'active': activeItem === item }"
      :type="item.type"
      :options="item.options"
      :drop="$refs.drop"
      @mousedown="onItemClicked(index)"
      @templateRemove="onTemplateRemove(index)"
      @templateMove="toIndex => onTemplateMove(index, toIndex)"
     />
  </Drop>
</template>
<script>
/**
* @desc 可拖拽表单组件: 组合使用放置组件(Drop)与表单项拖拽组件(FormItem)List
*
* @prop {Array}  [items]         - 表单项配置对象列表，将应用到FormItem的prop上
* @prop {Object} [activeItem]    - 当前激活的表单项
*
* @event [itemClicked]    - 一个表单项被点击后调用 参数:索引 
* @event [itemRemoved]    - 一个表单项被删除后调用 
*/
import Drop from '@/components/Drop/Drop'
import FormItem from '@/components/FormItem'
export default {
  props: {
    items: {
      type: Array
    },
    activeItem: {}
  },
  components: {
    Drop,
    FormItem
  },
  methods: {
    onItemClicked(index) {
      this.$emit('itemClicked', index)
    },
    onTemplateMove(index, toIndex) {
      const item = this.items[index]
      this.items.splice(index, 1) 
      this.items.splice(toIndex, 0, item)
    },
    onTemplateRemove(index) {
      this.items.splice(index, 1) 
      this.$emit('itemRemoved', index)
    }
  }
}
</script>