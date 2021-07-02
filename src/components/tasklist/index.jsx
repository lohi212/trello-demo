import React, { useEffect, useState } from 'react';
import { nanoid } from 'nanoid';
import './taskslist.css';

function TaskList({ 
    title, 
    tasks, 
    id, 
    onTasksChange, 
    onDragEnd,
    onTaskClick,
}) {
    const [showTaskAddFields, setShowTaskAddFields] = useState(false);
    const [taskName, setTaskName] = useState('');

    function handleTaskChange() {
        onTasksChange(id, { title: taskName, id: nanoid() });
        setTaskName('');
        setShowTaskAddFields(false);
    }

    function handleDrop(event) {
        event.preventDefault();
        console.log(event.target);
        const data = event.dataTransfer.getData("task");
        const parsedData = JSON.parse(data);
        onDragEnd({ ...parsedData, toId: id });
    }

    function handleDragTask(event, task) {
        event.dataTransfer.setData("task", JSON.stringify({ task, fromId: id }));
    }

    return (
        <div 
            className="droppable task-list-container" 
            onDrop={handleDrop}
            onDragOver={e => { e.preventDefault()}}
        >
            <h3>{title}</h3>
            {
                tasks.map((task, index) => (
                    <div 
                        className="task" 
                        key={task?.id} 
                        id={task?.id}
                        onDragStart={event => {
                            handleDragTask(event, {...task });
                        }}
                        onClick={() => onTaskClick({ task, listId: id })}
                        draggable>
                        <p>{task.title}</p>
                    </div>
                ))
            }

            {
                showTaskAddFields && (
                    <>
                        <input 
                            onChange={(event) => {
                                setTaskName(event?.target?.value);
                            }}
                            placeholder="Add Task Title"
                        />
                        <button
                            onClick={handleTaskChange}
                        >Add</button>
                        <button onClick={() => { setShowTaskAddFields(false)}}>Cancel</button>
                    </>
                )
            }
            {
                !showTaskAddFields && (
                    <button onClick={() => setShowTaskAddFields(true)}>Add Task</button>
                )
            }
            
        </div>
    );
}

export default TaskList;
