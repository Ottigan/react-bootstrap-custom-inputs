import '@testing-library/jest-dom/extend-expect';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '../../middleware/i18nDev';
import ClearButton from './ClearButton';

describe('ClearButton', () => {
  it('should render correctly', () => {
    const handler = jest.fn();
    const isVisible = false;

    const { rerender } = render(<ClearButton handler={handler} isVisible={isVisible} />);
    expect(getComputedStyle(screen.getByTestId('clearButton')).visibility).toMatch('hidden');

    rerender(<ClearButton handler={handler} isVisible />);
    expect(getComputedStyle(screen.getByTestId('clearButton')).visibility).toMatch('visible');
  });

  it('should call handler onClick', () => {
    const handler = jest.fn();
    const isVisible = false;

    render(<ClearButton handler={handler} isVisible={isVisible} />);

    userEvent.click(screen.getByTestId('clearButton'));

    expect(handler).toBeCalledTimes(1);
  });
});
