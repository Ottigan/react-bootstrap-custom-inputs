import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Hours from './components/Hours';
import Minutes from './components/Minutes';
import './styles.scss';

const HOURS_DEFAULT_SCROLL_TOP = 41 * 24;
const HOURS_24H_FORMAT = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
];

const MINUTES_DEFAULT_SCROLL_TOP = 41 * 60;
const MINUTES_24H_FORMAT = [
  '59',
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23',
  '24',
  '25',
  '26',
  '27',
  '28',
  '29',
  '30',
  '31',
  '32',
  '33',
  '34',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
  '46',
  '47',
  '48',
  '49',
  '50',
  '51',
  '52',
  '53',
  '54',
  '55',
  '56',
  '57',
  '58',
];

function updateChecked(object, target) {
  return Object.keys(object).reduce((acc, x) => {
    if (x === target) return { ...acc, [x]: true };

    return { ...acc, [x]: false };
  }, {});
}

const propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
  valid: PropTypes.bool,
  disabled: PropTypes.bool,
};

const defaultProps = {
  label: '',
  value: '--:--',
  className: '',
  required: false,
  valid: null,
  disabled: false,
};

class TimePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputRef: createRef(),
      inputDummyRef: createRef(),
      hoursRef: createRef(),
      minutesRef: createRef(),
      hoursScrollRef: createRef(),
      minutesScrollRef: createRef(),
      caretPosition: null,
      time: '',
      hoursList: [HOURS_24H_FORMAT, HOURS_24H_FORMAT, HOURS_24H_FORMAT],
      hour: HOURS_24H_FORMAT[0],
      hours: {},
      minutesList: [MINUTES_24H_FORMAT, MINUTES_24H_FORMAT, MINUTES_24H_FORMAT],
      minute: MINUTES_24H_FORMAT[0],
      minutes: {},
      showContainer: false,
      isValid: null,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    const { valid: prevValid } = prevProps;
    const { valid: currValid } = this.props;

    if (prevValid !== currValid) {
      this.updateIsValid();
    }
  }

  handleClick(e) {
    const {
      inputRef, inputDummyRef, hoursRef, minutesRef,
    } = this.state;
    const { disabled } = this.props;
    const { target } = e;

    if (!disabled) {
      if (!target.classList.contains('highlighted')) {
        let caretPosition = 0;

        if (target.classList.contains('time-picker-minutes')) {
          caretPosition = 3;
        }

        this.setState({ caretPosition }, () => {
          inputRef.current.focus();
          inputRef.current.selectionStart = caretPosition;
          inputRef.current.selectionEnd = caretPosition;
          inputDummyRef.current.classList.add('focus');

          if (target.classList.contains('time-picker-hours') || target.classList.contains('time-picker-input-dummy')) {
            hoursRef.current.classList.add('highlighted');
            minutesRef.current.classList.remove('highlighted');
          } else if (target.classList.contains('time-picker-minutes')) {
            minutesRef.current.classList.add('highlighted');
            hoursRef.current.classList.remove('highlighted');
          }
        });
      }
    }
  }

  handleFocus(e) {
    const {
      showContainer, inputDummyRef, hoursScrollRef, minutesScrollRef,
    } = this.state;
    const { disabled } = this.props;
    const { name } = e.target;

    if (['time', 'dummy'].includes(name) && !showContainer && !disabled) {
      this.setState({ showContainer: true }, () => {
        inputDummyRef.current.classList.add('focus');
        hoursScrollRef.current.scrollTop = HOURS_DEFAULT_SCROLL_TOP;
        minutesScrollRef.current.scrollTop = MINUTES_DEFAULT_SCROLL_TOP;
      });
    }
  }

  handleKeyDown(e) {
    const {
      hoursRef, minutesRef,
    } = this.state;
    const { key } = e;

    if (key === 'ArrowLeft') {
      hoursRef.current.classList.add('highlighted');
      minutesRef.current.classList.remove('highlighted');

      this.setState({ caretPosition: 0 });
    } else if (key === 'ArrowRight') {
      minutesRef.current.classList.add('highlighted');
      hoursRef.current.classList.remove('highlighted');

      this.setState({ caretPosition: 3 });
    }
  }

  handleChange(e) {
    let {
      caretPosition, time, hoursRef, minutesRef, hours, minutes,
    } = this.state;
    const { target } = e;
    const { name, value } = target;

    const timeArr = time.split('');
    const valueArr = value.split('');
    const newValue = valueArr.reduce((acc, x, i) => {
      if (!acc && timeArr[i] !== x) return x;

      return acc;
    }, null);

    if (newValue && !Number.isNaN(Number(newValue))) {
      switch (caretPosition) {
      case 0:
        if (newValue < 3) {
          timeArr.splice(caretPosition, 2, `0${newValue}`);
          caretPosition += 1;
        } else {
          timeArr.splice(caretPosition, 2, `0${newValue}`);

          caretPosition += 3;
          hoursRef.current.classList.remove('highlighted');
          minutesRef.current.classList.add('highlighted');
        }
        break;
      case 1:
        timeArr.splice(caretPosition - 1, 2, `${timeArr[1]}${newValue}`);
        caretPosition += 2;
        hoursRef.current.classList.remove('highlighted');
        minutesRef.current.classList.add('highlighted');
        break;
      case 3:
        if (newValue < 6) {
          timeArr.splice(caretPosition, 2, `0${newValue}`);
          caretPosition += 1;
        } else {
          timeArr.splice(caretPosition, 2, `0${newValue}`);
          caretPosition = 3;
          hoursRef.current.classList.remove('highlighted');
          minutesRef.current.classList.add('highlighted');
        }
        break;
      case 4:
        if (timeArr[4] < 6) {
          timeArr.splice(caretPosition - 1, 2, `${timeArr[4]}${newValue}`);
        }
        caretPosition = 3;
        break;
      default:
        break;
      }

      const actualValue = timeArr.join('');
      const [hour, minute] = actualValue.split(':');
      const updatedHours = updateChecked(hours, hour);
      const updatedMinutes = updateChecked(minutes, minute);

      this.setState({
        [name]: actualValue,
        caretPosition,
        hours: updatedHours,
        minutes: updatedMinutes,
      }, () => {
        target.selectionStart = caretPosition;
        target.selectionEnd = caretPosition;

        this.updateIsValid();
      });
    }
  }

  handleChecked(e) {
    const {
      hour, hours, minute, minutes,
    } = this.state;
    const { name, value } = e.target;

    if (name === 'hour') {
      const updatedHours = updateChecked(hours, value);
      const time = `${value}:${minute}`;

      this.setState({
        time,
        [name]: value,
        hours: updatedHours,
      }, () => this.updateIsValid(true));
    } else if (name === 'minute') {
      const updatedMinutes = updateChecked(minutes, value);
      const time = `${hour}:${value}`;

      this.setState({
        time,
        [name]: value,
        minutes: updatedMinutes,
      }, () => this.updateIsValid(true));
    }
  }

  handleScroll(e) {
    const { scrollTop } = e.target;

    const { hoursScrollRef, minutesScrollRef } = this.state;

    if (hoursScrollRef.current === e.target) {
      if (scrollTop === 0 || scrollTop >= HOURS_DEFAULT_SCROLL_TOP * 2) {
        hoursScrollRef.current.scrollTop = HOURS_DEFAULT_SCROLL_TOP;
      }
    } else if (minutesScrollRef.current === e.target) {
      if (scrollTop === 0 || scrollTop >= MINUTES_DEFAULT_SCROLL_TOP * 2) {
        minutesScrollRef.current.scrollTop = MINUTES_DEFAULT_SCROLL_TOP;
      }
    }
  }

  handleBlur(e) {
    const { onChange, name } = this.props;
    const {
      inputRef, inputDummyRef, hoursRef, minutesRef,
    } = this.state;
    const validClasses = [
      'time-picker-input-dummy',
      'time-picker-hours',
      'time-picker-minutes',
      'time-picker-container',
      'time-picker-checkbox',
    ];

    const { relatedTarget } = e;
    const isItem = relatedTarget
      ? validClasses.some((className) => relatedTarget.classList.contains(className))
      : false;

    if (isItem) {
      inputRef.current.focus();
    } else {
      const { time: value } = this.state;

      inputDummyRef.current.classList.remove('focus');
      hoursRef.current.classList.remove('highlighted');
      minutesRef.current.classList.remove('highlighted');
      this.setState({ showContainer: false }, () => onChange({ target: { name, value } }));
    }
  }

  updateIsValid(updateDummyFocus = false) {
    const { required, valid } = this.props;
    const { time, inputDummyRef } = this.state;

    if (required) {
      if (valid === null) {
        const isValid = moment(time, 'HH:mm').isValid();

        this.setState({ isValid }, () => {
          if (updateDummyFocus) inputDummyRef.current.classList.add('focus');
        });
      } else {
        this.setState({ isValid: valid }, () => {
          if (updateDummyFocus) inputDummyRef.current.classList.add('focus');
        });
      }
    }
  }

  initialize() {
    const { value } = this.props;

    const isValid = moment(value, 'HH:mm').isValid();
    const time = isValid
      ? value
      : '--:--';

    const [hour, minute] = time.split(':');

    const hours = HOURS_24H_FORMAT.reduce((acc, x) => ({ ...acc, [x]: isValid ? hour === x : x === '00' }), {});
    const minutes = MINUTES_24H_FORMAT.reduce((acc, x) => ({ ...acc, [x]: isValid ? minute === x : x === '59' }), {});

    this.setState({
      time,
      hour,
      hours,
      minute,
      minutes,
    }, this.updateIsValid);
  }

  render() {
    const {
      inputRef,
      inputDummyRef,
      hoursRef,
      minutesRef,
      hoursScrollRef,
      minutesScrollRef,
      showContainer,
      time,
      isValid,
      hours,
      minutes,
      hoursList,
      minutesList,
    } = this.state;

    const {
      label,
      name,
      disabled,
      className,
    } = this.props;

    function getValidity(validity) {
      if (disabled) return 'disabled';

      if (validity === null) return 'bg-white';

      if (validity) return 'bg-white is-valid';

      return 'bg-white is-invalid';
    }

    return (
      <div
        key={`time-picker-${name}`}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={`time-picker-component col-3 ${className}`}
      >
        <label className="d-block position-relative">
          {label}
          <input
            ref={inputRef}
            onChange={this.handleChange}
            onKeyDown={this.handleKeyDown}
            value={time}
            className={`time-picker-input form-control ${getValidity(isValid)}`}
            type="text"
            name="time"
          />
          <button
            ref={inputDummyRef}
            onClick={this.handleClick}
            type="button"
            name="dummy"
            className={`time-picker-input-dummy form-control ${getValidity(isValid)}`}
            disabled={disabled}
          >
            <span ref={hoursRef} onClick={this.handleClick} tabIndex="-1" role="button" className="time-picker-hours">{time.split(':')[0]}</span>
            :
            <span ref={minutesRef} onClick={this.handleClick} tabIndex="-1" role="button" className="time-picker-minutes">{time.split(':')[1]}</span>
          </button>
        </label>
        {showContainer ? (
          <div className="time-picker-container d-flex show">
            <Hours
              scrollRef={hoursScrollRef}
              list={hoursList}
              hours={hours}
              scrollHandler={this.handleScroll}
              checkboxHandler={this.handleChecked}
            />
            <Minutes
              scrollRef={minutesScrollRef}
              list={minutesList}
              minutes={minutes}
              scrollHandler={this.handleScroll}
              checkboxHandler={this.handleChecked}
            />
          </div>
        ) : null}
      </div>
    );
  }
}

TimePicker.propTypes = propTypes;
TimePicker.defaultProps = defaultProps;

export default TimePicker;
