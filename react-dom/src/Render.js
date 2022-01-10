import { createRoot } from '../../react-reconciler';


export function render(element, container) {
  // const dom = renderDOM(element);
// 
  createRoot(element, container);
  // container.appendChild(dom);
}

export function renderDOM(element) {
  let dom = null;
  if (!element && element !== 0) return null;
  if (typeof element === 'string') {
    return document.createTextNode(element);
  }
  if (typeof element === 'number') {
    return document.createTextNode(element+'');
  }
  // if (Array.isArray(element)) {
  //   dom = document.createDocumentFragment();
  //   for (let item of element) {
  //     let child = renderDOM(item);
  //     dom.appendChild(child);
  //   }
  //   return dom;
  // }
  const {
    type, 
    props,
    props: { children, ...attributes }
  } = element;
  if (typeof type === 'string') {
    dom = document.createElement(type);
  } else if (typeof type === 'function') {
    dom = document.createDocumentFragment();
  }
  else {
    return null;
  }
  // if (children) {
  //   const childrenDOM = renderDOM(children);
  //   if (childrenDOM) {
  //     dom.appendChild(childrenDOM);
  //   }
  // }
  updateAttributes(dom, attributes);
  return dom;
}
function updateAttributes(dom, attributes) {
  if (!attributes) return;
  Object.keys(attributes).forEach(key => {
    if (key.startsWith('on')) {
      const eventName = key.slice(2).toLowerCase();
      dom.addEventListener(eventName, attributes[key]);
    } else if (key === 'className') {
      const classes = attributes[key].split(' ');
      classes.forEach(className => {
        dom.classList.add(className);
      })
    } else if (key === 'style') {
      Object.keys(attributes[key]).forEach(styleName => {
        dom.style[styleName] = attributes[key][styleName];
      })
    } else {
      dom[key] = attributes[key];
    }
  })
}