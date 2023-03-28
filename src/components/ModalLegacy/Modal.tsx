import React from 'react';

import { ModalProps } from './interfaces';
import { ModalBackdrop, ModalStyled } from './styles';
import { FCC } from '../../models';
import { useOnClickOutsideEvent } from '../../hooks/useOnClickOutsideEvent';

/**
 * Modal (popup) component
 */
export const Modal: FCC<ModalProps> = ({
  children,
  isVisible,
  onClose,
  ...divProps
}) => {
  const { elementRef } = useOnClickOutsideEvent({
    onClickOutside: onClose,
    isVisible,
  });

  return isVisible ? (
    <ModalBackdrop data-testid="modal-backdrop">
      <ModalStyled data-testid="modal-wrapper" {...divProps} ref={elementRef}>
        {children}
      </ModalStyled>
    </ModalBackdrop>
  ) : null;
};
