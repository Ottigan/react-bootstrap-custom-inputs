import PropTypes from 'prop-types';

const propTypes = {
  show: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape()),
    isSelected: PropTypes.bool.isRequired,
  })).isRequired,
  handler: PropTypes.func.isRequired,
};

const Items = function (props) {
  const {
    show, items, handler,
  } = props;

  function renderItems(x, prevKey = null, paddingLeft = 15) {
    let someChildren = false;

    return x.map((item) => {
      const {
        key, title, value, children, isSelected, isVisible,
      } = item;

      if (children) {
        someChildren = true;
      }

      const currentKey = prevKey ? `${prevKey}.${key}` : key;

      if (isVisible) {
        return (
          <li key={currentKey}>
            <button
              onClick={handler}
              type="button"
              value={currentKey}
              title={title || value}
              className={`w-100 autocomplete-item text-start text-truncate list-group-item ${someChildren ? 'parent' : ''} ${isSelected ? 'selected' : ''}`}
              style={{ paddingLeft }}
            >
              {value}
            </button>
            {children
              ? <ul>{renderItems(children, currentKey, paddingLeft + 15)}</ul>
              : null}
          </li>
        );
      }

      return children
        ? renderItems(children, currentKey)
        : null;
    });
  }

  if (show) {
    if (!items.length) {
      return (
        <li className="autocomplete-item text-center list-group-item">
          No data...
        </li>
      );
    }

    return renderItems(items);
  }

  return null;
};

Items.propTypes = propTypes;

export default Items;
