document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("todo-form");
    const input = document.getElementById("new-task");
    const categoryInput = document.getElementById("new-category");
    const todoList = document.getElementById("todo-list");
    const filterButtonsContainer = document.getElementById("filters");

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let categories = ["All"];

    tasks.forEach(task => {
        if (task.category && !categories.includes(task.category)) {
            categories.push(task.category);
        }
    });

    const saveTasks = () => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    };

    const renderTasks = (filter = "All") => {
        todoList.innerHTML = "";
        tasks.forEach((task, index) => {
            if (filter === "All" || task.category === filter) {
                const li = document.createElement("li");
                const taskText = document.createElement("span");
                taskText.textContent = `${task.text} [${task.category}]`;
                taskText.className = "task-text";
                if (task.completed) {
                    taskText.classList.add("completed");
                }

                const buttonsContainer = document.createElement("div");
                const completeBtn = document.createElement("button");
                completeBtn.innerHTML = "&#10003;";
                completeBtn.className = "complete-btn";
                const editBtn = document.createElement("button");
                editBtn.innerHTML = "✎";
                editBtn.className = "edit-btn";
                const deleteBtn = document.createElement("button");
                deleteBtn.innerHTML = "✖";
                deleteBtn.className = "delete-btn";

                const ratingContainer = document.createElement("div");
                ratingContainer.className = "rating";
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement("span");
                    star.className = "rate";
                    star.innerHTML = "★";
                    star.setAttribute("data-value", i);
                    if (i <= task.rating) {
                        star.classList.add("active");
                    } else {
                        star.classList.add("inactive");
                    }
                    star.addEventListener("click", () => {
                        task.rating = parseInt(star.getAttribute("data-value"));
                        saveTasks();
                        renderTasks(filter);
                    });
                    ratingContainer.appendChild(star);
                }

                completeBtn.addEventListener("click", () => {
                    task.completed = !task.completed;
                    saveTasks();
                    renderTasks(filter);
                });

                editBtn.addEventListener("click", () => {
                    const newText = prompt("Edit task:", task.text);
                    if (newText) {
                        task.text = newText;
                        saveTasks();
                        renderTasks(filter);
                    }
                });

                deleteBtn.addEventListener("click", () => {
                    tasks.splice(index, 1);
                    saveTasks();
                    renderTasks(filter);
                });

                buttonsContainer.appendChild(completeBtn);
                buttonsContainer.appendChild(editBtn);
                buttonsContainer.appendChild(deleteBtn);
                buttonsContainer.appendChild(ratingContainer);

                li.appendChild(taskText);
                li.appendChild(buttonsContainer);
                todoList.appendChild(li);
            }
        });
    };

    const renderFilterButtons = () => {
        filterButtonsContainer.innerHTML = "";
        categories.forEach(category => {
            const button = document.createElement("button");
            button.className = "filter-btn";
            button.textContent = category;
            button.setAttribute("data-category", category);
            button.addEventListener("click", () => {
                renderTasks(category);
            });
            filterButtonsContainer.appendChild(button);
        });
    };

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const newTask = input.value.trim();
        const newCategory = categoryInput.value.trim() || "General";
        if (newTask) {
            tasks.push({ text: newTask, category: newCategory, completed: false, rating: 0 });
            if (!categories.includes(newCategory)) {
                categories.push(newCategory);
                renderFilterButtons();
            }
            saveTasks();
            renderTasks();
            input.value = "";
            categoryInput.value = "";
        }
    });

    renderTasks();
    renderFilterButtons();
});
