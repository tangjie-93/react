import { TEXT, PLACEMENT } from "./const"
let nextUnitOfWork = null;//下一个单元任务
let wipRoot = null;
function render (vnode, container) {
    //构建根节点
    wipRoot = {
        //真实节点
        node: container,
        props: {
            //虚拟节点
            children: [vnode]
        }
    }
    //首先执行根节点
    nextUnitOfWork = wipRoot;
}
function createNode (fiber) {
    const { type, props } = fiber;
    let node = null
    if (type === TEXT) {
        node = document.createTextNode("")
    } else if (typeof type === 'string') {
        node = document.createElement(type);
    }
    //更新node属性
    updateNode(node, props);
    return node;
}

function updateNode (node, props) {
    Object.keys(props).filter(key => key !== 'children').forEach(key => {
        console.log(key)
        //判断是否是事件
        if (key.slice(0, 2) === 'on') {
            const eventName = key.slice(2).toLowerCase();
            node.addEventListener(eventName, props[key])
        } else {
            node[key] = props[key];
        }

    })
}

function updateFunctionComp (fiber) {
    const { type, props } = fiber;
    const vvnode = type(props);
    const children = [vvnode]
    reconcileChildren(fiber, children)
}
function updateClassComp (fiber) {
    const { type, props } = fiber;
    const cmp = new type(props);
    const children = [cmp.render()]
    reconcileChildren(fiber, [children])
}
//更新原生标签节点
function updateHostComponent (fiber) {
    //构建当前结点
    if (!fiber.node) {
        fiber.node = createNode(fiber)
    }
    //协调子元素
    const { children } = fiber.props;
    reconcileChildren(fiber, children)
}
//协调子元素,构造链表
function reconcileChildren (wipFiber, children) {
    let prevSibling = null;
    for (let i = 0; i < children.length; i++) {
        let child = children[i];
        let newFiber = {
            type: child.type,
            props: child.props,
            node: null,
            base: null,
            return: wipFiber,
            effectTag: PLACEMENT
        }
        //构造链表
        if (i === 0) {
            wipFiber.child = newFiber;
        } else {
            prevSibling.sibling = newFiber;
        }
        prevSibling = newFiber
    }
}
//1、执行当前任务
//2、返回下一个单元任务
function perfromUnitOfWork (fiber) {
    //1、执行当前任务
    const { type } = fiber;
    if (typeof type === 'function') {
        type.isReactComponent ? updateClassComp(fiber) : updateFunctionComp(fiber)
    } else {
        updateHostComponent(fiber)
    }


    //2、返回下一个单元任务，查找子节点
    if (fiber.child) {
        //返回下一个单元任务
        return fiber.child
    }
    //查找兄弟结点
    let nextFiber = fiber;
    while (nextFiber) {
        if (nextFiber.sibling) {
            return nextFiber.sibling
        }
        //查找父节点
        nextFiber = nextFiber.return

    }
}
function workLoop (deadLine) {
    while (nextUnitOfWork && deadLine.timeRemaining() > 1) {
        nextUnitOfWork = perfromUnitOfWork(nextUnitOfWork)
    }
    //执行增、删、改操作的地方
    if (!nextUnitOfWork && wipRoot) {
        //commit
        commitRoot();

    }
    requestIdleCallback(workLoop)
}
function commitRoot () {
    //wipRoot是跟，不要提交
    commitWorker(wipRoot.child);
    wipRoot = null;
}
function commitWorker (fiber) {
    if (!fiber) {
        return;
    }
    let parentFiber = fiber.return;
    //向上查找，因为有些fiber没有node结点
    while (!parentFiber.node) {
        parentFiber = parentFiber.return
    }
    const parentNode = parentFiber.node;
    if (fiber.effectTag === PLACEMENT && fiber.node !== null) {
        parentNode.appendChild(fiber.node)
    }

    commitWorker(fiber.child)
    commitWorker(fiber.sibling)

}
requestIdleCallback(workLoop)

export default { render }