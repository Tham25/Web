import html from '../core.js';
import {connect} from '../store.js'


// const connector = connect();

function TodoItem({todo}) {

    return html`
        <li class="${todo.completed && 'completed'}">
            <div class="view">
                <input class="toggle" type="checkbox" ${todo.completed && 'checked'}>
                <label>${todo.title}</label>
                <button class="destroy"></button>
            </div>
            <input class="edit" value="${todo.title}">
        </li>
    `
}

export default TodoItem;
