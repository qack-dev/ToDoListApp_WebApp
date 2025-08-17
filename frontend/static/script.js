// ページを読み込んだときに、タスク一覧を取得し表示
window.onload = async () => {
    const response = await fetch('/tasks'); // backendの`GET /tasks`を呼び出す
    const tasks = await response.json(); // JSONで取得
    const taskListElement = document.getElementById("task-list");

    // リストを空へ
    taskListElement.innerHTML = '';
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

// 追加ボタンが押下されたときの処理
const addButton = document.getElementById("add-button");
addButton.onclick = async () => {
    const taskNameInput = document.getElementById("task-name-input");
    const taskPriorityInput = document.getElementById("task-priority-input");
    const newTask = {
        name: taskNameInput.value,
        priority: taskPriorityInput.value
    }
    // backendの`POST /tasks`を呼び出す
    await fetch('/tasks', {
        method: 'POST', // POSTメソッドを使用
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask) // リクエストボディに新しいタスクを送信
    });
    // タスク追加後、「■現在のタスク一覧」を再読み込み
    window.onload();
}

// 削除ボタンが押下された時の処理
const deleteButton = document.getElementById("delete-button");
deleteButton.onclick = async () => {
    const taskIdInput = Number(document.getElementById("task-id-input").value) - 1; // idは0から始まり、olタグは1から始まるため
    // backendの`DELETE /tasks/{task_id}`を呼び出す
    await fetch('/tasks/' + taskIdInput, {
        method: 'DELETE', // DELETEメソッドを使用
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({id: taskIdInput}) // リクエストボディに削除するタスクのidを送信
    });
    // タスク追加後、「■現在のタスク一覧」を再読み込み
    window.onload();
}
