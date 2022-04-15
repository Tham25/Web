import html from '../core.js';
// import {connect} from '../store.js'
import Header from '../component/Header.js';
import TodoList from '../component/TodoList.js';
import Footer from '../component/Footer.js';


// const connector = connect();

function App() {

    return html`
        <section class="todoapp">
            ${Header()}
            ${TodoList()}
            ${Footer()}
        </section>
    `
}

// export default connector(App);
export default App;
