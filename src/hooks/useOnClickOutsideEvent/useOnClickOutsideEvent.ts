import { useEffect, useRef } from 'react';

/**
 * Used to register and control click outside of the modal
 * (or dropdown) wrapper. Runs `onClickOutside` parameter when user click
 * outside the element with REF.
 * 
 * Example: 
   const { elementRef } = useOnClickOutsideEvent({
    onClickOutside: () => setShowDropdown(false),
    isVisible: showDropdownOptions,
  })
  <ModalOrDropdownWrapper ref={elementRef}>
    ...
  </ModalOrDropdownWrapper>
 */
export const useOnClickOutsideEvent = ({
  onClickOutside,
  isVisible = false,
}: {
  /** This function must be MEMORIZED with useCallback (if needs) */
  onClickOutside: () => void;
  isVisible: boolean;
}) => {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!onClickOutside) return;

    // this is the one of the good ways to verify if the click was
    // outside of the modal wrapper and run onClose event.
    function handleClickOutside(event: MouseEvent) {
      if (isVisible && !elementRef?.current?.contains(event.target as Node))
        onClickOutside();
    }
    document.addEventListener('mousedown', handleClickOutside);

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isVisible, elementRef, onClickOutside]);

  return { elementRef };
};
