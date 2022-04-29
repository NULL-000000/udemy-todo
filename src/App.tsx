import { FormControl, List, TextField} from "@material-ui/core"
import AddToPhotosIcons from "@material-ui/icons/AddToPhotos"
import TaskItem from "./TaskItem";
import React, { useState, useEffect } from 'react';
import './App.css';
import { db } from "./firebase";

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: ""}]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const unSub = db.collection("tasks").onSnapshot((snapshot) => {
      setTasks(
        snapshot.docs.map((doc) => ({id: doc.id, title: doc.data().title }))
      );
    });
    return () => unSub();
  }, []);

  const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
    db.collection("tasks").add({title: input});
    setInput("");
  };

  return (
    <div className="App">
      <h1>Todo App by React/firebase</h1>
      <FormControl>
        <TextField 
          InputLabelProps={{
            shrink: true,
          }}
          label="New task ?"
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => 
            setInput(e.target.value)
          }
        />
      </FormControl>
      <button disabled={!input} onClick={newTask}>
        <AddToPhotosIcons />
      </button>

      <List>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title}></TaskItem>
        ))}
      </List>
    </div>
  );
}

export default App;
