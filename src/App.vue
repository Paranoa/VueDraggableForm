<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.fr {
  float: right
}
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

.form-item-remove { display: none; position: absolute; right: 2px; top: 2px; line-height: 1; cursor: pointer; z-index: 1 }
.drag-item { width: 200px; height: 40px; border: 1px solid #aaa; background: #eee }
.drop-zone { float:left; width: 300px; border: 1px solid #aaa; height: 500px; position: relative; margin-left: 100px }
.drop-zone .drop-zone-mark { border: 1px solid red; width: 100%; margin: 5px 0;}
</style>
