import { TEXT } from "./const"
function createElement (type, config, ...children) {
    if (config) {
        delete config.__self;
        delete config.__source;
    }
    const props = {
        ...config,
        children: children.map(child => typeof child === 'object' ? child : createTextNode(child))
    }
    if (type && type.defaultProps) {
        const defaultProps = type.defaultProps;
        for (let propName in defaultProps) {
            if (props[propName] === undefined) {
                props[propName] = defaultProps[propName]
            }
        }
    }
    return {
        type, props
    }
}
//创建文本节点
function createTextNode (child) {
    return {
        type: TEXT,
        props: {
            children: [],//没有子节点
            nodeValue: child
        }


    }
}

export default { createElement }