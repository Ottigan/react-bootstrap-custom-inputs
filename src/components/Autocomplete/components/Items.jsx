import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  t: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape()),
    isSelected: PropTypes.bool.isRequired,
  })).isRequired,
  visibleItemsCount: PropTypes.number.isRequired,
  handler: PropTypes.func.isRequired,
};

const Items = function (props) {
  const {
    t, show, items, visibleItemsCount, handler,
  } = props;

  function renderItems(x, prevKey = null, paddingLeft = 15) {
    let someChildren = false;

    return x.map((item) => {
      const {
        key, title, value, children, isSelected, isVisible, isImportant,
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
              name="item"
              value={currentKey}
              title={title || value}
              className={`w-100 autocomplete-item text-start text-truncate list-group-item ${someChildren ? 'parent' : ''} ${isSelected ? 'selected' : ''}`}
              tabIndex="-1"
              style={{ paddingLeft }}
            >
              {value}
              {isImportant
                ? <FontAwesomeIcon icon={faStar} />
                : null}
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
    if (visibleItemsCount === 0) {
      return (
        <li className="autocomplete-item text-center fw-normal list-group-item" data-testid="fallback-item">
          {t('components.autocomplete.components.items.404')}
        </li>
      );
    }

    return renderItems(items);
  }

  return null;
};

Items.propTypes = propTypes;

export default withTranslation()(Items);
