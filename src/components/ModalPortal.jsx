import { createPortal } from 'react-dom';

/**
 * Renders its children into document.body instead of in-place.
 *
 * Why this exists: any ancestor using `backdrop-blur`, `filter`,
 * `transform`, or `perspective` (e.g. our `backdrop-blur-sm` cards)
 * creates a new CSS containing block. That silently breaks
 * `position: fixed` on any modal rendered underneath it — the modal
 * ends up covering that ancestor card instead of the full viewport.
 *
 * Wrap every modal's root element in <ModalPortal> to guarantee it
 * always escapes to <body> and covers the whole screen, regardless
 * of how deeply nested the trigger button is.
 */
const ModalPortal = ({ children }) => {
  return createPortal(children, document.body);
};

export default ModalPortal;