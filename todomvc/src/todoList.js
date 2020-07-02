import React,{Component} from "react"
function convertClass (obj) {
    let classStr = '';
    for (let key in obj) {
      if (obj[key]) {
        classStr += key + ' ';
      }
    }
    return classStr;
  }
  
class TodoList extends Component{
    constructor(){
        super()
        this.state={
            newContent:'', //新加的任务
            todos:[
              { id:1,isCompleted:true,content:'吃饭'},
              { id:2,isCompleted:false,content:'睡觉'},
              { id:3,isCompleted:true,content:'打豆豆'}
            ],
            editingId:-1,// 编辑中
            leftNum:0,// 剩余数
            toggleAll:false,
            showClear:false,
            filter:'#/'
        }
    }
    componentDidMount(){
        this.computeLeftCount()
        this.renderByHash();
    }

    renderList(){
        let { todos,editingId,filter} = this.state;
      
        // 如果是#/action 过滤掉数组中 isCompleted:true
        // 如果是#/completed 过滤掉数组中 isCompleted:false
        // todos = todos.filter();  让let todos指向别的地方，而再改let todos不会影响this.state.todos
   
        return todos.map((todo,index) => {
            //对单个todoitem进行过滤
           if (filter === '#/active' && todo.isCompleted) return null;
           if (filter === '#/completed' && !todo.isCompleted) return null;
  
           return  (<li key={todo.id} 
            className={ convertClass({completed:todo.isCompleted,editing:editingId === todo.id}) }>
                          <div className="view" >
                              <input className="toggle" type="checkbox" 
                              checked={todo.isCompleted} onChange={e=> this.checkBoxHandler(e,todo) }/>
                              <label onDoubleClick={e=>this.beginEdit(todo)}>{todo.content}</label>
                              <button className="destroy" onClick={ e=> this.delTodo(index)}></button>
                          </div>
                          <form onSubmit={e=>this.editOver(e)}>
                            <input className="edit" 
                            ref={'todo_'+ todo.id}
                            value={todo.content} 
                            onChange={e=>this.saveEdit(e,todo) }
                            onBlur={e=>this.editOver(e)}/>
                          </form>
                  </li>)
        });
    }
    checkBoxHandler(e,todo){
        todo.isCompleted=e.target.checked
        //更新视图
        this.setState({
            todos:this.state.todos
        })
        //重新计算剩余未完成的
        this.computeLeftCount()
    }
    beginEdit(todo){
        // console.log('双击触发了');
        this.setState({
            editingId:todo.id
        },()=>{
            // 再react异步渲染以后的行为，类似Vue中$nextTict函数
            // 让编辑框获取焦点
            this.refs['todo_' + todo.id].focus();
        });
    }
    //删除todoitem
    delTodo(index){
        const {todos} =this.state;
        todos.splice(index,1)
        this.setState({
            todos
        })
    }
    // 8: 离焦和回车的保存
    editOver(e){
        e.preventDefault();
        //失焦
        this.setState({
          editingId:-1
        });
    }
    saveEdit(e,todo){
        todo.content = e.target.value;
        // this.setState({});
         //更新视图
         this.setState({
            todos:this.state.todos
        })
        //重新计算剩余未完成的
        this.computeLeftCount()
    }
    addTodo(e){
        e.preventDefault();
         // 排除未输入的情况
        if (this.state.newContent.trim() === '') return;
        let maxId = -1;
        // 3.1 计算id
        this.state.todos.forEach( todo => {
            if (todo.id > maxId) maxId = todo.id;
        });
        maxId ++;
        this.state.todos.unshift({
            id:maxId,
            isCompleted:false,
            content:this.state.newContent
        });
        //视图更新
        this.setState({
            newContent:''
        })
        //计算剩余的
        this.computeLeftCount()

    }
     //2.接收输入的数据
    valueHandler(e) {
        this.setState({
        newContent:e.target.value
        });
    }
    filterRender(e){
        this.setState({filter:e.target.hash});
    }
    //切换成全部完成和都没完成
    changeToggleAll(e){
        let { checked } = e.target;
        // 遍历数组
        this.state.todos.forEach(todo => {
          todo.isCompleted = checked;
        });
        // 视图更新
        this.setState({
          toggleAll:checked
        });
        this.computeLeftCount()
    }
    //清除完成的
    clearCompleted(){
        const todos=this.state.todos.filter(todoItem=>!todoItem.isCompleted)
        this.setState({
            todos
        })
    }
    //计算未完成的
    computeLeftCount(){
        const leftNum=this.state.todos.filter(todoItem=>!todoItem.isCompleted).length
        const toggleAll=leftNum===this.state.todos.length

        this.setState({
            leftNum,
            toggleAll,
            showClear:!toggleAll
        })
    }
    // 14: 根据hash来过滤输出
    renderByHash () {
        this.setState({
            filter:window.location.hash
        });
        // 监视锚点后续改变
        window.addEventListener('hashchange',()=>{
            this.setState({
                filter:window.location.hash
            });
        });
    }
    render(){
        let { newContent,leftNum,toggleAll,showClear } = this.state;
      
        return(
            <React.Fragment>
            <section className="todoapp">
               <header className="header">
                   <h1>todos</h1>
                 {/*处理回车*/}
                   <form onSubmit={e=> this.addTodo(e) }>
                     <input className="new-todo" placeholder="What needs to be done?" autoFocus value={newContent} onChange={ e=> this.valueHandler(e) } onBlur={ e=> this.addTodo(e) }/>
                   </form>
               </header>
               {/* This section should be hidden by default and shown when there are todos */}
               <section className="main">
                   <input id="toggle-all" className="toggle-all" type="checkbox" onChange={e=>this.changeToggleAll(e) } checked={toggleAll}  />
                   <label htmlFor="toggle-all">Mark all as complete</label>
                   <ul className="todo-list">
                       {/* These are here just to show the structure of the list items */}
                       {/* List items should get the className `editing` when editing and `completed` when marked as completed */}
                       { this.renderList()  }
                       
                   </ul>
               </section>
               {/* This footer should hidden by default and shown when there are todos */}
               <footer className="footer">
                   {/* This should be `0 items left` by default */}
                   <span className="todo-count"><strong>{ leftNum }</strong> item left</span>
                   {/* Remove this if you don't implement routing */}
                   <ul className="filters">
                       <li>
                           <a className="selected" href="#/" onClick={e=>this.filterRender(e)}>All</a>
                       </li>
                       <li>
                           <a href="#/active" onClick={e=>this.filterRender(e)}>Active</a>
                       </li>
                       <li>
                           <a href="#/completed" onClick={e=>this.filterRender(e)}>Completed</a>
                       </li>
                   </ul>
                   {/*Hidden if no completed items are left ↓ */}
                   { showClear && <button className="clear-completed" onClick={ e=> this.clearCompleted()}>Clear completed</button> }
               </footer>
           </section>
           <footer className="info">
               <p>Double-click to edit a todo</p>
               {/* Remove the below line ↓ */}
               <p>Template by <a href="http://sindresorhus.com">Sindre Sorhus</a></p>
               {/* Change this out with your name and url ↓ */}
               <p>Created by <a href="http://todomvc.com">you</a></p>
               <p>Part of <a href="http://todomvc.com">TodoMVC</a></p>
           </footer>
         </React.Fragment>
        )
       
    }
}
export default TodoList