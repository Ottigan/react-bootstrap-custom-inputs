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
| onChange | true | handler `function` | - |
| name | true | `string` representing State property | - |
| list | true | `array` of `objects` with `key`(unique string), `value`(string), `title`(optional string), `isImportant`(optional boolean) to display a star icon, `isBackground`(optional boolean) to hide on open, `children`(support for nested list of the same format) properties | - |
| label | false | `string` to enable interaction with the input through it's label | - |
| value | false | `string` or `string[]` matching `key` property of `list` objects | - |
| className | false | `string` consisting of classes to apply to the input| - |
| language | false | `string` currently supported values [`en`, `lv`] | 'en' |
| debounce | false | `number` representing debounce in milliseconds | 500ms |
| autoComplete | false | 'on' or 'off' | 'off' |
| multiselect | false | `bool` to enable the ability of selecting multiple items | false |
| multiselectPreview | false | `number` to display values if selected count is equal or less, `'default'` to display `'Selected #'`, `'value'` to always display value | 'default' |
| valid | false | `bool` to override default `required` with your own definition (i.e. `valid === true` when at least 3 items are selected) | - |
| required | false | `bool` to enable Bootstrap `is-valid/is-invalid` validations | false |
| disableDeselect | false | `bool === true` disables ability to deselect when `multiselect === false` | false |
| disabled | false | `bool` | false |

<p>&nbsp;</p>

### DatePicker Props:
| Name | Required | Description | Default |
| ---- | -------- | ----------- | ------- |
| onChange | true | handler `function` | - |
| name | true | `string` representing State property | - |
| label | false | `string` to enable interaction with the input through it's label | - |
| value | false | `string` or `string[]` in RFC2822 or ISO format | 'DD.MM.YYYY' |
| className | false | `string` consisting of classes to apply to the input| - |
| language | false | `string` currently supported values [`en`, `lv`] | 'en' |
| asIcon | false | `bool` to render an icon depicting a calendar instead of text input | false |
| multiselect | false | `bool` | false |
| valid | false | `bool` | - |
| required | false | `bool` | false |
| disabled | false | `bool` | false |

<p>&nbsp;</p>

### TimePicker Props:
| Name | Required | Description | Default |
| ---- | -------- | ----------- | ------- |
| onChange | true | handler `function` | - |
| name | true | `string` representing State property | - |
| label | false | `string` to enable interaction with the input through it's label | - |
| value | false | `string` in the format `HH:mm` | '--:--' |
| className | false | `string` | - |
| valid | false | `bool` | - |
| required | false | `bool` | false |
| disabled | false | `bool` | false |

<p>&nbsp;</p>

### TextInput Props:
| Name | Required | Description | Default |
| ---- | -------- | ----------- | ------- |
| onChange | true | handler `function` | - |
| name | true | `string` representing State property | - |
| label | false | `string` to enable interaction with the input through it's label | - |
| value | false | `string` | '' |
| debounce | false | `number` representing debounce in milliseconds | 500ms |
| className | false | `string` | - |
| valid | false | `bool` | - |
| required | false | `bool` | false |
| disabled | false | `bool` | false |