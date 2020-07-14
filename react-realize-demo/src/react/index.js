function createElement (type, config, ...children) {
    if (config) {
        delete config.__self;
        delete config.__source;
    }
    const props = {
        ...config,
        //处理文本节点
        children: children.map(child => typeof child === "object" ? child : createTextNode(child))
    }
    //处理defaultTypes
    if (type && type.defaultTypes) {
        const defaultTypes = type.defaultTypes
        for (let propName in defaultTypes) {
            if (props[propName] === undefined) {
                props[propName] = defaultTypes
            }
        }
    }
    return { type, props }
}
function createTextNode (text) {
    return {
        type: 'TEXT',
        props: {
            children: [],
            nodeValue: text
        },

    }
}
export default {
    createElement
}

