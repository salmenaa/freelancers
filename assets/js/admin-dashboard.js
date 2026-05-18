let allTasks = [];

// Load tasks from localStorage
function loadTasks() {
    const saved = localStorage.getItem('userTasks');
    allTasks = saved ? JSON.parse(saved) : [];
    updateDashboard();
    displayTasks();
}

// Update dashboard statistics
function updateDashboard() {
    const total = allTasks.length;
    const completed = allTasks.filter(t => t.status === 'completed').length;
    const inProgress = allTasks.filter(t => t.status === 'in-progress').length;
    const pending = allTasks.filter(t => t.status === 'pending').length;

    document.getElementById('totalTasksAdmin').textContent = total;
    document.getElementById('completedTasksAdmin').textContent = completed;
    document.getElementById('inProgressTasksAdmin').textContent = inProgress;
    document.getElementById('pendingTasksAdmin').textContent = pending;

    updateCharts();
}

// Update charts
function updateCharts() {
    updateStatusChart();
    updatePriorityChart();
}

// Update status chart
function updateStatusChart() {
    const statuses = {
        'pending': 0,
        'in-progress': 0,
        'completed': 0
    };

    allTasks.forEach(task => {
        if (statuses.hasOwnProperty(task.status)) {
            statuses[task.status]++;
        }
    });

    const total = allTasks.length || 1;
    let html = '';

    for (const [status, count] of Object.entries(statuses)) {
        const percentage = (count / total) * 100;
        const label = status.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        
        html += `
            <div class="chart-bar">
                <div class="chart-label">${label}</div>
                <div class="chart-bar-bg">
                    <div class="chart-bar-fill" style="width: ${percentage}%">${count}</div>
                </div>
                <div class="chart-value">${count}</div>
            </div>
        `;
    }

    document.getElementById('statusChart').innerHTML = html;
}

// Update priority chart (simulated)
function updatePriorityChart() {
    const priorities = {
        'High': Math.ceil(allTasks.length * 0.2),
        'Medium': Math.ceil(allTasks.length * 0.5),
        'Low': Math.floor(allTasks.length * 0.3)
    };

    const total = allTasks.length || 1;
    let html = '';

    for (const [priority, count] of Object.entries(priorities)) {
        const percentage = (count / total) * 100;
        
        html += `
            <div class="chart-bar">
                <div class="chart-label">${priority}</div>
                <div class="chart-bar-bg">
                    <div class="chart-bar-fill" style="width: ${percentage}%">${count}</div>
                </div>
                <div class="chart-value">${count}</div>
            </div>
        `;
    }

    document.getElementById('priorityChart').innerHTML = html;
}

// Display tasks in table
function displayTasks() {
    const tableBody = document.getElementById('tasksTableBody');
    const searchValue = document.getElementById('searchBox').value.toLowerCase();
    const statusFilter = document.getElementById('filterStatus').value;

    let filteredTasks = allTasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchValue) || 
                             task.description.toLowerCase().includes(searchValue);
        const matchesStatus = !statusFilter || task.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (filteredTasks.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align: center; padding: 40px;">
                    <div class="empty-state">
                        <div class="empty-state-icon">🔍</div>
                        <p>No tasks found matching your criteria</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    tableBody.innerHTML = filteredTasks.map(task => {
        const createdDate = new Date(task.createdAt).toLocaleDateString();
        const statusClass = `status-${task.status}`;
        const statusLabel = capitalizeStatus(task.status);

        return `
            <tr>
                <td><strong>${escapeHtml(task.title)}</strong></td>
                <td>${escapeHtml(task.description || '-')}</td>
                <td>${task.date}</td>
                <td><span class="status-badge ${statusClass}">${statusLabel}</span></td>
                <td>${createdDate}</td>
                <td><button class="btn-delete" onclick="deleteTaskFromAdmin(${task.id})">Delete</button></td>
            </tr>
        `;
    }).join('');
}

// Filter tasks
function filterTasks() {
    displayTasks();
}

// Delete task from admin
function deleteTaskFromAdmin(id) {
    if (confirm('Are you sure you want to delete this task?')) {
        allTasks = allTasks.filter(t => t.id !== id);
        localStorage.setItem('userTasks', JSON.stringify(allTasks));
        updateDashboard();
        displayTasks();
    }
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

// Load tasks on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Refresh data every 5 seconds
setInterval(() => {
    const saved = localStorage.getItem('userTasks');
    const newTasks = saved ? JSON.parse(saved) : [];
    if (JSON.stringify(newTasks) !== JSON.stringify(allTasks)) {
        allTasks = newTasks;
        updateDashboard();
        displayTasks();
    }
}, 5000);
