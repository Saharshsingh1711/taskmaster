document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('newTaskInput');
    const activeTasksList = document.getElementById('activeTasks');
    const completedTasksList = document.getElementById('completedTasks');
    const canvas = document.getElementById('confetti-canvas');
    const ctx = canvas.getContext('2d');

    // Setup Canvas
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];

    // Handle Add new Task
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && taskInput.value.trim() !== '') {
            const taskText = taskInput.value.trim();
            taskInput.value = '';

            const li = document.createElement('li');
            li.className = 'app-task-item';
            li.innerHTML = `
                <label class="app-checkbox">
                    <input type="checkbox">
                    <span class="app-checkmark"></span>
                </label>
                <div class="task-details">
                    <span class="task-title">${taskText}</span>
                </div>
            `;

            activeTasksList.prepend(li);
            attachCheckboxListener(li.querySelector('input[type="checkbox"]'));
        }
    });

    // Attach listener to existing checkboxes
    document.querySelectorAll('.app-checkbox input').forEach(checkbox => {
        attachCheckboxListener(checkbox);
    });

    function attachCheckboxListener(checkbox) {
        checkbox.addEventListener('change', function (e) {
            const listItem = this.closest('.app-task-item');
            const isSubtask = this.closest('.subtask-item');

            if (this.checked) {
                // Determine coordinates for confetti
                const rect = this.getBoundingClientRect();
                fireConfetti(rect.left + rect.width / 2, rect.top + rect.height / 2);

                if (isSubtask) {
                    isSubtask.classList.add('done');
                } else if (listItem) {
                    listItem.style.animation = "slideOut 0.4s ease forwards";
                    setTimeout(() => {
                        listItem.classList.add('done');
                        listItem.style.animation = "";
                        completedTasksList.prepend(listItem);
                    }, 400);
                }

            } else {
                if (isSubtask) {
                    isSubtask.classList.remove('done');
                } else if (listItem) {
                    listItem.style.animation = "slideOut 0.4s ease forwards";
                    setTimeout(() => {
                        listItem.classList.remove('done');
                        listItem.style.animation = "";
                        activeTasksList.append(listItem);
                    }, 400);
                }
            }
        });
    }

    // --- Theme Toggle ---
    const themeToggleBtn = document.querySelector('.theme-toggle');
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
            // Save preference to local storage
            localStorage.setItem('superlist-theme', isDark ? 'dark' : 'light');
        });

        // Check local storage on load
        if (localStorage.getItem('superlist-theme') === 'dark') {
            document.body.classList.add('dark-theme');
            themeToggleBtn.textContent = '☀️';
        }
    }

    // --- Simple Confetti Implementation ---
    function fireConfetti(x, y) {
        const colors = ['#FF4D4D', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
        for (let i = 0; i < 30; i++) {
            particles.push({
                x: x,
                y: y,
                r: Math.random() * 4 + 2,
                dx: Math.random() * 10 - 5,
                dy: Math.random() * -10 - 2,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 1.0
            });
        }
        if (!isAnimating) {
            isAnimating = true;
            animateConfetti();
        }
    }

    let isAnimating = false;
    function animateConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fill();

            p.x += p.dx;
            p.y += p.dy;
            p.dy += 0.4; // gravity
            p.life -= 0.02; // fade
        }

        // Remove dead particles
        particles = particles.filter(p => p.life > 0);

        if (particles.length > 0) {
            requestAnimationFrame(animateConfetti);
        } else {
            isAnimating = false;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Resize handler
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
});
