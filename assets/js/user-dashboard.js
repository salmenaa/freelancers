let tasks = [];
let currentEditId = null;

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('userTasks');
    tasks = saved ? JSON.parse(saved) : [];
    displayTasks();
    updateStats();
}

// Save tasks to localStorage
function saveTasks() {
    localStorage.setItem('userTasks', JSON.stringify(tasks));
}

// Add task
document.getElementById('taskForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = {
        id: Date.now(),
        title: document.getElementById('taskTitle').value,
        description: document.getElementById('taskDescription').value,
        date: document.getElementById('taskDate').value,
        status: document.getElementById('taskStatus').value,
        createdAt: new Date().toISOString()
    };

    tasks.push(task);
    saveTasks();
    document.getElementById('taskForm').reset();
    displayTasks();
    updateStats();
});

// Display tasks
function displayTasks() {
    const tasksList = document.getElementById('tasksList');
    
    if (tasks.length === 0) {
        tasksList.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>No tasks yet. Create your first task!</p>
            </div>
        `;
        return;
    }

    tasksList.innerHTML = tasks.map(task => `
        <div class="task-item">
            <div class="task-title">${escapeHtml(task.title)}</div>
            <div class="task-description">${escapeHtml(task.description) || 'No description'}</div>
            <div class="task-meta">
                <span class="task-date">📅 ${task.date}</span>
                <span class="task-status status-${task.status}">${capitalizeStatus(task.status)}</span>
            </div>
            <div class="task-actions">
                <button class="btn-edit" onclick="openEditModal(${task.id})">Edit</button>
                <button class="btn-status" onclick="cycleStatus(${task.id})">Update Status</button>
                <button class="btn-delete" onclick="deleteTask(${task.id})">Delete</button>
            </div>
        </div>
    `).join('');
}

// Update task status
function cycleStatus(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        const statuses = ['pending', 'in-progress', 'completed'];
        const currentIndex = statuses.indexOf(task.status);
        task.status = statuses[(currentIndex + 1) % statuses.length];
        saveTasks();
        displayTasks();
        updateStats();
    }
}

// Delete task
function deleteTask(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(t => t.id !== id);
        saveTasks();
        displayTasks();
        updateStats();
    }
}

// Open edit modal
function openEditModal(id) {
    const task = tasks.find(t => t.id === id);
    if (task) {
        currentEditId = id;
        document.getElementById('editTaskTitle').value = task.title;
        document.getElementById('editTaskDescription').value = task.description;
        document.getElementById('editTaskDate').value = task.date;
        document.getElementById('editTaskStatus').value = task.status;
        document.getElementById('editModal').style.display = 'block';
    }
}

// Close edit modal
function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
    currentEditId = null;
}

// Update task
document.getElementById('editForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const task = tasks.find(t => t.id === currentEditId);
    if (task) {
        task.title = document.getElementById('editTaskTitle').value;
        task.description = document.getElementById('editTaskDescription').value;
        task.date = document.getElementById('editTaskDate').value;
        task.status = document.getElementById('editTaskStatus').value;
        
        saveTasks();
        displayTasks();
        updateStats();
        closeEditModal();
    }
});

// Update stats
function updateStats() {
    document.getElementById('totalTasks').textContent = tasks.length;
    document.getElementById('pendingCount').textContent = tasks.filter(t => t.status === 'pending').length;
    document.getElementById('completedCount').textContent = tasks.filter(t => t.status === 'completed').length;
}

// Utility functions
function capitalizeStatus(status) {
    return status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function goBack() {
    window.location.href = 'index.html';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);
