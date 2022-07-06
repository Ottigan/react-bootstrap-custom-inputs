import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

const propTypes = {
  areAllSelected: PropTypes.bool.isRequired,
  handler: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  show: PropTypes.bool.isRequired,
  multiselect: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

const MasterSelect = function (props) {
  const {
    t, items, show, handler, multiselect, areAllSelected,
  } = props;

  if (show && multiselect && items.length && !areAllSelected) {
    return (
      <li>
        <button
          onClick={handler}
          type="button"
          name="masterSelect"
          tabIndex="-1"
          className="w-100 autocomplete-item text-start fw-bold text-truncate list-group-item"
          data-testid="masterSelect"
        >
          {t('components.autocomplete.components.masterSelect.selectAll')}
        </button>
      </li>
    );
  }

  return null;
};

MasterSelect.propTypes = propTypes;

export default withTranslation()(MasterSelect);
