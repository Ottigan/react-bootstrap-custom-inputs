import PropTypes from 'prop-types';
import { useEffect } from 'react';
import ClearButton from 'components/ClearButton';
import cn from 'classnames';
import './styles.scss';
import useDebounce from '../../hooks/useDebounce';

const propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  value: PropTypes.string,
  className: PropTypes.string,
  required: PropTypes.bool,
};

const defaultProps = {
  label: '',
  value: '',
  className: '',
  required: false,
};

function TextInput({
  value: propsValue, onChange, name, label, className, required,
}) {
  const [value, setValue, debouncedValue] = useDebounce(propsValue);

  useEffect(() => {
    onChange({ target: { name, value: debouncedValue } });
  }, [debouncedValue, name, onChange]);

  return (
    <div className={cn('text-input-component', className)}>
      <label className={cn('text-input-label d-block w-100', required)}>
        {label}
        <input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          name={name}
          type="text"
          className="form-control"
        />
        <ClearButton
          handler={() => setValue('')}
          isVisible={!!value.length}
        />
      </label>
    </div>
  );
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

export default TextInput;
