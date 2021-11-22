# React Bootstrap Custom Inputs

## Import components:
```
import React, { Component } from 'react';
import { DatePicker } from 'react-bootstrap-custom-inputs';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      date: '2021-01-31',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    });
  }

  render() {
    const { date } = this.state;

    return (
      <div className="container-fluid vh-100">
        <div className="row h-75 justify-content-center align-items-center">
          <DatePicker
            onChange={this.handleChange}
            value={date}
            name="date"
            label="Date"
            required
            className="col-4"
          />
        </div>
      </div>
    );
  }
}

export default App;
```

### Autocomplete Props:
| Name | Required | Description | Default |
| ---- | -------- | ----------- | ------- |
| onChange | true | function | - |
| name | true | string representing State property | - |
| list | true | array of objects with `key`(unique string), `value`(string), `title`(optional string) properties | - |
| label | false | string | - |
| value | false | string or string[] matching `key` property of `list` objects | - |
| className | false | string | - |
| autoComplete | false | 'on' or 'off' | 'off' |
| multiselect | false | bool | false |
| required | false | bool | false |
| disableDeselect | false | bool | false |
| disabled | false | bool | false |

<p>&nbsp;</p>

### DatePicker Props:
| Name | Required | Description | Default |
| ---- | -------- | ----------- | ------- |
| onChange | true | handler function | - |
| name | true | string representing State property | - |
| label | false | string | - |
| value | false | string or string[] in RFC2822 or ISO format | moment() |
| className | false | string | - |
| multiselect | false | bool | false |
| required | false | bool | false |
| valid | false | bool | - |
| disabled | false | bool | false |

<p>&nbsp;</p>

### TimePicker Props:
| Name | Required | Description | Default |
| ---- | -------- | ----------- | ------- |
| onChange | true | handler function | - |
| name | true | string representing State property | - |
| label | false | string | - |
| value | false | string in RFC2822 or ISO format | '--:--' |
| className | false | string | - |
| required | false | bool | false |
| valid | false | bool | - |
| disabled | false | bool | false |