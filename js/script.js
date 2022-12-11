window.onload = () => {
    // forEach()를 이용하여 새로고침 했을 때마다 로직이 실행되어 local storage에서 데이터를 가져와서 파싱해줌
    tasks.forEach(item => item.state = "show");
    Task.display();
}

let tasks = [];
const getTasks = localStorage.getItem('tasks');
// stringify를 이용하여 string으로 만든 값을 array로 만들기 위해 parse 함수를 이용
// parse는 json의 문자열을 구문을 분석함
if (getTasks) tasks = JSON.parse(getTasks);

// .value로 입력된 값 받아옴
const input = document.getElementById('task'),
    createBtn = document.getElementById('create-task'),
    clear__all = document.querySelector('.clear__all');

class Task {
    // display tasks
    static display() {
        const tasks_container = document.getElementById('tasks');

        // task의 값을 let으로 해서 업데이트 가능하게 한다.
        let _tasks = '';

        // local storage로부터 데이터를 가져옴
        tasks.forEach((task, index) => {
            _tasks += `                                         
                <div class="task-item ${task.state === "show" ? 'mt-2 d-flex justify-content-between align-items-center' : 'd-none'}">
                    <div class="task-name">
                        <p class="${task.completed === 'true' ? 'text-decoration-line-through' : 'text-dark'}" id="task__name">${task.name}</p>
                    </div>
                    <div class="action btns">
                        <button type="button" class="btn btn-sm btn-success is__completed" onclick="Task.todoCompleted('${task.id}')"><i class="fa-solid fa-circle-check"></i></button>
                        <button type="button" class="btn btn-sm btn-primary edit" onclick="Task.update('${task.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
                        <button type="button" class="btn btn-sm btn-danger delete" onclick="Task.delete('${task.id}')"><i class="fa-solid fa-trash-can"></i></button>
                    </div>
                </div>
            `;
            // 휴지통 모양 버튼 ms-1 제거하니까 버튼 간 간격 일정해짐
            // fa-circle-check, fa-fen-to-square, fa-trash-can은 아이콘 모양

        // 자바스크립트 변수 선언시 달러$나 언더바_를 사용할 수 있음
        // 언더바_는 단어를 구분할때 사용
        // 식별자에 사용되는 달러($) 기호는 document.getElementById() 대신 아이디 값처럼 단일한 변수를 표시함
        // document.getElementById()를 사용하는 것이 번거로우니 변수명으로 사용도가 낮은 $를 변수명 앞에 붙여서 다른 변수와 충돌이 일어나지 않도록 함
        // 백틱(``)안에 달러($) 기호를 사용하면 변수나 표현식을 표현한다
        // 달러 사용이 싫다면 변수명 뒤에 Element를 붙이는 것도 하나의 방법이다.
        
        });
        (tasks.length === 0 || _tasks === '') ? clear__all.classList.add('d-none') : clear__all.classList.remove('d-none');
        tasks_container.innerHTML = _tasks;
        // ? 체이닝 연산자는 undirind을 반환함
        // local storage에 저장하기 위해 array를 만들고 리스트가 추가될 때마다 그 리스트를 array에 push함. 하지만 local storage에는 array를 저장할 수 없고, only text만 저장할 수 있음. 따라서 local storage 값을 배열로 바꿔야 함
        // stringify 함수를 이용하여 local storage로 JSON 형식의 문자열로  데이터 넘겨줌
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // create task //컨트롤에 대한 식별자(ID)가 암호화되어 있는지 여부를 결정함
    static create(task) {
        const generateRandomId = Math.floor(Math.random() * 99999);
        // 리스트 생성 시 리스트별로 랜덤한 숫자 할당해줌
        // Math.random 난수를 생성하는 메서드 자릿수 조절
        tasks.push({ id: generateRandomId, name: task, completed: 'false', state: 'show' });
        this.display();
    }

    // completed
    static todoCompleted(task) {
    // forEach함수를 이용해서 array에 있는 각각의 item에 대해 function을 실행할 수 있도록 함
        tasks.forEach(item => {
            if (`${item.id}` === task) {
                if (item.completed === 'false')
                    item.completed = 'true';
                else
                    item.completed = 'false';
            }
        });

        this.display();
    }

    // update/edit task
    static update(task) { // static 선언후에 위치에 상관없이 프로그램의 시작과 끝까지 메모리에 할당되어있으면서 그 값을 마음대로 바꿀 수 있는 것. 위치에 대해서는 전역변수든 지역변수든 상관없다
        const taskItems = document.querySelectorAll('.task-item');
        const taskInput = document.getElementById('task-input');
        const edit = document.querySelectorAll('.task-name');

        // forEach함수를 이용해서 array에 있는 각각의 item에 대해 function을 실행할 수 있도록 함
        tasks.forEach((item, index) => { // item, index 임의 설정
            if (`${item.id}` === task) {
                taskItems[index].classList.add('task-editing');
                edit[index].innerHTML = `
                    <input type="text" id="task-input" class="form-control" value="${item.name}" placeholder="Edit this Todo and Hit Enter!" title="Edit this Todo and Hit Enter!" />
                    <button type="button" class="btn btn-primary save-edited-todo">Edit This</button>
                `;
                // edit할 때 공란으로 두면 Edit this Todo and Hit Enter! 메세지 출력


                const taskInputs = document.querySelectorAll('#task-input');
                const saveEditTodo = document.querySelector('.save-edited-todo');
                 // forEach함수를 이용해서 array에 있는 각각의 item에 대해 function을 실행할 수 있도록 한
                if (taskInputs) {
                    taskInputs.forEach(input => {
                        input.addEventListener('keydown', e => {
                            if (e.key === 'Enter') {
                                // eventListenr를 이용하여 click시 발생할 이벤트를 설정함
                                // .value로 입력된 값 받아옴
                                saveEditTodo.addEventListener('click', e => {
                                    let input_value = input.value;
                                    if (input_value) this.update(task, input_value);
                                });

                                saveEditTodo.click();
                            }
                        });
                    });
                }

                if (taskInput.value === '') return;

                item.name = taskInput.value;
            }
        });

        this.display();
    }

    // delete task
    // 삭제 버튼을 누르는 이벤트를 함
    // 제거하고자 하는 리스트를 완전히 삭제해야 정확히 리스트를 한개 삭제함
    // local storage에서의 데이터도 업데이트 시켜야함
    // filter() 메소드를 이용하면 forEach() 메소드와 같이 배열의 모든 요소마다 특정 메소드 호출해줌
    // 만약 특정 메소드가 false이 아닌 true를 반환한 값들만 모아둔 배열을 만들어 반환
    // 타겟 노드는 바뀌지 않고 반환 ㄱ밧으로만 변환된 배열을 얻을 수 있으므로 item 변수 다시 받음
    static delete(task) {
        // filter() 메소드는 true, false이므로 => 을 이용하여 간단한 boolean형 조건문으로 대체함
        tasks = tasks.filter(item => `${item.id}` !== task);

        // tasks.forEach((item, index) => {
        //     if(`${item.id}` === task) {
        //         tasks.splice(index, 1)
        //     }
        // });
        this.display();
    }
}

// Create Btn
// EventListner를 이용하여 리스트를 추가하는 이벤트를 설정한다.
// .value로 입력된 값 받아옴
// 공백이 아니라면 creat함수를 이용해서 input_value를 하나 생성한다.
createBtn.addEventListener('click', (e) => {
    const input_value = input.value;
    if (input_value !== '') {
        input.value = '';
        Task.create(input_value);
    }
});

// Prevent from Submit-ing the Form
// adEventListener로 submit 감지
let form = document.querySelector('.form');
form.addEventListener('submit', e => {
    e.preventDefault();
});

// Keyboard Support Enter Key (To add a Task)
// input 값이 공백이 아니라면 버튼을 하나 생성함 Enter 키를 눌러 리스트 추가 이벤트 발생함
input.addEventListener('keydown', e => {
     if (e.key === 'Enter') createBtn.click();
});

// Clear All Btn
function clearAll() {
    tasks = [];
    Task.display();
}

clear__all.addEventListener('click', clearAll);