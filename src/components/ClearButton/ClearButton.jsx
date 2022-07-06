import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import './styles.scss';

const propTypes = {
  t: PropTypes.func.isRequired,
  handler: PropTypes.func.isRequired,
  isVisible: PropTypes.bool.isRequired,
};

function ClearButton(props) {
  const {
    t,
    handler,
    isVisible,
  } = props;

  const visibility = isVisible ? 'visible' : 'hidden';

  return (
    <button
      onClick={handler}
      type="button"
      title={t('components.clearButton.clear')}
      className="clear-btn btn btn-danger"
      style={{ visibility }}
      tabIndex="-1"
      data-testid="clearButton"
    >
      <FontAwesomeIcon icon={faTimes} />
    </button>
  );
}

ClearButton.propTypes = propTypes;

export default withTranslation()(ClearButton);
