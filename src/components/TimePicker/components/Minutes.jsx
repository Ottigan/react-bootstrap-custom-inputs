import PropTypes from 'prop-types';

const propTypes = {
  scrollRef: PropTypes.shape().isRequired,
  scrollHandler: PropTypes.func.isRequired,
  checkboxHandler: PropTypes.func.isRequired,
  list: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  minutes: PropTypes.shape().isRequired,
};

const Minutes = function (props) {
  const {
    scrollRef, scrollHandler, checkboxHandler, list, minutes,
  } = props;

  return (
    <ul
      ref={scrollRef}
      onScroll={scrollHandler}
      className="d-flex flex-column overflow-auto"
    >
      {list.map((x) => x.map((y) => (
        <label key={y} className={`${minutes[y] ? 'checked' : ''}`}>
          {y}
          <input
            onChange={checkboxHandler}
            checked={minutes[y]}
            name="minute"
            value={y}
            className="time-picker-checkbox form-check-input"
            type="checkbox"
          />
        </label>
      )))}
    </ul>
  );
};

Minutes.propTypes = propTypes;

export default Minutes;
