import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../middleware/i18nDev';
import DatePicker from './DatePicker';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('DatePicker', () => {
  it('should render correctly', () => {
    const handler = jest.fn();
    const name = 'test';
    const value = '2022-07-27';
    const result = '27.07.2022';

    render(<DatePicker
      onChange={handler}
      value={value}
      name={name}
    />);

    expect(screen.getByTestId('input').value).toMatch(result);
  });

  it('should highlight a date', () => {
    const handler = jest.fn();
    const name = 'test';
    const value = '2022-07-27';
    const highlightDate = '2022-07-28';
    const highlightColor = '#00000044';

    render(<DatePicker
      onChange={handler}
      value={value}
      name={name}
      highlightDate={highlightDate}
      highlightColor={highlightColor}
    />);

    userEvent.click(screen.getByTestId('input'));

    expect(screen.getByTestId(highlightDate)).toHaveStyle({ 'background-color': highlightColor });
  });

  it('should update validity classes', () => {
    const handler = jest.fn();
    const name = 'test';
    const value = '2022-07-27';

    const { rerender } = render(<DatePicker
      onChange={handler}
      value={value}
      name={name}
      required
    />);

    expect(screen.getByTestId('input')).toHaveClass('is-valid');

    rerender(<DatePicker
      onChange={handler}
      value={value}
      name={name}
      required
      valid={false}
    />);

    expect(screen.getByTestId('input')).not.toHaveClass('is-valid');
    expect(screen.getByTestId('input')).toHaveClass('is-invalid');

    rerender(<DatePicker
      onChange={handler}
      value={value}
      name={name}
      valid={false}
    />);

    expect(screen.getByTestId('input')).not.toHaveClass('is-valid');
    expect(screen.getByTestId('input')).not.toHaveClass('is-invalid');
  });
});
