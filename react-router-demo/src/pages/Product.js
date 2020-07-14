import React, { Component } from "react"
import { Prompt } from "../Trouter/Prompt"
import withRouter from "../Trouter/WithRouter"

@withRouter
class Product extends Component {
    constructor (props) {
        super(props);
        this.state = { confirm: true };
    }
    render () {
        debugger
        const { id } = this.props.match.params;
        console.log("props", this.props); //sy-log
        return (
            <div>
                Product:{id}
                <Prompt
                    when={this.state.confirm}
                    message="Are you sure you want to leave?"
                />
            </div>
        );
    }
}
export default Product
// function Product(props) {
//   const match = useRouteMatch();
//   const history = useHistory();
//   const location = useLocation();
//   const _params = useParams();
//   console.log("match", match); //sy-log
//   // const {match} = props;
//   const {params, url} = match;
//   const {id} = params;

//   return (
//     <div>
//       Product:{id}
//       <Link to={url + "/detail"}>详情</Link>
//       <Route path={url + "/detail"} component={Detail} />
//     </div>
//   );
// }