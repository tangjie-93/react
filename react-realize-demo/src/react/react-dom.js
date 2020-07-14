//将vnode渲染为真实node，然后将node添加到父容器中
function render (vnode, container) {
    const node = createNode(vnode);
    container.appendChild(node);
}
//将vnode转换为真实node
function createNode (vnode) {
    const { type, props } = vnode;
    let node;
    if (type === "TEXT") {
        node = document.createTextNode("");
    } else {
        const nodeType = typeof type;
        switch (nodeType) {
            case 'string':
                node = document.createElement(type);
                break;
            case "function":
                //函数式组件和类组件
                node = type.isReactComponent ? updCompateClassComp(vnode)
                    : updateFunctionComp(vnode)
                break;
            default:
                node = document.createDocumentFragment();
        }
    }


    reconcileChildren(props.children, node);
    //添加属性
    updateNode(node, props)
    return node;
}
//遍历子节点 编译child vnode为node
function reconcileChildren (children, node) {
    children.forEach(child => {

        if (Array.isArray(child)) {
            child.forEach(item => {
                //将子 vnode转为 node
                render(child, node);
            })
        } else {
            //将子 vnode转为 node
            render(child, node);
        }
    })
}
//将props中的属性添加到node上来
function updateNode (node, props) {
    //需要过滤掉children
    Object.keys(props).filter(k => k !== 'children').forEach(k => {
        node[k] = props[k]
    })
}
function updateFunctionComp (vnode) {
    const { type, props } = vnode;
    //type是一个函数,vvnode是执行函数后的 经过babel-loader编译后的返回值(vnode){type,props}
    const vvnode = type(props);
    const node = createNode(vvnode);
    return node;
}
function updCompateClassComp (vnode) {
    const { type, props } = vnode;
    const vvnode = new type(props);
    const node = createNode(vvnode);
    return node;

}
export default { render }