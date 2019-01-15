/**
 * 全局维护Drag用到的Html元素
**/
class DragStore {
  constructor() {
    this.dragElementContainer = null // 全局唯一的container
    this.proxyElement = null         // 当前被代理的拖拽元素
  }

  initProxyContainer(rootNode) {
    if (!this.dragElementContainer) {
      const el = document.createElement('div')
      el.className = 'proxy-container'
      rootNode.appendChild(el)
      this.dragElementContainer = el
    }
  }

  // 设置被代理的元素,以及拖拽时显示的html
  setProxyElement(element, proxyHtml) {
    this.proxyElement = element
    this.dragElementContainer.innerHTML = proxyHtml
  }

  getProxyContainer() {
    return this.dragElementContainer
  }

  getProxyElement() {
    return this.proxyElement
  }
}

export default new DragStore()
