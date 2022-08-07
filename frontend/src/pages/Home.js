import {useEffect, useState} from 'react'
import Todo from '../components/Todo';
const Home = () => {
    const [todos, setTodos] = useState(null)
    useEffect(()=>{
        const getTodos = async () => {
            const res = await fetch('http://localhost:5000/api/todos')
            const json = await res.json()

            if (res.ok) {
                setTodos(json)
            }
        }
        console.log('i fire once');
        getTodos()
    }, [])

  return (<div className='home'>
    <div className='todos'>
        {todos && todos.map((todo)=>(
            <Todo key={todo._id} todo={todo} />
        ))}
    </div>
  </div>)
};

export default Home;
