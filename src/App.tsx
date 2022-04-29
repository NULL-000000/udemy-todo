import { FormControl, List, TextField} from "@material-ui/core"
import AddToPhotosIcons from "@material-ui/icons/AddToPhotos"
import TaskItem from "./TaskItem";
import { makeStyles } from "@material-ui/styles";
import React, { useState, useEffect } from 'react';
import styles from "./App.module.css";
import { db } from "./firebase";

const useStyles = makeStyles({
  field: {
    marginTop: 30,
    marginBottom: 20,
  },
  list: {
    margin: "auto",
    width: "40%",
  },
});

const App: React.FC = () => {
  const [tasks, setTasks] = useState([{ id: "", title: ""}]);
  const [input, setInput] = useState("");
  const classes = useStyles();

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
    <div className={styles.app__root}>
      <h1>Todo App by React/firebase</h1>
      <br />
      <FormControl>
        <TextField 
          className={classes.field}
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
      <button className={styles.app__icon} disabled={!input} onClick={newTask}>
        <AddToPhotosIcons />
      </button>

      <List className={classes.list}>
        {tasks.map((task) => (
          <TaskItem key={task.id} id={task.id} title={task.title}></TaskItem>
        ))}
      </List>
    </div>
  );
}

export default App;
