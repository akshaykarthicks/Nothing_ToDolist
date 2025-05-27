document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');
    const taskCount = document.getElementById('taskCount');
    const clearCompletedBtn = document.getElementById('clearCompletedBtn');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const themeToggle = document.getElementById('themeToggle');
    const taskDialog = document.getElementById('taskDialog');
    const overlay = document.getElementById('overlay');
    const closeDialogBtn = document.getElementById('closeDialogBtn');
    const editTaskInput = document.getElementById('editTaskInput');
    const taskPriority = document.getElementById('taskPriority');
    const taskDueDate = document.getElementById('taskDueDate');
    const taskNotes = document.getElementById('taskNotes');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    // State
    let tasks = [];
    let currentFilter = 'all';
    let editingTaskId = null;

    // Initialize
    init();

    // Functions
    function init() {
        loadTasks();
        loadTheme();
        renderTasks();
        updateTaskCount();
        addEventListeners();
    }

    function loadTasks() {
        const savedTasks = localStorage.getItem('nothing-tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
    }

    function saveTasks() {
        localStorage.setItem('nothing-tasks', JSON.stringify(tasks));
    }

    function loadTheme() {
        const darkTheme = localStorage.getItem('nothing-dark-theme') === 'true';
        if (darkTheme) {
            document.body.classList.add('dark-theme');
        }
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-theme');
        localStorage.setItem('nothing-dark-theme', document.body.classList.contains('dark-theme'));
    }

    function addTask(text) {
        if (!text.trim()) return;

        const newTask = {
            id: Date.now().toString(),
            text: text.trim(),
            completed: false,
            priority: false,
            dueDate: '',
            notes: '',
            createdAt: new Date().toISOString()
        };

        tasks.unshift(newTask);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }

    function deleteTask(id) {
        tasks = tasks.filter(task => task.id !== id);
        saveTasks();
        renderTasks();
        updateTaskCount();
    }

    function toggleTaskComplete(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, completed: !task.completed };
            }
            return task;
        });
        saveTasks();
        renderTasks();
        updateTaskCount();
    }

    function toggleTaskPriority(id) {
        tasks = tasks.map(task => {
            if (task.id === id) {
                return { ...task, priority: !task.priority };
            }
            return task;
        });
        saveTasks();
        renderTasks();
    }

    function updateTaskCount() {
        const activeTasks = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasks} task${activeTasks !== 1 ? 's' : ''} left`;
    }

    function clearCompletedTasks() {
        tasks = tasks.filter(task => !task.completed);
        saveTasks();
        renderTasks();
    }

    function filterTasks(filter) {
        currentFilter = filter;
        filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        renderTasks();
    }

    function getFilteredTasks() {
        switch (currentFilter) {
            case 'active':
                return tasks.filter(task => !task.completed);
            case 'completed':
                return tasks.filter(task => task.completed);
            case 'priority':
                return tasks.filter(task => task.priority);
            default:
                return tasks;
        }
    }

    function formatDate(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    }

    function renderTasks() {
        const filteredTasks = getFilteredTasks();
        taskList.innerHTML = '';

        filteredTasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.className = `task-item${task.completed ? ' completed' : ''}`;
            taskItem.dataset.id = task.id;

            const dueDate = task.dueDate ? formatDate(task.dueDate) : '';
            const hasNotes = task.notes.trim() !== '';

            taskItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-text">
                        ${task.priority ? '<span class="priority-indicator"></span>' : ''}
                        ${task.text}
                    </div>
                    ${(dueDate || hasNotes) ? `
                        <div class="task-details">
                            ${dueDate ? `Due: ${dueDate}` : ''}
                            ${hasNotes ? (dueDate ? ' • ' : '') + 'Has notes' : ''}
                        </div>
                    ` : ''}
                </div>
                <div class="task-actions">
                    <button class="task-btn edit-btn">✎</button>
                    <button class="task-btn delete-btn">×</button>
                </div>
            `;

            // Add animation class for new tasks
            if (task.id === tasks[0]?.id && tasks.length > 1) {
                taskItem.classList.add('new');
                setTimeout(() => {
                    taskItem.classList.remove('new');
                }, 500);
            }

            taskList.appendChild(taskItem);
        });
    }

    function openTaskDialog(taskId = null) {
        editingTaskId = taskId;
        
        if (taskId) {
            const task = tasks.find(t => t.id === taskId);
            if (task) {
                editTaskInput.value = task.text;
                taskPriority.checked = task.priority;
                taskDueDate.value = task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '';
                taskNotes.value = task.notes;
            }
        } else {
            editTaskInput.value = '';
            taskPriority.checked = false;
            taskDueDate.value = '';
            taskNotes.value = '';
        }

        taskDialog.classList.add('active');
        overlay.classList.add('active');
        editTaskInput.focus();
    }

    function closeTaskDialog() {
        taskDialog.classList.remove('active');
        overlay.classList.remove('active');
        editingTaskId = null;
    }

    function saveTaskDetails() {
        const text = editTaskInput.value.trim();
        if (!text) return;

        if (editingTaskId) {
            // Update existing task
            tasks = tasks.map(task => {
                if (task.id === editingTaskId) {
                    return {
                        ...task,
                        text,
                        priority: taskPriority.checked,
                        dueDate: taskDueDate.value,
                        notes: taskNotes.value.trim()
                    };
                }
                return task;
            });
        } else {
            // Create new task
            const newTask = {
                id: Date.now().toString(),
                text,
                completed: false,
                priority: taskPriority.checked,
                dueDate: taskDueDate.value,
                notes: taskNotes.value.trim(),
                createdAt: new Date().toISOString()
            };
            tasks.unshift(newTask);
        }

        saveTasks();
        renderTasks();
        updateTaskCount();
        closeTaskDialog();
    }

    // Event Listeners
    function addEventListeners() {
        // Add task
        addTaskBtn.addEventListener('click', () => {
            const text = taskInput.value.trim();
            if (text) {
                addTask(text);
                taskInput.value = '';
                taskInput.focus();
            } else {
                openTaskDialog(); // Open dialog for detailed task creation
            }
        });

        taskInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const text = taskInput.value.trim();
                if (text) {
                    addTask(text);
                    taskInput.value = '';
                }
            }
        });

        // Task actions (using event delegation)
        taskList.addEventListener('click', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (!taskItem) return;
            
            const taskId = taskItem.dataset.id;

            if (e.target.classList.contains('task-checkbox')) {
                toggleTaskComplete(taskId);
            } else if (e.target.classList.contains('delete-btn')) {
                deleteTask(taskId);
            } else if (e.target.classList.contains('edit-btn')) {
                openTaskDialog(taskId);
            }
        });

        // Double click to edit
        taskList.addEventListener('dblclick', (e) => {
            const taskItem = e.target.closest('.task-item');
            if (taskItem && e.target.closest('.task-content')) {
                openTaskDialog(taskItem.dataset.id);
            }
        });

        // Filter tasks
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterTasks(btn.dataset.filter);
            });
        });

        // Clear completed
        clearCompletedBtn.addEventListener('click', clearCompletedTasks);

        // Theme toggle
        themeToggle.addEventListener('click', toggleTheme);

        // Task dialog
        closeDialogBtn.addEventListener('click', closeTaskDialog);
        overlay.addEventListener('click', closeTaskDialog);
        cancelEditBtn.addEventListener('click', closeTaskDialog);
        saveTaskBtn.addEventListener('click', saveTaskDetails);

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && taskDialog.classList.contains('active')) {
                closeTaskDialog();
            }
            
            if (e.key === 'Enter' && taskDialog.classList.contains('active')) {
                if (document.activeElement !== taskNotes) {
                    saveTaskDetails();
                }
            }
        });
    }

    // Add some sample tasks if there are none
    if (tasks.length === 0) {
        const sampleTasks = [
            {
                id: '1',
                text: 'Welcome to Nothing Todo',
                completed: false,
                priority: true,
                dueDate: '',
                notes: 'This is a minimalist todo app inspired by Nothing OS design.',
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                text: 'Try dark mode',
                completed: false,
                priority: false,
                dueDate: new Date().toISOString().split('T')[0],
                notes: 'Click the dot matrix icon in the top right to toggle between light and dark mode.',
                createdAt: new Date().toISOString()
            },
            {
                id: '3',
                text: 'Create a new task',
                completed: false,
                priority: false,
                dueDate: '',
                notes: 'Type in the input field and press Enter, or click the + button to add a task with more details.',
                createdAt: new Date().toISOString()
            }
        ];
        
        tasks = sampleTasks;
        saveTasks();
        renderTasks();
        updateTaskCount();
    }
});
