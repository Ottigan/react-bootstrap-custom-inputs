/* eslint-disable no-unused-vars */
import { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import MasterSelect from './components/MasterSelect';
import ClearButton from './components/ClearButton';
import Items from './components/Items';
import './styles.scss';

const DEFAULT_ITEM_RENDER_COUNT = 50;

const propTypes = {
  t: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  list: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    title: PropTypes.string,
    children: PropTypes.arrayOf(PropTypes.shape()),
    sort: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
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
  label: '',
  value: '',
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
    return a.value.localeCompare(b.value);
  }

  static isImportantComparer(a, b) {
    if (a.isImportant === b.isImportant) return 0;

    if (a.isImportant) return -1;

    return 1;
  }

  static isSelectedComparer(a, b) {
    if (a.isSelected === b.isSelected) return 0;

    if (a.isSelected) return -1;

    return 1;
  }

  static isVisibleComparer(a, b) {
    if (a.isVisible === b.isVisible) return 0;

    if (a.isVisible) return -1;

    return 1;
  }

  static customComparer(a, b) {
    if (a.sort && b.sort) {
      if (typeof a.sort === 'string' && typeof b.sort === 'string') {
        return (
          a.sort.localeCompare(b.sort)
        );
      }

      return a.sort - b.sort;
    }

    return 0;
  }

  static extractSelected(items = []) {
    return items.flatMap((item) => {
      const { children, isSelected } = item;

      return isSelected
        ? [item, ...Autocomplete.extractSelected(children)]
        : Autocomplete.extractSelected(children);
    });
  }

  static updateItems(arr, isSelected) {
    return arr.map((item) => {
      const { children } = item;

      const updatedItem = {
        ...item,
        isSelected,
      };

      if (children) {
        updatedItem.children = Autocomplete.updateItems(children, isSelected);
      }

      return updatedItem;
    });
  }

  constructor(props) {
    super(props);

    this.state = {
      inputRef: createRef(),
      containerRef: createRef(),
      areAllSelected: false,
      items: [],
      renderedItems: DEFAULT_ITEM_RENDER_COUNT,
      filter: '',
      showContainer: false,
      isValid: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleClear = this.handleClear.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleScrollView = this.handleScrollView.bind(this);
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
    const { name, value } = e.target;

    this.setState({
      [name]: value,
    }, () => this.filterItems());
  }

  handleSelect(e) {
    const { inputRef, items } = this.state;
    const { multiselect, disableDeselect } = this.props;
    const { name, value } = e.target;
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
        item.isSelected = !isSelected;
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
      if (name === 'masterSelect') {
        this.setState({
          areAllSelected: true,
          items: Autocomplete.updateItems(items, true),
        });
      } else {
        updateMultiselect(items, valueAsKeys);

        this.setState({ items });
      }
    } else {
      const updatedItems = updateSingleSelect(items, valueAsKeys);

      this.setState({ items: updatedItems }, () => {
        // Hack for blur() to work in Firefox
        inputRef.current.focus();
        inputRef.current.blur();
      });
    }
  }

  handleClear() {
    const { items, showContainer } = this.state;

    this.setState({
      items: Autocomplete.updateItems(items, false),
    }, () => this.updateParent(showContainer));
  }

  handleFocus(e) {
    const { items, showContainer } = this.state;
    const { name } = e.target;

    if (name === 'filter' && !showContainer) {
      const refreshedItems = items
        .map((item) => ({ ...item, isVisible: true }))
        .sort(Autocomplete.valueComparer)
        .sort(Autocomplete.isImportantComparer)
        .sort(Autocomplete.isSelectedComparer)
        .sort(Autocomplete.customComparer);

      this.setState({
        items: refreshedItems,
        showContainer: true,
        filter: '',
      });
    }
  }

  handleBlur(e) {
    const { inputRef } = this.state;

    const validClasses = ['autocomplete-reset-btn', 'autocomplete-item-container', 'autocomplete-item'];
    const { relatedTarget } = e;
    const isValid = relatedTarget
      ? validClasses.some((className) => relatedTarget.classList.contains(className))
      : false;

    if (isValid) {
      inputRef.current.focus();
    } else {
      this.updateParent(false);
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

  updateParent(showContainer) {
    const { items } = this.state;

    const {
      onChange,
      name,
      multiselect,
      valid,
    } = this.props;

    const selectedItems = Autocomplete.extractSelected(items);
    const isValid = valid === null ? !!selectedItems.length : valid;
    const selectedKeys = selectedItems.map((item) => item.key);
    const value = multiselect ? selectedKeys : selectedKeys?.[0];

    this.setState({ showContainer, isValid }, () => {
      this.renderSelectedPreview();
      onChange({ target: { name, value } });
    });
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
        .sort(Autocomplete.isVisibleComparer)
        .sort(Autocomplete.customComparer);
    }

    const updatedItems = updateVisible(items);

    this.setState({ items: updatedItems }, this.handleScrollView);
  }

  initialize() {
    const { value, list, valid } = this.props;
    let areAllSelected = true;

    function formatItems(items = []) {
      return items.reduce((acc, item) => {
        const { children } = item;

        const isSelected = Array.isArray(value)
          ? value.some((key) => key === item.key)
          : value === item.key;

        if (!isSelected) areAllSelected = false;

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

    items.sort(Autocomplete.valueComparer)
      .sort(Autocomplete.isImportantComparer)
      .sort(Autocomplete.customComparer);

    const isValid = valid === null
      ? (Array.isArray(value) || typeof value === 'string') && !!value.length
      : valid;

    this.setState({
      items, isValid, areAllSelected,
    }, this.renderSelectedPreview);
  }

  renderSelectedPreview() {
    const { items, showContainer } = this.state;

    if (!showContainer) {
      const { t, multiselect } = this.props;
      const selectedItems = Autocomplete.extractSelected(items);

      const value = selectedItems?.[0]?.value || '';
      const filter = multiselect
        ? t('components.autocomplete.multiselect', { count: selectedItems.length })
        : value;

      this.setState({ filter });
    }
  }

  render() {
    const {
      inputRef,
      containerRef,
      filter,
      areAllSelected,
      items,
      renderedItems,
      showContainer,
      isValid,
    } = this.state;

    const {
      autoComplete,
      label,
      className,
      multiselect,
      required,
      disabled,
      disableDeselect,
    } = this.props;

    function getValidity(validity) {
      if (!required || disabled) return '';

      if (validity) return 'is-valid';

      return 'is-invalid';
    }

    return (
      <div
        onFocus={this.handleFocus}
        className={`autocomplete-component position-relative ${className}`}
      >
        <label className={`autocomplete-label d-block w-100 ${required ? 'required' : ''}`}>
          {label}
          <input
            ref={inputRef}
            onChange={this.handleChange}
            onBlur={this.handleBlur}
            value={filter}
            className={`autocomplete-filter form-control ${getValidity(isValid)}`}
            type="text"
            name="filter"
            autoComplete={autoComplete}
            disabled={disabled}
            data-testid="input"
          />
          <ClearButton
            handler={this.handleClear}
            multiselect={multiselect}
            items={items}
            disableDeselect={disableDeselect}
          />
        </label>
        <ul
          ref={containerRef}
          onScroll={this.handleScrollView}
          tabIndex="-1"
          type="compact"
          className={`autocomplete-item-container position-absolute list-group list-group-flush overflow-auto rounded-start ${
            showContainer
              ? 'show'
              : ''
          }`}
        >
          <MasterSelect
            items={items}
            show={showContainer}
            handler={this.handleSelect}
            multiselect={multiselect}
            areAllSelected={areAllSelected}
          />
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

export default withTranslation()(Autocomplete);
