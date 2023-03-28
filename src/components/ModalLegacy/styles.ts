import styled from 'styled-components'

import {
  ModalHeader,
  ModalContent,
  ModalFooter,
} from '@albatross/react-ui-dialog'

export const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  box-sizing: border-box;
  min-height: 100%;
  max-height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: rgba(68, 68, 68, 0.8);
  backdrop-filter: blur(8px);
  z-index: 100;
  overflow: auto;
`

export const ModalStyled = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05),
    0px 20px 30px rgba(0, 0, 0, 0.07);

  min-width: 320px;
  max-width: 800px;

  > :not(:first-child):not(:last-child) {
    padding-top: 0;
  }

  > ${ModalFooter}:last-child {
    padding-top: 0;
  }

  > ${ModalHeader}:first-child + ${ModalContent}:last-child {
    padding-top: 0;
  }

  > ${ModalContent} + ${ModalContent} {
    padding-top: 0;
  }
`
