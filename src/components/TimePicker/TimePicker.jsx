import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import ClearButton from 'components/ClearButton';
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

const FALLBACK_TIME = '--:--';

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
  value: FALLBACK_TIME,
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
      hoursRef: createRef(),
      minutesRef: createRef(),
      hoursScrollRef: createRef(),
      minutesScrollRef: createRef(),
      caretPosition: 0,
      time: '',
      hoursList: [HOURS_24H_FORMAT, HOURS_24H_FORMAT, HOURS_24H_FORMAT],
      hour: HOURS_24H_FORMAT[0],
      hours: {},
      minutesList: [MINUTES_24H_FORMAT, MINUTES_24H_FORMAT, MINUTES_24H_FORMAT],
      minute: MINUTES_24H_FORMAT[0],
      minutes: {},
      showContainer: false,
      isValid: null,
      isClosing: false,
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleChecked = this.handleChecked.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleClear = this.handleClear.bind(this);
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
      inputRef, hoursRef, minutesRef,
    } = this.state;
    const { disabled } = this.props;
    const { target } = e;

    if (!disabled && !target.classList.contains('highlighted')) {
      let caretPosition = 0;

      if (target.classList.contains('time-picker-minutes')) {
        caretPosition = 3;
      }

      this.setState({ caretPosition }, () => {
        inputRef.current.focus();
        inputRef.current.selectionStart = caretPosition;
        inputRef.current.selectionEnd = caretPosition;

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

  handleFocus(e) {
    const {
      showContainer, inputRef, hoursRef, minutesRef, hoursScrollRef, minutesScrollRef,
    } = this.state;
    const { disabled } = this.props;
    const { name } = e.target.dataset;

    if (['time', 'dummy', 'hours', 'minutes'].includes(name) && !showContainer && !disabled) {
      const isFocusOnMinutes = name === 'minutes';

      this.setState({
        showContainer: true,
        caretPosition: isFocusOnMinutes ? 3 : 0,
        isClosing: false,
      }, () => {
        inputRef.current.focus();

        if (isFocusOnMinutes) {
          minutesRef.current.classList.add('highlighted');
        } else {
          hoursRef.current.classList.add('highlighted');
        }

        hoursScrollRef.current.scrollTop = HOURS_DEFAULT_SCROLL_TOP;
        minutesScrollRef.current.scrollTop = MINUTES_DEFAULT_SCROLL_TOP;
      });
    }
  }

  handleKeyDown(e) {
    const {
      inputRef, hoursRef, minutesRef,
    } = this.state;
    const { key, shiftKey } = e;

    const isBackwardTab = key === 'Tab' && shiftKey;
    const isForwardTab = key === 'Tab' && !shiftKey;

    if (key === 'ArrowLeft') {
      hoursRef.current.classList.add('highlighted');
      minutesRef.current.classList.remove('highlighted');

      this.setState({ caretPosition: 0 });
    } else if (key === 'ArrowRight') {
      minutesRef.current.classList.add('highlighted');
      hoursRef.current.classList.remove('highlighted');

      this.setState({ caretPosition: 3 });
    } else if (isBackwardTab) {
      if (minutesRef.current.classList.contains('highlighted')) {
        hoursRef.current.classList.add('highlighted');
        minutesRef.current.classList.remove('highlighted');

        this.setState({ caretPosition: 0 });
      } else if (hoursRef.current.classList.contains('highlighted')) {
        // enables ability to close component
        this.setState({ isClosing: true }, () => hoursRef.current.focus());
      }
    } else if (isForwardTab) {
      if (hoursRef.current.classList.contains('highlighted')) {
        hoursRef.current.classList.remove('highlighted');
        minutesRef.current.classList.add('highlighted');

        this.setState({ caretPosition: 3 });
      } else if (minutesRef.current.classList.contains('highlighted')) {
        inputRef.current.blur();
      }
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
        if (Number(newValue) < 3) {
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

  handleClear(e) {
    e.stopPropagation();

    this.setState({
      time: FALLBACK_TIME,
    }, () => this.updateParent(false));
  }

  handleBlur(e) {
    const {
      inputRef, hoursRef, minutesRef, isClosing,
    } = this.state;

    const timePickerInputClass = 'time-picker-input';
    const timePickerHoursClass = 'time-picker-hours';
    const timePickerMinutesClass = 'time-picker-minutes';

    const interactiveClasses = [
      timePickerInputClass,
      timePickerHoursClass,
      timePickerMinutesClass,
    ];

    const allClasses = [
      ...interactiveClasses,
      'time-picker-component',
      'time-picker-input-dummy',
      'time-picker-container',
      'time-picker-checkbox',
    ];

    const { relatedTarget } = e;

    const isInteractive = relatedTarget && interactiveClasses
      .some((c) => relatedTarget.classList.contains(c));

    const isFromSameInstance = isInteractive
      ? [inputRef, hoursRef, minutesRef]
        .some((ref) => ref.current === relatedTarget)
      : true;

    const shouldRefocus = relatedTarget && isFromSameInstance && !isClosing
      ? allClasses.some((className) => relatedTarget.classList.contains(className))
      : false;

    if (shouldRefocus) {
      inputRef.current.focus();
    } else {
      hoursRef.current.classList.remove('highlighted');
      minutesRef.current.classList.remove('highlighted');

      this.updateParent(false);
    }
  }

  updateParent(showContainer) {
    const { inputRef, time: value } = this.state;

    const {
      value: prevValue,
      onChange,
      name,
    } = this.props;

    const isValueDifferent = value !== prevValue;

    this.setState({ showContainer }, () => {
      if (isValueDifferent) onChange({ target: { name, value } });

      inputRef.current.blur();
    });
  }

  updateIsValid() {
    const { required, valid } = this.props;
    const { time } = this.state;

    if (required) {
      if (valid === null) {
        const isValid = moment(time, 'HH:mm').isValid();

        this.setState({ isValid });
      } else {
        this.setState({ isValid: valid });
      }
    }
  }

  initialize() {
    const { value } = this.props;

    const isValid = moment(value, 'HH:mm').isValid() && value.length === 5;
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
        tabIndex="-1"
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
        role="button"
        className={`time-picker-component col-3 ${className}`}
      >
        <label className="d-block position-relative">
          {label}
          <div
            data-name="dummy"
            className={`time-picker-input-dummy form-control ${getValidity(isValid)}`}
          >
            <button ref={hoursRef} type="button" data-name="hours" className="time-picker-hours">{time.split(':')[0]}</button>
            <span className="time-picker-seperator">:</span>
            <button ref={minutesRef} type="button" data-name="minutes" className="time-picker-minutes">{time.split(':')[1]}</button>
          </div>
          <input
            ref={inputRef}
            onChange={this.handleChange}
            value={time}
            className={`time-picker-input form-control ${getValidity(isValid)}`}
            type="text"
            name="time"
            data-name="time"
            disabled={disabled}
          />
          <ClearButton
            handler={this.handleClear}
            isVisible={!disabled && time !== FALLBACK_TIME}
          />
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
