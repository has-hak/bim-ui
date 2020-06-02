import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import * as axios from "axios";
import App from "./ui/App";
import MyRouter from "./infrastructure/MyRouter";

axios.defaults.withCredentials = true;

ReactDOM.render(
    <React.StrictMode>
        <MyRouter>
            <App/>
        </MyRouter>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
