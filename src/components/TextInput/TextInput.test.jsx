import '@testing-library/jest-dom/extend-expect';
import {
  render, screen, waitFor, act,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from './TextInput';

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});

describe('TextInput', () => {
  it('should render correctly', () => {
    const handler = jest.fn();
    const name = 'test';
    const value = 'my cats name is Kurama';

    render(<TextInput onChange={handler} name={name} value={value} />);

    expect(screen.getByTestId('input').value).toMatch(value);
  });

  it('should call handler with the correct arguments', async () => {
    const name = 'test';
    const handler = jest.fn();
    const value = '';

    act(() => {
      render(<TextInput
        onChange={handler}
        name={name}
        value={value}
      />);
    });

    const input = screen.getByTestId('input');
    const inputText = 'my cats name is Kurama';
    userEvent.type(input, inputText);

    const expectedArgument = {
      target: {
        value: inputText,
        name,
      },
    };

    await waitFor(() => expect(handler).toBeCalledWith(expectedArgument));
  });

  it('should apply the correct validity classes', () => {
    const name = 'test';
    const handler = jest.fn();
    const value = ''; // invalid value

    const { rerender } = render(<TextInput
      onChange={handler}
      name={name}
      value={value}
    />);

    function getClassName() {
      return screen.getByTestId('input').className;
    }

    expect(getClassName()).not.toMatch(/is-valid/);
    expect(getClassName()).not.toMatch(/is-invalid/);

    rerender(<TextInput
      onChange={handler}
      name={name}
      value={value}
      required
    />);

    expect(getClassName()).toMatch(/is-invalid/);

    rerender(<TextInput
      onChange={handler}
      name={name}
      value={value}
      valid
      required
    />);

    expect(getClassName()).toMatch(/is-valid/);

    rerender(<TextInput
      onChange={handler}
      name={name}
      value={value}
      valid
      required
      disabled
    />);

    expect(getClassName()).not.toMatch(/is-valid/);
    expect(getClassName()).not.toMatch(/is-invalid/);
  });
});
