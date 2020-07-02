export const countReducer=(state=0,action)=>{
    switch (action.type) {
        case "ADD":
          return state + (action.payload || 1);
        case "MINUS":
          return state - (action.payload || 1);
        default:
          return state;
      }
}
export  const todoReducer=(state = [], action)=> {
    switch (action.type) {
    case 'ADD_TODO':
      return state.concat([action.text])
    default:
      return state
    }
  }