import {
  renderDOM
} from '../../react-dom'

let nextUnitOfWork = null;
let rootFiber = null;
let currentRoot = null;

export function createRoot(element, container) {
  rootFiber = {
    stateNode: container,
    element: {
      props: {
        children: [element]
      },
    }
   
  }
  nextUnitOfWork = rootFiber;
}

function workLoop(deadline) {
  let shouldYield = false;
  while(nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && rootFiber) {
    // console.log(rootFiber, '--rootFiber');
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);


function commitRoot() {
  commitWork(rootFiber.child);
  rootFiber = null;
}

function commitWork(fiber) {
  if (!fiber) return;
  commitWork(fiber.child);
  const domParent = fiber.return.stateNode;
  domParent.appendChild(fiber.stateNode);
  commitWork(fiber.sibling);
}



function performUnitOfWork(workInProgress) {
  console.log('workInProgress:', workInProgress);
  if (!workInProgress.stateNode) {
    workInProgress.stateNode = renderDOM(workInProgress.element);
  }

  // if (workInProgress.return  && workInProgress.stateNode) {
  //   let parentFiber = workInProgress.return;
  //   while(!parentFiber.stateNode) {
  //     parentFiber = parentFiber.return;
  //   }
  //   parentFiber.stateNode.appendChild(workInProgress.stateNode);
  // }

  let children = workInProgress.element.props && workInProgress.element.props.children;
  let type = workInProgress.element.type;

  if (typeof type === 'function') {
    if (type.prototype.isReactComponent) {
      const { props, type: Comp } = workInProgress.element;
      const component = new Comp(props);
      const jsx = component.render();
      children = [jsx];
    } else {
      const {props, type: Fn, } = workInProgress.element;
      const jsx = Fn(props);
      children = [jsx];
    }
  }
  if (children && (children || children.length === 0)) {
    let elements = Array.isArray(children) ? children : [children];
    elements = elements.flat();
    let index = 0;
    let prevSibling = null;
    while(index < elements.length) {
      const element = elements[index];
      let newFiber = {
        element,
        stateNode: null,
        return: workInProgress,
      }
      if (index === 0) {
        workInProgress.child = newFiber;
      } else {
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
      index++;
    }
  }

  if (workInProgress.child) {
    return workInProgress.child;
  } 

  let nextFiber = workInProgress;
  while(nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.return;
  }

  return null;
}