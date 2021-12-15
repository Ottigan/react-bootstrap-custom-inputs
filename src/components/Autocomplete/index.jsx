import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Items from './components/Items';
import './styles.scss';

const DEFAULT_ITEM_RENDER_COUNT = 50;

const propTypes = {
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape()),
  })).isRequired,
  label: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  className: PropTypes.string,
  autoComplete: PropTypes.string,
  multiselect: PropTypes.bool,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  valid: PropTypes.bool,
  disableDeselect: PropTypes.bool,
};

const defaultProps = {
  value: '',
  label: '',
  className: '',
  autoComplete: 'off',
  multiselect: false,
  required: false,
  disabled: false,
  valid: null,
  disableDeselect: false,
};

class Autocomplete extends Component {
  static valueComparer(a, b) {
    if (typeof a.value === 'string' && typeof b.value === 'string') {
      return (
        a.value.localeCompare(b.value)
      );
    }

    return a.value - b.value;
  }

  static isSelectedComparer(a, b) {
    return b.isSelected - a.isSelected;
  }

  static isVisibleComparer(a, b) {
    if (a.isVisible === b.isVisible) return 0;

    if (a.isVisible) return -1;

    return 1;
  }

  static extractSelected(items = []) {
    return items.flatMap((item) => {
      const { children, isSelected } = item;

      return isSelected
        ? [item, ...Autocomplete.extractSelected(children)]
        : Autocomplete.extractSelected(children);
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      inputRef: createRef(),
      containerRef: createRef(),
      items: [],
      renderedItems: DEFAULT_ITEM_RENDER_COUNT,
      filter: '',
      showContainer: false,
      isValid: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(prevProps) {
    const {
      value: prevValue, name: prevName, list: prevList, valid: prevValid,
    } = prevProps;
    const {
      value: currValue, name: currName, list: currList, valid: currValid,
    } = this.props;

    if (prevValue !== currValue
      || prevName !== currName
      || prevList.length !== currList.length
      || prevValid !== currValid) {
      this.initialize();
    }
  }

  handleChange(e) {
    const {
      name, type, checked, value,
    } = e.target;
    const actualValue = type === 'checkbox' ? checked : value;

    this.setState({
      [name]: actualValue,
    }, () => this.filterItems());
  }

  handleFocus(e) {
    const { items, showContainer } = this.state;
    const { name } = e.target;

    if (name === 'filter' && !showContainer) {
      const refreshedItems = items
        .map((item) => ({ ...item, isVisible: true }))
        .sort(Autocomplete.valueComparer)
        .sort(Autocomplete.isSelectedComparer);

      this.setState({
        items: refreshedItems,
        showContainer: true,
        filter: '',
      });
    }
  }

  handleBlur(e) {
    const { inputRef, items } = this.state;
    const {
      onChange, name, multiselect, valid,
    } = this.props;
    const validClasses = ['autocomplete-item-container', 'autocomplete-item'];
    const { relatedTarget } = e;
    const isItem = relatedTarget
      ? validClasses.some((className) => relatedTarget.classList.contains(className))
      : false;

    if (isItem) {
      inputRef.current.focus();
    } else {
      const selectedItems = Autocomplete.extractSelected(items);
      const isValid = valid === null ? !!selectedItems.length : valid;
      const selectedKeys = selectedItems.map((item) => item.key);
      const value = multiselect ? selectedKeys : selectedKeys?.[0];

      this.setState({ showContainer: false, isValid }, () => {
        this.renderSelectedPreview();
        onChange({ target: { name, value } });
      });
    }
  }

  handleSelect(e) {
    const { inputRef, items } = this.state;
    const { multiselect, disableDeselect } = this.props;
    const { value } = e.target;
    const valueAsKeys = value.split('.');

    function updateMultiselect(arr, keys) {
      const [key, ...remainingKeys] = keys;
      const index = arr.findIndex((item) => item.key === key);
      const newItems = arr[index].children;

      if (index !== -1 && remainingKeys.length && newItems) {
        updateMultiselect(newItems, remainingKeys);
      } else if (index !== -1) {
        const item = arr[index];
        const { isSelected } = item;

        // Updating items by reference
        if (multiselect) {
          item.isSelected = !isSelected;
        } else {
          const updatedIsSelected = isSelected && disableDeselect ? true : !isSelected;
          item.isSelected = updatedIsSelected;
        }
      }
    }

    function updateSingleSelect(arr, keys) {
      const selectedKey = keys[keys.length - 1];

      return arr.map((item) => {
        const { key, isSelected, children } = item;

        const updatedIsSelected = isSelected && disableDeselect ? true : !isSelected;

        const updatedItem = key === selectedKey
          ? {
            ...item,
            isSelected: updatedIsSelected,
          }
          : {
            ...item,
            isSelected: false,
          };

        if (children) {
          updatedItem.children = updateSingleSelect(children, keys);
        }

        return updatedItem;
      });
    }

    if (multiselect) {
      updateMultiselect(items, valueAsKeys);

      this.setState({ items });
    } else {
      const updatedItems = updateSingleSelect(items, valueAsKeys);

      this.setState({ items: updatedItems }, () => inputRef.current.blur());
    }
  }

  handleScrollView() {
    const { containerRef } = this.state;
    const { scrollTop } = containerRef.current;

    const sliceSize = DEFAULT_ITEM_RENDER_COUNT;
    const scrollIncrement = (sliceSize / 1.25) * 41;
    const slices = Math.ceil(scrollTop / scrollIncrement) || 1;
    const renderedItems = slices * sliceSize;

    this.setState({ renderedItems });
  }

  filterItems() {
    const { items, filter } = this.state;

    const lowerCaseFilter = filter.toLowerCase();

    function updateVisible(arr = []) {
      return arr.map((item) => {
        const { value, children } = item;
        const lowerCaseItem = value.toLowerCase();

        const updatedChildren = updateVisible(children);
        const isVisible = lowerCaseItem.includes(lowerCaseFilter);
        const updatedItem = { ...item, isVisible };

        if (children) updatedItem.children = updatedChildren;

        return updatedItem;
      })
        .sort(Autocomplete.valueComparer)
        .sort(Autocomplete.isVisibleComparer);
    }

    const updatedItems = updateVisible(items);

    this.setState({ items: updatedItems }, this.handleScrollView);
  }

  initialize() {
    const { value, list, valid } = this.props;

    function formatItems(items = []) {
      return items.reduce((acc, item) => {
        const { children } = item;

        const isSelected = Array.isArray(value)
          ? value.some((key) => key === item.key)
          : value === item.key;

        const updatedItem = {
          ...item,
          isSelected,
          isVisible: true,
        };

        delete updatedItem.children;

        const hasChildren = children && children.length;

        if (hasChildren) {
          const formattedChildren = formatItems(children);
          const childrenItems = formattedChildren;

          updatedItem.children = childrenItems;
        }

        return [...acc, updatedItem];
      }, []);
    }

    const items = formatItems(list);

    items
      .sort(Autocomplete.valueComparer);

    const isValid = valid === null
      ? (Array.isArray(value) || typeof value === 'string') && !!value.length
      : valid;

    this.setState({ items, isValid }, this.renderSelectedPreview);
  }

  renderSelectedPreview() {
    const { items } = this.state;
    const { multiselect } = this.props;
    const selectedItems = Autocomplete.extractSelected(items);

    const value = selectedItems?.[0]?.value || '';
    const filter = multiselect ? `Selected ${selectedItems.length}` : value;

    this.setState({ filter });
  }

  render() {
    const {
      inputRef, containerRef, filter, items, renderedItems, showContainer, isValid,
    } = this.state;
    const {
      autoComplete, label, className, required, disabled,
    } = this.props;

    function getValidity(validity) {
      if (!required || disabled) return '';

      if (validity) return 'is-valid';

      return 'is-invalid';
    }

    return (
      <div
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        className={`autocomplete-component position-relative ${className}`}
      >
        <label className="d-block">
          {label}
          <input
            ref={inputRef}
            onChange={this.handleChange}
            value={filter}
            className={`autocomplete-filter form-control ${getValidity(isValid)}`}
            type="text"
            name="filter"
            autoComplete={autoComplete}
            disabled={disabled}
          />
        </label>
        <ul
          ref={containerRef}
          onScroll={this.handleScrollView}
          tabIndex="-1"
          type="compact"
          className={`autocomplete-item-container ${
            showContainer
              ? 'show'
              : ''
          } position-absolute list-group list-group-flush overflow-auto rounded-start`}
        >
          <Items
            show={showContainer}
            items={items.slice(0, renderedItems)}
            handler={this.handleSelect}
          />
        </ul>
      </div>
    );
  }
}

Autocomplete.propTypes = propTypes;
Autocomplete.defaultProps = defaultProps;

export default Autocomplete;
