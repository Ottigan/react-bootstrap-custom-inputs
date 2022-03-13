import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import Autocomplete from './Autocomplete';

describe('Autocomplete', () => {
  it('should display the correct "list.value" based on provided "value" prop', () => {
    const value = 'key2';
    const list = [
      {
        key: 'key1',
        title: 'title1',
        value: 'value1',
      },
      {
        key: 'key2',
        title: 'title2',
        value: 'value2',
      },
    ];

    render(<Autocomplete
      onChange={() => {}}
      value={value}
      list={list}
      name="test"
      label="test"
    />);

    expect(screen.getByTestId('input').value).toMatch('value2');
  });

  it('should render ClearButton correctly', () => {
    const list = [
      {
        key: 'key1',
        title: 'title1',
        value: 'value1',
      },
    ];

    const { rerender } = render(<Autocomplete
      onChange={() => {}}
      value=""
      list={list}
      name="test"
      label="test"
    />);
    expect(getComputedStyle(screen.getByTestId('clearButton')).visibility).toMatch('hidden');

    rerender(<Autocomplete
      onChange={() => {}}
      value="key1"
      list={list}
      name="test"
      label="test"
    />);
    expect(getComputedStyle(screen.getByTestId('clearButton')).visibility).toMatch('visible');
  });

  it('should show the provided list after "input" is clicked', async () => {
    const list = [
      {
        key: 'key1',
        title: 'title1',
        value: 'value1',
      },
      {
        key: 'key2',
        title: 'title2',
        value: 'value2',
      },
    ];

    render(<Autocomplete
      onChange={() => {}}
      value=""
      list={list}
      name="test"
      label="test"
    />);

    userEvent.click(screen.getByTestId('input'));

    await waitFor(() => { expect(screen.getByText('value1')).toBeInTheDocument(); });
    await waitFor(() => { expect(screen.getByText('value2')).toBeInTheDocument(); });
  });
});
