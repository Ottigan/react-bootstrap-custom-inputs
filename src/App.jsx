import moment from 'moment';
import { Component } from 'react';
import Autocomplete from './components/Autocomplete';
import DatePicker from './components/DatePicker';
import TimePicker from './components/TimePicker';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dates: '',
      select: 'test2',
      time: moment().format(),
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

    return (
      <div className="container-fluid vh-100">
        <div className="row justify-content-center align-items-center h-100">
          <Autocomplete
            onChange={this.handleChange}
            value={select}
            list={[
              {
                key: 'test1',
                value: 'test1',
              },
              {
                key: 'test2',
                title: 'test2',
                value: 'test2',
              },
            ]}
            name="select"
            label="Select"
            className="col-3"
          />
          <DatePicker
            onChange={this.handleChange}
            value={dates}
            name="dates"
            label="Dates"
            multiselect
            className="col-3"
          />
          <TimePicker
            onChange={this.handleChange}
            value={time}
            name="time"
            label="Time"
            className="col-2"
          />
        </div>
      </div>
    );
  }
}

export default App;
