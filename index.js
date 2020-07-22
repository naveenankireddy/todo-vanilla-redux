const inputText = document.querySelector(".main-input");
const ul = document.querySelector(".list");
const footer = document.querySelector("footer");

let id = 0;

//state
const initialState = {
  allTodos: [],
  activeTab: "All",
};

//reducer
function allTodosReducer(state = initialState.allTodos, action) {
  switch (action.type) {
    case "ADD_TODO":
      return [...state, { text: action.payload, isDone: false, id: id++ }];

    case "TOGGLE_TODO":
      console.log(action);
      return state.map((todo) => {
        if (todo.id == action.payload) {
          return {
            ...todo,
            isDone: !todo.isDone,
          };
        }
        return todo;
      });
    case "REMOVE_TODO":
      console.log(action);
      return state.filter((todo) => todo.id !== action.payload);
    case "CLEAR_COMPLETED":
      console.log(action);
      return state.filter((todo) => !todo.isDone);
    default:
      return state;
  }
}

function activeTabReducer(state = initialState.activeTab, action) {
  switch (action.type) {
    case "CHANGE_TAB":
      return action.payload;
    default:
      return state;
  }
}
//actions

let addTodoAction = (payload) => ({
  type: "ADD_TODO",
  payload,
});

let toggleTodoAction = (payload) => ({
  type: "TOGGLE_TODO",
  payload,
});

let removeTodoAction = (payload) => ({
  type: "REMOVE_TODO",
  payload,
});
let changeTabAction = (payload) => ({
  type: "CHANGE_TAB",
  payload,
});
let clearCompleted = () => ({
  type: "CLEAR_COMPLETED",
});

let rootReducer = Redux.combineReducers({
  allTodos: allTodosReducer,
  activeTab: activeTabReducer,
});

let { dispatch, getState, subscribe } = Redux.createStore(
  rootReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

// console.log(inputText);

//methods
function handleAddTodo({ target, keyCode }) {
  if (keyCode === 13) {
    dispatch(addTodoAction(target.value));
  }
}

function handleToggle(id) {
  dispatch(toggleTodoAction(id));
}
function handleRemove(id) {
  dispatch(removeTodoAction(id));
}
//  function handleEdit(id){
//      dispatch()
//  }





function createUI(root, data) {
  root.innerHTML = "";

  data.forEach((todo) => {
    let li = document.createElement("li");
    let span = document.createElement("span");
    let label = document.createElement("label");
    label.for = todo.id;
    let input = document.createElement("input");
    input.id = todo.id;
    input.type = "checkbox";
    input.checked = todo.isDone;
    input.addEventListener("click", () => handleToggle(todo.id));
    span.append(input, label);
    let p = document.createElement("p");
    
    p.addEventListener('dblclick',handleEdit);


    p.innerText = todo.text;
    let spanDel = document.createElement("span");
    spanDel.innerText = "X";
    spanDel.addEventListener("click", () => handleRemove(todo.id));
    li.append(span, p, spanDel);

    ul.append(li);
  });
}

createUI(ul, getState().allTodos);

function filterTodo(active, all) {
  switch (active) {
    case "Completed":
      return all.filter((todo) => todo.isDone);
    case "Active":
      return all.filter((todo) => !todo.isDone);
    default:
      return all;
  }
}
inputText.addEventListener("keyup", handleAddTodo);

function handleChange(newTab) {
  if (newTab == "Clear complete") {
    dispatch(clearCompleted());
  } else {
    dispatch(changeTabAction(newTab));
  }
}

[...footer.children].forEach((ele) => {
  ele.addEventListener("click", ({ target }) => handleChange(target.innerText));
});

subscribe(() =>
  createUI(ul, filterTodo(getState().activeTab, getState().allTodos))
);
