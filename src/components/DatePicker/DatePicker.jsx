import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight, faCalendar } from '@fortawesome/free-solid-svg-icons';
import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import moment from 'moment';
import { uuidv4 } from '../../helpers/idGenerators';
import './styles.scss';

const MONTHS = {
  1: 'january',
  2: 'february',
  3: 'march',
  4: 'april',
  5: 'may',
  6: 'june',
  7: 'july',
  8: 'august',
  9: 'september',
  10: 'october',
  11: 'november',
  12: 'december',
};
const WEEK_LENGTH = 7;
const DATE_DOT_FORMAT = 'DD.MM.YYYY';

const propTypes = {
  t: PropTypes.func.isRequired,
  i18n: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.instanceOf(Date),
    PropTypes.instanceOf(moment),
  ]),
  className: PropTypes.string,
  language: PropTypes.string,
  multiselect: PropTypes.bool,
  required: PropTypes.bool,
  asIcon: PropTypes.bool,
  valid: PropTypes.bool,
  disabled: PropTypes.bool,
};

const defaultProps = {
  value: '',
  multiselect: false,
  className: '',
  language: '',
  required: false,
  asIcon: false,
  valid: null,
  disabled: false,
};

class DatePicker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      inputRef: createRef(),
      btnRef: createRef(),
      currentPeriod: moment(),
      formattedCurrentPeriod: '',
      dates: DATE_DOT_FORMAT,
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
    const {
      value: prevValue, valid: prevValid, name: prevName, language: prevLanguage,
    } = prevProps;
    const {
      value: currValue, valid: currValid, name: currName, language: currLanguage,
    } = this.props;

    const isValueSame = prevValue.length === currValue.length
    && JSON.stringify(prevValue) === JSON.stringify(currValue);

    if (!isValueSame || prevName !== currName || prevLanguage !== currLanguage) {
      this.initialize();
    } else if (prevValid !== currValid) {
      this.updateIsValid();
    }
  }

  handleChange() {
    const { onChange, name, multiselect } = this.props;
    const { dates } = this.state;

    const value = (() => {
      if (multiselect) {
        return dates && dates !== DATE_DOT_FORMAT
          ? dates.split(', ').map((date) => moment(date, DATE_DOT_FORMAT).format('YYYY-MM-DD'))
          : [];
      }

      return dates === DATE_DOT_FORMAT
        ? ''
        : moment(dates, DATE_DOT_FORMAT).format('YYYY-MM-DD');
    })();

    onChange({ target: { name, value } });
  }

  handleChecked(e) {
    const { trackableDates } = this.state;
    const { multiselect } = this.props;
    const { name, checked } = e.target;

    if (multiselect) {
      const updatedTrackable = {
        ...trackableDates,
        [name]: checked,
      };

      const dates = Object.keys(updatedTrackable)
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
        .map((x) => moment(x).format(DATE_DOT_FORMAT))
        .join(', ') || DATE_DOT_FORMAT;

      this.setState({
        dates,
        trackableDates: updatedTrackable,
      }, this.handleChange);
    } else {
      const date = moment(name).format(DATE_DOT_FORMAT);

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
        showContainer: false,
      }, () => this.entryPoint.blur());
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
      this.entryPoint.focus();
    } else {
      this.setState({ showContainer: false }, this.handleChange);
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

  // Get element through which the component was started
  get entryPoint() {
    const { asIcon } = this.props;
    const { inputRef, btnRef } = this.state;

    if (asIcon) {
      return btnRef.current;
    }

    return inputRef.current;
  }

  updateCurrentMonth(initial) {
    const { currentPeriod, trackableDates, dates } = this.state;

    const initialDates = dates === DATE_DOT_FORMAT
      ? []
      : dates.split(' ').map((date) => moment(date, DATE_DOT_FORMAT).format('YYYY-MM-DD'));
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

    const { t } = this.props;

    const currentPeriodMonth = MONTHS[moment(currentPeriod).format('M')];
    const currentPeriodYear = moment(currentPeriod).format('YYYY');

    const formattedCurrentPeriod = `${t(
      `components.datePicker.${currentPeriodMonth}`,
    )}, ${currentPeriodYear}`;

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
    const { value, i18n, language } = this.props;
    i18n.changeLanguage(language);
    moment.updateLocale('en', { week: { dow: 1 } });

    const isArray = Array.isArray(value);
    const isValid = isArray
      ? value.some((date) => !moment(date).isValid())
      : moment(value).isValid();

    if (isValid) {
      const currentPeriod = isArray ? value[0] : value;
      const dates = isArray
        ? value.map((date) => moment(date).format(DATE_DOT_FORMAT)).join(', ')
        : moment(value).format(DATE_DOT_FORMAT);

      this.setState({
        currentPeriod,
        dates,
      }, () => {
        this.updateCurrentMonth(true);
        this.updateIsValid();
        this.handleChange();
      });
    } else {
      const currentPeriod = moment();
      // * Default preview if value is invalid
      const dates = isArray
        ? [DATE_DOT_FORMAT]
        : DATE_DOT_FORMAT;

      this.setState({
        currentPeriod,
        dates,
      }, () => {
        this.updateCurrentMonth(true);
        this.updateIsValid();
      });
    }
  }

  render() {
    const {
      inputRef,
      btnRef,
      showContainer,
      dates,
      trackableDates,
      currentMonth,
      formattedCurrentPeriod,
      isValid,
    } = this.state;

    const {
      t,
      label,
      name,
      asIcon,
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
      <span key={`date-picker-${name}`} onFocus={this.handleFocus} onBlur={this.handleBlur} className={`date-picker-component ${className}`}>
        {asIcon
          ? (
            <button
              ref={btnRef}
              onClick={this.handleFocus}
              title={t('components.datePicker.calendar')}
              type="button"
              name="dates"
              className="btn btn-dark"
            >
              <FontAwesomeIcon icon={faCalendar} />
            </button>
          )
          : (
            <label className="d-block">
              {label}
              <input
                ref={inputRef}
                value={dates}
                onClick={this.handleFocus}
                className={`date-picker-input form-control ${getValidity(isValid)}`}
                type="text"
                name="dates"
                disabled={disabled}
                readOnly
              />
            </label>
          )}
        {showContainer ? (
          <div className="date-picker-container">
            <table tabIndex="-1" className="date-picker-table table">
              <thead className="table-dark">
                <tr>
                  <th colSpan="1">
                    <button
                      onClick={this.handlePrev}
                      title={t('components.datePicker.previous')}
                      type="button"
                      tabIndex="-1"
                      className="date-picker-prev btn btn-dark"
                    >
                      <FontAwesomeIcon icon={faAngleLeft} />
                    </button>
                  </th>
                  <th colSpan="5" className="text-center">
                    {formattedCurrentPeriod}
                  </th>
                  <th colSpan="1">
                    <button
                      onClick={this.handleNext}
                      title={t('components.datePicker.next')}
                      type="button"
                      tabIndex="-1"
                      className="date-picker-next btn btn-dark"
                    >
                      <FontAwesomeIcon icon={faAngleRight} />
                    </button>
                  </th>
                </tr>
                <tr>
                  <th className="date-picker-heading">{t('components.datePicker.monday')}</th>
                  <th className="date-picker-heading">{t('components.datePicker.tuesday')}</th>
                  <th className="date-picker-heading">{t('components.datePicker.wednesday')}</th>
                  <th className="date-picker-heading">{t('components.datePicker.thursday')}</th>
                  <th className="date-picker-heading">{t('components.datePicker.friday')}</th>
                  <th className="date-picker-heading">{t('components.datePicker.saturday')}</th>
                  <th className="date-picker-heading">{t('components.datePicker.sunday')}</th>
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
                      const isToday = day.isSame(moment().startOf('day'));

                      const tdClassName = (() => {
                        if (checked) return 'checked';

                        if (isToday) return 'today';

                        return '';
                      })();

                      return (
                        <td key={shortDay} className={tdClassName}>
                          {shortDay}
                          <input
                            onChange={this.handleChecked}
                            checked={checked}
                            name={longDay}
                            type="checkbox"
                            tabIndex="-1"
                            className="date-picker-checkbox form-check-input"
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
      </span>
    );
  }
}

DatePicker.propTypes = propTypes;
DatePicker.defaultProps = defaultProps;

export default withTranslation()(DatePicker);
