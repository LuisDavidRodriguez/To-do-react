import React, { Component, useState } from 'react';
import PropTypes from 'prop-types';
import { DndProvider, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as iconsRegular from '@fortawesome/free-regular-svg-icons';
import styles from './todosList.module.scss';
import itemTypes from '../../modules/constants';

// eslint-disable-next-line react/prefer-stateless-function
export default class TodosList extends Component {
  render() {
    const {
      todos,
      addCheck,
      modifyTitle,
      deleteItem,
    } = this.props;

    const items = todos.map((object) => (
      <ItemList
        key={object.id}
        id={object.id}
        title={object.title}
        completed={object.completed}
        addCheck={addCheck}
        modifyTitle={modifyTitle}
        deleteItem={deleteItem}
      />
    ));

    return (
      <DndProvider backend={HTML5Backend}>
        <ul className={styles.list}>
          {items}
        </ul>
      </DndProvider>
    );
  }
}

const ItemList = (props) => {
  const {
    id,
    title,
    completed,
    addCheck,
    modifyTitle,
    deleteItem,
  } = props;
  const [input, setInput] = useState(title);
  const [readOnly, setReadOnly] = useState(true);

  const [{ isDragging }, drag] = useDrag(() => ({
    type: itemTypes.TASK,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const handleInput = (event) => {
    setInput(event.target.value);
  };

  const handleEnter = (event) => {
    if (event.key === 'Enter') {
      const clean = input.trim();
      if (clean === '') {
        console.log('The value is empty');
        return;
      }
      setInput(clean);
      modifyTitle(event.target.id, clean);
      setReadOnly(true);
    }
  };

  const handleDoubleClick = () => {
    setReadOnly(false);
  };

  const handleBlur = () => {
    setReadOnly(true);
    setInput(title);
  };

  const inputStyle = {};
  inputStyle.textDecoration = 'none';

  if (completed) {
    inputStyle.textDecoration = readOnly ? 'line-through' : 'none';
  }

  const inputClassName = readOnly ? styles.input : `${styles.input} ${styles.readOnly}`;

  return (
    <li
      id={id}
      className={styles.taskContainer}
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        fontSize: 25,
        fontWeight: 'bold',
        cursor: 'move',
      }}
    >
      <input id={id} type="checkbox" checked={completed} onChange={addCheck} />
      <input
        id={id}
        value={input}
        onChange={handleInput}
        onDoubleClick={handleDoubleClick}
        onBlur={handleBlur}
        onKeyPress={handleEnter}
        style={inputStyle}
        readOnly={readOnly}
        className={inputClassName}
        title="Double click to edit me! :D"
      />
      <span className={styles.trashContainer}>
        <FontAwesomeIcon
          id={id}
          icon={iconsRegular.faTrashAlt}
          className={styles.icons}
          onClick={(event) => deleteItem(event.target.id)}
        />
      </span>
    </li>
  );
};

ItemList.defaultProps = {
  deleteItem: null,
  modifyTitle: null,
  id: '0',
  title: '',
  completed: false,
  addCheck: null,
};

ItemList.propTypes = {
  deleteItem: PropTypes.func,
  modifyTitle: PropTypes.func,
  id: PropTypes.string,
  title: PropTypes.string,
  completed: PropTypes.bool,
  addCheck: PropTypes.func,
};

TodosList.defaultProps = {
  deleteItem: null,
  modifyTitle: null,
  addCheck: null,
  todos: [],
};

TodosList.propTypes = {
  deleteItem: PropTypes.func,
  modifyTitle: PropTypes.func,
  addCheck: PropTypes.func,
  todos: PropTypes.arrayOf(
    PropTypes.shape(
      {
        id: PropTypes.string,
        title: PropTypes.string,
        completed: PropTypes.bool,
      },
    ),
  ),
};
