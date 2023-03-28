import React, { FC } from 'react';

import { StyledButton } from './styles';

interface ICopyToClipboardButton {
  text?: string;
}

export const CopyToClipboardButton: FC<ICopyToClipboardButton> = ({
  text = '',
  ...rest
}) => {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      alert(
        'Failed to copy to clipboard, please check your browser permissions.'
      );
    }
  };

  return (
    <>
      <StyledButton
        title={'Copy to clipboard'}
        onClick={handleCopyToClipboard}
        {...rest}
      >
        {/* <Icon>{IconsStringsEnum.copy}</Icon> */}
      </StyledButton>
    </>
  );
};
