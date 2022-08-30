import '@testing-library/jest-dom/extend-expect';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TextInput from './TextInput';

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

    const { unmount } = render(<TextInput
      onChange={handler}
      name={name}
      value={value}
    />);

    const input = screen.getByTestId('input');
    const inputText = 'my cats name is Kurama';

    const expectedArgument = {
      target: {
        value: inputText,
        name,
      },
    };

    userEvent.type(input, inputText);
    await waitFor(() => expect(handler).toBeCalledWith(expectedArgument));

    unmount();
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

  it('should update value if prop.value changes externally', async () => {
    const handler = jest.fn();
    const name = 'test';
    const value = 'foo';

    const { rerender } = render(<TextInput onChange={handler} name={name} value={value} />);
    expect(screen.getByTestId('input').value).toMatch(value);

    const newValue = 'bar';

    handler.mockReset();
    rerender(<TextInput onChange={handler} name={name} value={newValue} />);
    await waitFor(() => expect(handler).toBeCalledWith({ target: { name, value: newValue } }));
    expect(screen.getByTestId('input').value).toMatch(newValue);

    const noValue = '';

    handler.mockReset();
    rerender(<TextInput onChange={handler} name={name} value={noValue} />);
    await waitFor(() => expect(handler).toBeCalledWith({ target: { name, value: noValue } }));
    expect(screen.getByTestId('input').value).toMatch(noValue);
  });
});
