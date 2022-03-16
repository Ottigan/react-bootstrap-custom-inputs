import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  t: PropTypes.func.isRequired,
  handler: PropTypes.func.isRequired,
  multiselect: PropTypes.bool.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  disabled: PropTypes.bool.isRequired,
  disableDeselect: PropTypes.bool.isRequired,
};

const ClearButton = function (props) {
  const {
    t,
    items,
    handler,
    multiselect,
    disabled,
    disableDeselect,
  } = props;

  function isSomeSelected(data) {
    return data.some((x) => {
      const { isSelected, children } = x;

      if (isSelected) return true;

      if (children) return isSomeSelected(children);

      return false;
    });
  }

  // Returning null caused click event to pass to the element below, this avoids it...
  const visibility = isSomeSelected(items) && (multiselect || !disableDeselect) && !disabled
    ? 'visible'
    : 'hidden';

  return (
    <button
      onClick={handler}
      type="button"
      title={t('components.autocomplete.components.clearButton.clear')}
      className="autocomplete-reset-btn btn btn-danger btn-fa"
      style={{ visibility }}
      data-testid="clearButton"
    >
      <i className="fa fa-times" />
    </button>
  );
};

ClearButton.propTypes = propTypes;

export default withTranslation()(ClearButton);
