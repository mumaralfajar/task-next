'use client';

import { useEffect, useState } from 'react';
import { getTasks, createTask, updateTask, deleteTask, Task } from '@/services/taskService';

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTasks();
  }, [currentPage]);

  const fetchTasks = async () => {
    try {
      const result = await getTasks(currentPage);
      setTasks(result.data.items);
      setTotalPages(result.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    }
  };

  const handleCreateTask = async () => {
    if (taskTitle && taskDescription) {
      const newTask = { title: taskTitle, description: taskDescription };
      await createTask(newTask);
      await fetchTasks();
      setTaskTitle('');
      setTaskDescription('');
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setTaskTitle(task.title);
    setTaskDescription(task.description);
  };

  const handleUpdateTask = async () => {
    if (editingTask) {
      await updateTask(editingTask.id!, {
        title: taskTitle,
        description: taskDescription,
      });
      fetchTasks();
      setEditingTask(null);
      setTaskTitle('');
      setTaskDescription('');
    }
  };

  const handleDeleteTask = async (id: number) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Task Management</h1>

        <div className="mb-4">
          <input
              type="text"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              placeholder="Task Title"
              className="border p-2 mr-2 text-black"
          />
          <input
              type="text"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="Task Description"
              className="border p-2 mr-2 text-black"
          />
          {editingTask ? (
              <button onClick={handleUpdateTask} className="bg-blue-500 text-white p-2 rounded">
                Update Task
              </button>
          ) : (
              <button onClick={handleCreateTask} className="bg-green-500 text-white p-2 rounded">
                Create Task
              </button>
          )}
        </div>

        <ul className="list-disc">
          {Array.isArray(tasks) && tasks.length > 0 ? (
              tasks.map((task) => (
                  <li key={task.id} className="mb-2">
                    <div className="flex justify-between items-center">
                      <span>
                        <strong>{task.title}:</strong> {task.description}
                      </span>
                      <div>
                        <button
                            onClick={() => handleEditTask(task)}
                            className="bg-yellow-500 text-white p-2 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                            onClick={() => handleDeleteTask(task.id!)}
                            className="bg-red-500 text-white p-2 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </li>
              ))
          ) : (
              <p>No tasks found.</p>
          )}
        </ul>

        {/* Pagination */}
        <div className="flex justify-center mt-4 text-black">
          <button
              onClick={() => handlePageChange(currentPage - 1)}
              className="mr-2 bg-gray-300 p-2 rounded"
              disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
              <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`mx-1 p-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}
              >
                {index + 1}
              </button>
          ))}
          <button
              onClick={() => handlePageChange(currentPage + 1)}
              className="ml-2 bg-gray-300 p-2 rounded"
              disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
  );
}
