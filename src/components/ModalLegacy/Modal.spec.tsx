import React from 'react';
import ReactDOM from 'react-dom';
import { screen, render, fireEvent } from '@/tests';
import { Modal } from '.';

describe(':: Modal', () => {
  it('Should not render the component', () => {
    const node = document.createElement('div');
    document.body.appendChild(node);

    ReactDOM.render(<Modal isVisible={false}>valid-text</Modal>, node);

    expect(node.childElementCount).toBe(0);
  });

  it('Should render the component', () => {
    const { getByTestId } = render(<Modal isVisible={true}>valid-text</Modal>);
    expect(getByTestId('modal-backdrop')).toBeTruthy();
    expect(getByTestId('modal-wrapper')).toBeTruthy();
  });
  it('Should render the component with multiple children', () => {
    const { getByTestId, getAllByText } = render(
      <Modal isVisible={true}>
        <div>valid-text</div>
        <div>valid-text</div>
        <div>valid-text</div>
      </Modal>
    );
    expect(getByTestId('modal-backdrop')).toBeTruthy();
    expect(getByTestId('modal-wrapper')).toBeTruthy();
    expect(getAllByText('valid-text')).toHaveLength(3);
  });

  it('Should not call onClose when clicking in modal', () => {
    const onClose = jest.fn();
    const { getByTestId } = render(
      <Modal isVisible={true} onClose={onClose}>
        <div>valid-text</div>
      </Modal>
    );
    const modalWrapper = getByTestId('modal-wrapper');
    expect(modalWrapper).toBeTruthy();

    fireEvent.click(modalWrapper);
    expect(onClose).toBeCalledTimes(0);
  });

  it('Should call onClose when clicking in modal backdrop or outside modal', () => {
    const onClose = jest.fn();
    render(
      <Modal isVisible={true} onClose={onClose}>
        <div>valid-text</div>
      </Modal>
    );
    const modalBackdrop = screen.getByTestId('modal-backdrop');
    expect(modalBackdrop).toBeTruthy();

    fireEvent.mouseDown(modalBackdrop);
    expect(onClose).toBeCalled();
  });
});
