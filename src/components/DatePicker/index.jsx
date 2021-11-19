import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { uuidv4 } from '../../helpers/idGenerators';
import './styles.scss';

const WEEK_LENGTH = 7;

const propTypes = {
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
  ]),
  className: PropTypes.string,
  multiselect: PropTypes.bool,
  required: PropTypes.bool,
  valid: PropTypes.bool,
  disabled: PropTypes.bool,
};

const defaultProps = {
  label: '',
  value: moment(),
  multiselect: false,
  className: '',
  required: false,
  valid: null,
  disabled: false,
};

class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputRef: createRef(),
      currentPeriod: moment(),
      formattedCurrentPeriod: '',
      dates: moment().format('DD.MM.YYYY'),
      trackableDates: {},
      currentMonth: [],
      showContainer: false,
      isValid: null,
    };

    this.handleChecked = this.handleChecked.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    const { valid: prevValid, name: prevName } = prevProps;
    const { valid: currValid, name: currName } = this.props;

    if (prevName !== currName) {
      this.initialize();
    } else if (prevValid !== currValid) {
      this.updateIsValid();
    }
  }

  handleChecked(e) {
    const { inputRef, trackableDates } = this.state;
    const { multiselect, onChange } = this.props;
    const { name, checked } = e.target;

    if (multiselect) {
      const updatedTrackable = {
        ...trackableDates,
        [name]: checked,
      };

      const dates = multiselect
        ? Object.keys(updatedTrackable)
          .reduce((acc, key) => {
            if (updatedTrackable[key]) {
              return [...acc, key];
            }

            return acc;
          }, [])
          .sort((a, b) => {
            if (moment(a).isAfter(b)) return 1;

            if (moment(a).isSame(b)) return 0;

            return -1;
          })
          .map((x) => moment(x).format('DD.MM.YYYY'))
          .join(', ')
        : name;

      const value = multiselect
        ? dates.split(', ').map((date) => moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD'))
        : moment(dates, 'DD.MM.YYYY').format('YYYY-MM-DD');

      this.setState({
        dates,
        trackableDates: updatedTrackable,
      }, () => onChange({ target: { name: 'dates', value } }));
    } else {
      const date = moment(name).format('DD.MM.YYYY');

      Object.keys(trackableDates).forEach((key) => {
        if (key === name) {
          trackableDates[key] = true;
        } else {
          trackableDates[key] = false;
        }
      });

      this.setState({
        dates: date,
        trackableDates,
      }, () => {
        this.updateIsValid();
        inputRef.current.blur();
      });
    }
  }

  handleFocus(e) {
    const { showContainer } = this.state;
    const { disabled } = this.props;
    const { name } = e.target;

    if (name === 'dates' && !showContainer && !disabled) {
      this.setState({ showContainer: true });
    }
  }

  handleBlur(e) {
    const { onChange, name } = this.props;
    const { inputRef } = this.state;
    const validClasses = [
      'date-picker-container',
      'date-picker-prev',
      'date-picker-next',
      'date-picker-table',
      'date-picker-checkbox',
    ];
    const { relatedTarget } = e;
    const isItem = relatedTarget
      ? validClasses.some((className) => relatedTarget.classList.contains(className))
      : false;

    if (isItem) {
      inputRef.current.focus();
    } else {
      const { dates } = this.state;
      const { multiselect } = this.props;

      const value = multiselect
        ? dates.split(', ').map((date) => moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD'))
        : moment(dates, 'DD.MM.YYYY').format('YYYY-MM-DD');

      this.setState({ showContainer: false }, () => onChange({ target: { name, value } }));
    }
  }

  handlePrev() {
    const { currentPeriod } = this.state;
    const prevPeriod = moment(currentPeriod).startOf('month').subtract(1, 'month');

    this.setState({ currentPeriod: prevPeriod }, this.updateCurrentMonth);
  }

  handleNext() {
    const { currentPeriod } = this.state;
    const nextPeriod = moment(currentPeriod).startOf('month').add(1, 'month');

    this.setState({ currentPeriod: nextPeriod }, this.updateCurrentMonth);
  }

  updateCurrentMonth(initial) {
    const { currentPeriod, trackableDates, dates } = this.state;

    const initialDates = dates.split(' ').map((date) => moment(date, 'DD.MM.YYYY').format('YYYY-MM-DD'));
    const lastInitialDate = initialDates[initialDates.length - 1];
    const endOfLastMonth = moment(lastInitialDate).endOf('month');

    const startOfMonth = moment(currentPeriod).startOf('month');
    const daysCount = initial && initialDates[1]
      ? endOfLastMonth.diff(startOfMonth, 'days') + 1
      : moment(startOfMonth).daysInMonth();

    const currentMonth = Array.from({ length: daysCount }, (_, i) => i)
      .reduce(
        (acc, dateOfMonth, i, arr) => {
          const updatedAcc = acc;
          const lastWeek = updatedAcc[updatedAcc.length - 1];

          const day = moment(startOfMonth).add(dateOfMonth, 'days');
          const weekday = day.weekday();
          const formattedDay = day.format('YYYY-MM-DD');
          const isChecked = initial
            ? initialDates.some((date) => date === formattedDay)
            : !!trackableDates[formattedDay];
          trackableDates[formattedDay] = isChecked;

          if (startOfMonth.isSame(day, 'month')) lastWeek.push(day);

          if (weekday === 6 && arr.length - 1 !== i) {
            const lengthDiff = WEEK_LENGTH - lastWeek.length;
            const paddedValues = Array.from({ length: lengthDiff }, () => null);

            if (startOfMonth.isSame(day, 'month')) {
              lastWeek.splice(0, 0, ...paddedValues);

              return [...updatedAcc, []];
            }
          }

          if (arr.length - 1 === i) {
            const lengthDiff = WEEK_LENGTH - lastWeek.length;

            const paddedValues = Array.from({ length: lengthDiff }, () => null);

            if (startOfMonth.isSame(day, 'month')) lastWeek.splice(lastWeek.length, 0, ...paddedValues);
          }

          return updatedAcc;
        },
        [[]],
      );

    const currentPeriodMonth = moment(currentPeriod).format('MMMM').toLowerCase();
    const currentPeriodYear = moment(currentPeriod).format('YYYY');
    const formattedCurrentPeriod = `${currentPeriodMonth[0].toUpperCase() + currentPeriodMonth.slice(1)}, ${currentPeriodYear}`;

    this.setState({
      currentPeriod,
      formattedCurrentPeriod,
      trackableDates,
      currentMonth,
    });
  }

  updateIsValid() {
    const { required, valid } = this.props;
    const { dates } = this.state;

    if (required) {
      if (valid === null) {
        this.setState({ isValid: !!dates.length });
      } else {
        this.setState({ isValid: valid });
      }
    }
  }

  initialize() {
    const { value } = this.props;

    function fallbackMoment(data) {
      return moment(data).isValid() ? moment(data) : moment();
    }

    const currentPeriod = (() => {
      const isArray = Array.isArray(value);

      return isArray ? fallbackMoment(value[0]) : fallbackMoment(value);
    })();

    const dates = (() => {
      const isArray = Array.isArray(value);
      const isValid = isArray
        ? value.every((date) => moment(date).isValid())
        : moment(value).isValid();

      if (isArray && isValid) {
        return value.map((date) => moment(date).format('DD.MM.YYYY')).join(', ');
      }

      if (isValid) {
        return moment(value).format('DD.MM.YYYY');
      }

      return moment().format('DD.MM.YYYY');
    })();

    this.setState({
      currentPeriod,
      dates,
    }, () => {
      this.updateCurrentMonth(true);
      this.updateIsValid();
    });
  }

  render() {
    const {
      inputRef,
      showContainer,
      dates,
      trackableDates,
      currentMonth,
      formattedCurrentPeriod,
      isValid,
    } = this.state;

    const {
      label,
      name,
      disabled,
      className,
    } = this.props;

    function getValidity(validity) {
      if (disabled) return '';

      if (validity === null) return 'bg-white';

      if (validity) return 'bg-white is-valid';

      return 'bg-white is-invalid';
    }

    return (
      <div key={`date-picker-${name}`} onFocus={this.handleFocus} onBlur={this.handleBlur} className={`date-picker-component ${className}`}>
        <label className="d-block">{label}</label>
        <input
          ref={inputRef}
          value={dates}
          className={`date-picker-input form-control mb-2 ${getValidity(isValid)}`}
          type="text"
          name="dates"
          readOnly
        />
        {showContainer ? (
          <div className="date-picker-container">
            <table tabIndex="-1" className="date-picker-table table">
              <thead className="table-dark">
                <tr>
                  <th colSpan="1">
                    <button
                      onClick={this.handlePrev}
                      title="Previous"
                      className="date-picker-prev btn btn-dark"
                      type="button"
                    >
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-left" className="angle-arrow" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M192 448c-8.188 0-16.38-3.125-22.62-9.375l-160-160c-12.5-12.5-12.5-32.75 0-45.25l160-160c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25L77.25 256l137.4 137.4c12.5 12.5 12.5 32.75 0 45.25C208.4 444.9 200.2 448 192 448z" /></svg>
                    </button>
                  </th>
                  <th colSpan="5" className="text-center">
                    {formattedCurrentPeriod}
                  </th>
                  <th colSpan="1">
                    <button
                      onClick={this.handleNext}
                      title="Next"
                      className="date-picker-next btn btn-dark"
                      type="button"
                    >
                      <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-right" className="angle-arrow" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 512"><path fill="currentColor" d="M64 448c-8.188 0-16.38-3.125-22.62-9.375c-12.5-12.5-12.5-32.75 0-45.25L178.8 256L41.38 118.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0l160 160c12.5 12.5 12.5 32.75 0 45.25l-160 160C80.38 444.9 72.19 448 64 448z" /></svg>
                    </button>
                  </th>
                </tr>
                <tr>
                  <th className="date-picker-heading">Mon</th>
                  <th className="date-picker-heading">Tue</th>
                  <th className="date-picker-heading">Wed</th>
                  <th className="date-picker-heading">Thu</th>
                  <th className="date-picker-heading">Fri</th>
                  <th className="date-picker-heading">Sat</th>
                  <th className="date-picker-heading">Sun</th>
                </tr>
              </thead>
              <tbody>
                {currentMonth.map((week) => {
                  const trKey = `week${JSON.stringify(week)}`;
                  const formattedWeek = week.map((day) => {
                    const tdKey = day ? `day${day}` : uuidv4();
                    if (day) {
                      const longDay = day.format('YYYY-MM-DD');
                      const checked = trackableDates[longDay];
                      const shortDay = day.format('D');
                      return (
                        <td key={shortDay} className={`${checked ? 'checked' : ''}`}>
                          {shortDay}
                          <input
                            onChange={this.handleChecked}
                            checked={checked}
                            name={longDay}
                            className="date-picker-checkbox form-check-input"
                            type="checkbox"
                            id="flexCheckDefault"
                          />
                        </td>
                      );
                    }
                    return <td key={tdKey} className="bg-white pe-auto" />;
                  });
                  return <tr key={trKey}>{formattedWeek}</tr>;
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    );
  }
}

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default DatePicker;
