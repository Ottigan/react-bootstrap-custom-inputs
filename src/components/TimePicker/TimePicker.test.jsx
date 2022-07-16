import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import TimePicker from './TimePicker';

describe('TimePicker', () => {
  it('should update on parent changes', () => {
    const handler = jest.fn();
    const name = 'test';
    const defaultValue = '--:--';

    const { rerender } = render(<TimePicker onChange={handler} name={name} />);
    expect(screen.getByTestId('input').value).toMatch(defaultValue);

    const updatedValue = '10:00';

    rerender(<TimePicker onChange={handler} name={name} value={updatedValue} />);
    expect(screen.getByTestId('input').value).toMatch(updatedValue);
  });
});
