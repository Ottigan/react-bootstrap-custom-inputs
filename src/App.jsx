import { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Autocomplete from './components/Autocomplete';
import DatePicker from './components/DatePicker';
import TimePicker from './components/TimePicker';
// import { Autocomplete, DatePicker, TimePicker } from '../dist';

const propTypes = {
  t: PropTypes.func.isRequired,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dates: '',
      select: 'test10',
      time: '10:00',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { name, type, value } = e.target;
    const actualValue = type === 'radio' ? value !== 'false' : value;

    this.setState({
      [name]: actualValue,
    });
  }

  render() {
    const { dates, select, time } = this.state;
    const { t } = this.props;

    return (
      <div className="container-fluid vh-100">
        <form className="row justify-content-center align-items-center h-100">
          <Autocomplete
            onChange={this.handleChange}
            value={select}
            list={Array.from({ length: 10 }, (_, i) => ({
              key: `test${i + 1}`,
              value: `test${i + 1}`,
              isBackground: true,
            }))}
            name="select"
            label={t('global.list')}
            className="col-3"
            language="lv"
          />
          <DatePicker
            onChange={this.handleChange}
            value={dates}
            name="dates"
            label="Dates"
            className="col-3"
            language="lv"
          />
          <TimePicker
            onChange={this.handleChange}
            value={time}
            name="time"
            label="Time"
            className="col-2"
          />
        </form>
      </div>
    );
  }
}

App.propTypes = propTypes;

export default withTranslation()(App);
