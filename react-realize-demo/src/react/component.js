class Component {
    static isReactComponent = {};
    constructor (props, context, updater) {
        this.props = props;
        this.context = context;
        this.refs = Object.create(null);
        this.updater = updater;
    }
    setState () {

    }
    forceUpdate () {

    }

}

export default Component