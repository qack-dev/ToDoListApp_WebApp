// ページを読み込んだときに、タスク一覧を取得し表示
window.onload = async () => {
    const response = await fetch('/tasks'); // backendの`GET /tasks`を呼び出す
    const tasks = await response.json(); // JSONで取得
    const taskListElement = document.getElementById("task-list");

    // 取得したタスクをリストに追加
    for (const id in tasks) {
        const task = tasks[id];
        const taskName = task[0];
        const taskPriority = task[1];

        const li = document.createElement("li");
        li.textContent = `タスク名: ${taskName}, 優先度: ${taskPriority}`;
        taskListElement.appendChild(li);
    }
};
