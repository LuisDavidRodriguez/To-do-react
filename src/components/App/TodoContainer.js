import React from 'react';
import { v4 as uuidv4 } from 'uuid';
import './TodoContainer.scss';
import TodosList from '../TodosList/TodosList';

class TodoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      todos: [],
    };

    this.handleChange = this.handleChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.addCheck = this.addCheck.bind(this);
    this.modifyTitle = this.modifyTitle.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
    this.handleEnter = this.handleEnter.bind(this);
  }

  componentDidMount() {
    const todosLocal = JSON.parse(localStorage.getItem('todos')) || [];
    this.setState({ todos: todosLocal });
  }

  componentDidUpdate() {
    const { todos } = this.state;
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleEnter(event) {
    if (event.key !== 'Enter') return;

    this.addItem();
  }

  modifyTitle(index, title) {
    const { todos } = this.state;
    const temporal = [...todos];

    const arr = temporal.map((obj) => {
      const shallowCopy = { ...obj };
      if (shallowCopy.id === index) {
        shallowCopy.title = title;
      }
      return shallowCopy;
    });

    this.setState({ todos: arr });
  }

  deleteItem(index) {
    this.setState((previousState) => {
      const { todos } = previousState;

      const newArr = todos.filter(({ id }) => id !== index);
      return { todos: newArr };
    });
  }

  addItem() {
    const { input } = this.state;
    const clean = input.trim();
    const uniqueId = uuidv4();

    if (clean === '') return;

    const task = { id: uniqueId, title: clean, completed: false };

    this.setState((previousState) => {
      const temp = [...previousState.todos];
      temp.push(task);

      return {
        input: '',
        todos: temp,
      };
    });
  }

  addCheck(event) {
    const { id } = event.target;
    const { todos } = this.state;
    const temporal = [...todos];

    const arr = temporal.map((obj) => {
      const shallowCopy = { ...obj };
      if (shallowCopy.id === id) {
        shallowCopy.completed = event.target.checked;
      }
      return shallowCopy;
    });

    this.setState({ todos: arr });
  }

  render() {
    const { todos, input } = this.state;

    return (
      <div className="App">
        <div>
          <input type="text" value={input} onChange={this.handleChange} onKeyPress={this.handleEnter} />
          <button type="button" onClick={this.addItem}>Insert</button>
        </div>
        <TodosList
          todos={todos}
          addCheck={this.addCheck}
          modifyTitle={this.modifyTitle}
          deleteItem={this.deleteItem}
        />
      </div>
    );
  }
}

export default TodoContainer;
