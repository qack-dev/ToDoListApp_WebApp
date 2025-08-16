#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from fastapi import FastAPI
from pydantic import BaseModel
from typing import Literal
import json

# バックグラウンド処理実行コマンド
# >uvicorn main:app --reload

# 受け取るデータの型を定義
class Task(BaseModel):
    name: str
    priority: Literal['high', 'middle', 'low']
# タスクを格納する変数
tasks = {}
# タスクを保存するファイル名
tasks_file = 'tasks.json'

app = FastAPI()

# Jsonファイルを読み込む
def load_tasks_from_file():
    global tasks
    with open(tasks_file, 'r', encoding='utf-8') as f:
        # 読み込む
        tasks = json.load(f)
        # keyを整数に変換しreturn
        return {int(k): v for k, v in tasks.items()}

# タスクを保存する関数
def save_tasks():
    global tasks
    try:
        with open(tasks_file, 'w', encoding='utf-8') as f:
            json.dump(tasks, f, ensure_ascii=False, indent=4)
        print("タスクをファイルに保存しました。")
    except IOError as e:
        print(f"ファイルの保存に失敗しました: {e}")

# '/tasks' にGETリクエストが来たとき
@app.get('/tasks')
def show():
    return load_tasks_from_file()

# '/tasks' にPOSTリクエストが来たとき
@app.post('/tasks')
def add(task: Task):
    global tasks
    # 現在のタスクを読み込む
    tasks = load_tasks_from_file()
    # 新しいタスクを追加
    tasks[len(tasks)] = [task.name, task.priority]
    # ファイルに保存
    save_tasks()
    return {"message": "タスクを追加しました。", "tasks": tasks}

# '/tasks/{task_id}' にDELETEリクエストが来たとき
@app.delete('/tasks/{task_id}')
def delete(task_id: int):
    global tasks
    # 現在のタスクを読み込む
    tasks = load_tasks_from_file()
    # タスクIDが存在するか確認
    if task_id in tasks:
        # タスクを削除
        del tasks[task_id]
        # 残ったタスクの値をlistとして取得
        remaining_tasks_values = list(tasks.values())
        # tasksのキーを再採番
        tasks = {}
        for v in remaining_tasks_values:
            tasks[len(tasks)] = v
        # ファイルに保存
        save_tasks()
        return {"message": f"タスク {task_id} を削除しました。", "tasks": tasks}
