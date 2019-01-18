const getOffset = function(node, offset) {
  if (!offset) {
    offset = {
      left: 0,
      top: 0
    }
  }
  if (node === document.body) {
    return offset
  }
  offset.left += node.offsetLeft
  offset.top += node.offsetTop
  return getOffset(node.offsetParent, offset)
}

const clone = function(obj) {
  if (!obj || (typeof obj !== 'object')) return obj

  if (obj instanceof Date) {
    const copy = new Date()
    copy.setTime(obj.getTime())
    return copy
  }

  if (obj instanceof Array) {
    return obj.map(o => clone(o))
  }

  if (obj instanceof Object) {
    const copy = {}
    for (const attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr])
    }
    return copy
  }
}

export {
  getOffset,
  clone
}
