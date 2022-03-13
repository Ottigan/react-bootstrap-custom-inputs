import '@fortawesome/fontawesome-free/css/fontawesome.css';
import '@fortawesome/fontawesome-free/css/solid.css';
import 'bootstrap/scss/bootstrap.scss';
import './middleware/i18n';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap';

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) module.hot.accept();
