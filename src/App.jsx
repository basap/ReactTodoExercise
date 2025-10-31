import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Row from './components/Row'

const url = "http://localhost:3001"

function App() {
  const [task, setTask] = useState('')
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    axios.get(url)
      .then(response => {
        setTasks(response.data)
      })
      .catch(error => {
        alert(error.response?.data?.message || error)
      })
  }, [])

  const addTask = () => {
    if (!task.trim()) return

    axios.post(url + "/create", { task })
      .then(response => {
        setTasks([...tasks, response.data])
        setTask('')
      })
      .catch(error => {
        alert(error.response?.data?.error?.message || error)
      })
  }

  const deleteTask = (deletedId) => {
    axios.delete(`${url}/delete/${deletedId}`)
      .then(() => {
        setTasks(tasks.filter(item => item.id !== deletedId))
      })
      .catch(error => {
        alert(error.response?.data?.error?.message || error)
      })
  }

  return (
    <div>
      <h3>Todos</h3>
      <form>
        <input
          placeholder='Add new task'
          value={task}
          onChange={e => setTask(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTask()
            }
          }}
        />
      </form>
      <ul>
        {tasks.map(item => (
          <Row item={item} key={item.id} deleteTask={deleteTask} />
        ))}
      </ul>
    </div>
  )
}

export default App
