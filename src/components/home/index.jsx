import React, { useState } from 'react';
import { nanoid } from 'nanoid'
import Modal from '../modal/';

import TasksList from '../tasklist';
import './home.css';

function Home(props) {
    const [tasks, setTasks] = useState({});
    const [showNewListFields, setShowNewListFields] = useState(false);
    const [newListName, setNewListName] = useState('');
    const [showTaskEditModal, setShowTaskEditModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState({});
    const [selectedList, setSelectedList] = useState('');

    function handleAddList() {
        const newTasks = JSON.parse(JSON.stringify(tasks)); // for avoiding mutation

        if (newListName) {
            newTasks[nanoid()] = {
                name: newListName,
                tasks: [],
            }
        }

        setNewListName('');
        setShowNewListFields(false);
        setTasks(newTasks);
    }

    function handleAddTask(listId, data) {
        const newTasks = JSON.parse(JSON.stringify(tasks)); // for avoiding mutation
        newTasks[listId].tasks.push(data);
        setTasks(newTasks);
    }


    function handleTasksDrag(data) {
        const newTasks = JSON.parse(JSON.stringify(tasks)); // for avoiding mutation
        const { toId, fromId, task } = data;
        let newTask = {};

        console.log(data);
        const filteredTask = newTasks[fromId]?.tasks.filter(taskData => {
            if (taskData?.id !== task?.id) {
                return taskData;
            }
            newTask = taskData;
        });

        newTasks[fromId].tasks = [...filteredTask];
        newTasks[toId].tasks.push(newTask);
        setTasks(newTasks);
    }

    function handleTaskClick(data) {
        setSelectedTask(data?.task);
        setSelectedList(data?.listId);
        setShowTaskEditModal(true);
    }
    
    function handleModalClose() {
        setSelectedTask({});
        setSelectedList('');
        setShowTaskEditModal(false);
    }

    function handleSelectedTaskChange(value, key) {
        const task = { ...selectedTask };
        console.log(task,key)
        task[key] = value;

        setSelectedTask(task);
    }

    function handleTaskUpdate() {
        const newTasks = JSON.parse(JSON.stringify(tasks)); // for avoiding mutation
        const newTasksList = newTasks[selectedList].tasks.map(task => {
            if (selectedTask?.id === task.id) {
                return selectedTask;
            }
            return task;
        });

        newTasks[selectedList].tasks = [...newTasksList];
        setTasks(newTasks);
        handleModalClose();
    }
    
    return (
        <div>
            {
                showNewListFields && (
                    <>
                        <input 
                            onChange={(event) => {
                                setNewListName(event?.target?.value);
                            }}
                            placeholder="Add List Name" 
                        />
                        <button
                            onClick={handleAddList}
                        >Add</button>
                        <button onClick={() => { setShowNewListFields(false )}}>Cancel</button>
                    </>
                )
            }
            {
                !showNewListFields && (
                    <button
                        onClick={() => {
                             setShowNewListFields(true);
                        }}
                    >Add List</button>
                )
            }
            <div className="home-container">
                {
                    Object.keys(tasks).map(task => (
                        <TasksList 
                            title={tasks[task]?.name}
                            tasks={tasks[task]?.tasks}
                            id={task}
                            key={task}
                            onTasksChange={handleAddTask}
                            onDragEnd={handleTasksDrag}
                            onTaskClick={handleTaskClick}
                        />
                    ))
                }
            </div>
            
            <Modal
                showModal={showTaskEditModal}
                onModalClose={handleModalClose}
            >
                <div className="edit-modal">
                    <input 
                        className="title-edit"
                        value={selectedTask?.title}
                        onChange={e => handleSelectedTaskChange(e?.target?.value, 'title')}
                    />
                    <button
                        onClick={handleTaskUpdate}
                    >Submit</button>
                </div>
            </Modal>
        </div>
    );
}

export default Home;
