class DragStore {
  constructor() {
    this.dragElementContainer = null
    this.proxyElement = null
  }

  initProxyContainer(rootNode) {
    if (!this.dragElementContainer) {
      const el = document.createElement('div')
      el.className = 'proxy-container'
      rootNode.appendChild(el)
      this.dragElementContainer = el
    }
  }

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
