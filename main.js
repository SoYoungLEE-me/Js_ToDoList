/* 1. 유저가 할일을 입력한다.
2. + 버튼을 누르면 할일이 추가된다.
3. delete 버튼을 누르면 할일이 삭제된다.
4. check 버튼을 누르면 할일이 끝나면서 밑줄이 그어진다.
5. 다른 탭들을 누르면 언더바가 이동한다.
6. not done은 진행 중인 아이템만, done에는 check를 누른 끝난 아이템만 보이도록
*/

let taskInput = document.getElementById("task-input");
let addButton = document.getElementById("add-button");
let tabs = document.querySelectorAll(".task-tabs div");
let taskList = [];
let mode = "all";
let filterList = [];
let underLine = document.getElementById("under-line");
addButton.addEventListener("click", addTask);

for (let i = 1; i < tabs.length; i++) {
  tabs[i].addEventListener("click", function (event) {
    filter(event);
  });
}

function addTask() {
  let task = {
    id: rendomIdGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };
  taskList.push(task);
  console.log(taskList);
  filter({ target: { id: mode } });
}

function render() {
  let list = [];
  if (mode === "all") {
    list = taskList;
  } else if (mode === "ongoing" || mode === "done") {
    list = filterList;
  }
  let resultHTML = "";
  for (let i = 0; i < list.length; i++) {
    if (list[i].isComplete == true) {
      resultHTML += ` <div class="task task-done">
            <span>${list[i].taskContent}</span>
            <div class="button-box">
              <button onclick = "toggleComplete('${list[i].id}')"><i class="fa-solid fa-rotate-left"></i></button>
              <button onclick = "deleteTask('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>`;
    } else {
      resultHTML += ` <div class="task">
            <span>${list[i].taskContent}</span>
            <div class="button-box">
              <button onclick = "toggleComplete('${list[i].id}')"><i class="fa-solid fa-check"></i></button>
              <button onclick = "deleteTask('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>`;
    }
  }

  document.getElementById("task-board").innerHTML = resultHTML;
}

function toggleComplete(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList[i].isComplete = !taskList[i].isComplete;
      break;
    }
  }
  filter();
}

function deleteTask(id) {
  for (let i = 0; i < taskList.length; i++) {
    if (taskList[i].id == id) {
      taskList.splice(i, 1);
      break;
    }
  }
  filter();
}

function filter(event) {
  if (event) {
    mode = event.target.id; //html 태그 안에 있는 id들
    underLine.style.width = event.target.offsetWidth + "px";
    underLine.style.left = event.target.offsetLeft + "px";
    underLine.style.top =
      event.target.offsetTop + (event.target.offsetHeight - 4) + "px";
  }

  //언더라인 움직임 추가

  filterList = [];
  if (mode === "all") {
    render();
  } else if (mode === "ongoing") {
    //진행중인 리스트만 보여주기
    //addTask.isComplete == false
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete == false) {
        filterList.push(taskList[i]);
      }
    }
    render();
  } else if (mode === "done") {
    //끝난 리스트만 보여주기
    //addTask.isComplete == true
    for (let i = 0; i < taskList.length; i++) {
      if (taskList[i].isComplete == true) {
        filterList.push(taskList[i]);
      }
    }
    render();
  }
}

function rendomIdGenerate() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
