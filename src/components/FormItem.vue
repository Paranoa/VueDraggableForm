<template>
  <Drag :dropzone="dropzone" @dragmove="dragmove" @dragend="dragend" @droped="droped">
    <div @mousedown="mousedown">
      <template v-if="type === 'singleInput'">
        <div class="form-item">
          <i @click.stop="remove" class="form-item-remove">x</i>
          <label>{{ options.label }}</label>
          <span class="fr">{{ placeholder }}</span>
        </div>
      </template>
      <template v-else-if="type === 'singleSelect'">
        <div class="form-item" style="line-height: 60px">
          <i @click.stop="remove" class="form-item-remove">x</i>
          <label>{{ options.label }}</label>
          <span class="fr">{{ placeholder }} ></span>
        </div>
      </template>
    </div>
  </Drag>
</template>
<script>
  import Drag from '@/components/Drag/Drag'
  export default {
    props: {
      type: {
        type: String,
        default: 'singleInput'
      },
      dropzone: {
        type: Object
      },
      options: {
        type: Object,
        default () {
          return {
            label:'标题',
            placeholder: '请输入'
          }
        }
      },
      onMousedown: {
        type: Function
      },
      onRemove: {
        type: Function
      }
    },
    computed: {
      placeholder () {
        return this.options.placeholder + (this.options.required ? '（必填）' : '')
      }
    },
    components: {
      Drag
    },
    methods: {
      dragmove() {
        $(this.$el).addClass('dragging')
      },
      dragend() {
        $(this.$el).removeClass('dragging')
      },
      remove() {
        this.dropzone.$emit('removeItem', this)
        this.onRemove && this.onRemove(this)
      },
      droped() {
        this.dropzone.$emit('moveTemplateToMark', this)
      },
      mousedown () {
        this.onMousedown && this.onMousedown(this)
      }
    }
  }
</script>
<style>
  .fr { float: right }
  .form-item { line-height: 40px; position: relative; width: 300px; text-align: left; padding: 0 11px; box-sizing: border-box; border: 1px solid #999;}
  .form-item:hover {
    border-style: dotted;
    border-color: #38adff;
  }

  .ui-draggable.active .form-item {
    border-color: #38adff;
  }

  .ui-draggable.dragging .form-item {
    border: 1px solid #666;
    background: #ccc;
    opacity: .4;
  }

  .ui-draggable.active .form-item:hover {
    border-style: solid
  }

  .ui-draggable .form-item:hover .form-item-remove {
    display: block
  }

  .form-item-remove { display: none; position: absolute; right: 2px; top: 2px; line-height: 1; cursor: pointer; }
</style>