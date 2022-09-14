import React from 'react';
import './TodoContainer.css';
import TodosList from '../TodosList/TodosList';

class TodoContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: '',
      todos: [
        {
          id: 1,
          title: 'Setup development environment',
          completed: true,
        },
        {
          id: 2,
          title: 'Develop website',
          completed: false,
        },
        {
          id: 3,
          title: 'Deploy to live server',
          completed: true,
        },
      ],
    };

    this.handleChange = this.handleChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.addCheck = this.addCheck.bind(this);
    this.modifyTitle = this.modifyTitle.bind(this);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  modifyTitle(index, title) {
    const id = parseInt(index, 10);
    const { todos } = this.state;
    const temporal = [...todos];

    const arr = temporal.map((obj) => {
      const shallowCopy = { ...obj };
      if (shallowCopy.id === id) {
        shallowCopy.title = title;
      }
      return shallowCopy;
    });

    this.setState({ todos: arr });
  }

  addItem() {
    const { input, todos } = this.state;
    const clean = input.trim();

    if (clean === '') return;

    const task = { id: todos.length + 1, title: clean, completed: false };

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
    const id = parseInt(event.target.id, 10);
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
        <input type="text" value={input} onChange={this.handleChange} />
        <button type="button" onClick={this.addItem}>Insert</button>
        <TodosList todos={todos} addCheck={this.addCheck} modifyTitle={this.modifyTitle} />
      </div>
    );
  }
}

export default TodoContainer;
