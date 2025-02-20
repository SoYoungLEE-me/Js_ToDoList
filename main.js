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

taskInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});

function addTask() {
  let task = {
    id: randomIdGenerate(),
    taskContent: taskInput.value,
    isComplete: false,
  };

  if (!taskInput.value.trim()) {
    alert("할 일을 입력하세요!");
    return;
  }

  taskList.push(task);
  console.log(taskList);
  taskInput.value = "";
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
            <input type="checkbox" class="task-checkbox" onclick="toggleComplete('${list[i].id}')" checked>
            <span id="task-${list[i].id}">${list[i].taskContent}</span>
            <div class="button-box">
              <button onclick="editTodo('${list[i].id}')"><i class="fa-solid fa-pen"></i></button>
              <button onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
            </div>
          </div>`;
    } else {
      resultHTML += ` <div class="task">
            <input type="checkbox" class="task-checkbox" onclick="toggleComplete('${list[i].id}')">
            <span id="task-${list[i].id}">${list[i].taskContent}</span>
            <div class="button-box">
              <button onclick="editTodo('${list[i].id}')"><i class="fa-solid fa-pen"></i></button>
              <button onclick="deleteTask('${list[i].id}')"><i class="fa-solid fa-trash-can"></i></button>
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

function editTodo(id) {
  let taskItem = taskList.find((task) => task.id === id); //taskList에서 해당
  if (!taskItem) return;

  let taskElement = document.getElementById(`task-${id}`); //span 요소 가져오기
  if (!taskElement) return;

  if (taskItem.isComplete) return;

  //input 요소 생성
  let inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.className = "input_style";
  inputElement.value = taskItem.taskContent;

  //enter를 치면 update 함수(배열 업데이트) 실행
  inputElement.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      updateTodo(id, inputElement.value);
    }
  });

  inputElement.addEventListener("blur", function () {
    updateTodo(id, inputElement.value);
  }); //input창의 포커스가 해제되면 수정될 수 있게 기능 추가

  //기존 <span>을 <input>으로 교체
  taskElement.replaceWith(inputElement);
  inputElement.focus(); //입력창에 자동으로 포커스 맞추기
}

function updateTodo(id, newContent) {
  if (!newContent.trim()) {
    alert("할 일을 입력하세요!");
    return;
  }

  taskList = taskList.map(
    (
      task //맵으로 기존 배열 순회
    ) => (task.id === id ? { ...task, taskContent: newContent } : task)
  ); // taskList에서 해당 id의 내용을 새로운 내용이 있다면 ...task로 다른 요소들은 복사,
  //taskContent만 newContent로 교체에서 반환

  render();
}

// 필터 함수 (탭 클릭 시 언더라인 이동)
function filter(event) {
  if (event) {
    mode = event.target.id; //html 태그 안에 있는 id들
    underLine.style.width = event.target.offsetWidth + "px";
    underLine.style.left = event.target.offsetLeft + "px";
    underLine.style.top =
      event.target.offsetTop + (event.target.offsetHeight - 4) + "px";
  }

  // 필터링된 리스트 적용
  filterList = [];
  if (mode === "all") {
    render();
  } else if (mode === "ongoing") {
    //진행중인 리스트만 보여주기
    //addTask.isComplete == false
    for (let i = 0; i < taskList.length; i++) {
      if (!taskList[i].isComplete) {
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

function randomIdGenerate() {
  return "_" + Math.random().toString(36).substr(2, 9);
}
