import { Component } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import Autocomplete from './components/Autocomplete';
import DatePicker from './components/DatePicker';
import TimePicker from './components/TimePicker';
import TextInput from './components/TextInput/TextInput';
// import { Autocomplete, DatePicker, TimePicker } from '../dist';

const propTypes = {
  t: PropTypes.func.isRequired,
};

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      textValue: 'test',
      dates: '1991-05-03',
      select: 'test10',
      time: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    setTimeout(() => this.setState({ time: '18:00' }), 3000);
    setTimeout(() => this.setState({ textValue: 'foo' }), 3000);
  }

  handleChange(e) {
    const { name, type, value } = e.target;
    const actualValue = type === 'radio' ? value !== 'false' : value;

    this.setState({
      [name]: actualValue,
    });
  }

  render() {
    const { t } = this.props;

    const {
      textValue, dates, select, time,
    } = this.state;

    return (
      <div className="container-fluid vh-100">
        <form className="row justify-content-center align-items-center h-100">
          <div className="d-flex justify-content-around align-items-end">
            <TextInput
              onChange={this.handleChange}
              value={textValue}
              name="textValue"
              label={t('global.textInput')}
            />
            <Autocomplete
              onChange={this.handleChange}
              value={select}
              list={Array.from({ length: 9 }, (_, i) => {
                const item = {
                  key: `test${i + 1}`,
                  value: `very long value #${i + 1}`,
                  children: [{
                    key: 'test343',
                    value: 'nested value',
                  }],
                };

                return item;
              })}
              name="select"
              label={t('global.list')}
              className="col-3"
              language="lv"
              required
            />
            <DatePicker
              onChange={this.handleChange}
              value={dates}
              name="dates"
              label="Dates"
              multiselect
            />
            <TimePicker
              onChange={this.handleChange}
              value={time}
              name="time"
              label="Time"
              className="col-2"
            />
          </div>
        </form>
      </div>
    );
  }
}

App.propTypes = propTypes;

export default withTranslation()(App);
