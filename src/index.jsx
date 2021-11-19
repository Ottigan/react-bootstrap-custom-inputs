import 'bootstrap/scss/bootstrap.scss';
import ReactDOM from 'react-dom';
import App from './App';
import 'bootstrap';

ReactDOM.render(<App />, document.getElementById('app'));

if (module.hot) {
  module.hot.accept();
}
