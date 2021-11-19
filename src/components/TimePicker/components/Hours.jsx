import PropTypes from 'prop-types';

const propTypes = {
  scrollRef: PropTypes.shape().isRequired,
  scrollHandler: PropTypes.func.isRequired,
  checkboxHandler: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  hours: PropTypes.shape().isRequired,
};

const Hours = function (props) {
  const {
    scrollRef, scrollHandler, checkboxHandler, list, hours,
  } = props;

  return (
    <ul
      ref={scrollRef}
      onScroll={scrollHandler}
      className="d-flex flex-column overflow-auto"
    >
      {list.map((x) => x.map((y) => (
        <label key={y} className={`${hours[y] ? 'checked' : ''}`}>
          {y}
          <input
            onChange={checkboxHandler}
            checked={hours[y]}
            name="hour"
            defaultValue={y}
            className="time-picker-checkbox form-check-input "
            type="checkbox"
          />
        </label>
      )))}
    </ul>
  );
};

Hours.propTypes = propTypes;

export default Hours;
