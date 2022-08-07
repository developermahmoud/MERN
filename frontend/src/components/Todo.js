const Todo = ({todo}) => {
    return (
        <div className="todo-details">
            <h4>{todo.content}</h4>
            <p>{todo.createdAt}</p>
        </div>
    )
}

export default Todo