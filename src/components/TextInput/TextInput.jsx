import PropTypes from 'prop-types';
import { useCallback, useEffect } from 'react';
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
  valid: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
};

const defaultProps = {
  label: '',
  value: '',
  className: '',
  valid: null,
  required: false,
  disabled: false,
};

function TextInput({
  value: propsValue, onChange, name, label, className, valid, required, disabled,
}) {
  const [value, setValue, debouncedValue] = useDebounce(propsValue);

  useEffect(() => {
    if (propsValue !== debouncedValue) {
      onChange({ target: { name, value: debouncedValue } });
    }
  }, [debouncedValue, name, onChange, propsValue]);

  const getValidity = useCallback((validity) => {
    if (!required || disabled) return '';

    if (validity) return 'is-valid';

    return 'is-invalid';
  }, [disabled, required]);

  return (
    <div className={cn('text-input-component', className)}>
      <label className={cn('text-input-label position-relative w-100')}>
        {label}
        <input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          name={name}
          type="text"
          className={cn('form-control', getValidity(valid))}
          disabled={disabled}
          data-testid="input"
        />
        <ClearButton
          handler={() => setValue('')}
          isVisible={!disabled && !!value.length}
        />
      </label>
    </div>
  );
}

TextInput.propTypes = propTypes;
TextInput.defaultProps = defaultProps;

export default TextInput;
