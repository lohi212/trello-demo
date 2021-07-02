import React from "react";
import "./modal.css";
import { createPortal } from "react-dom";

function Modal({ children, onModalClose }) {
  // const [showModal,setShowModal] = useState(showModal);

  return (
    <>
        <div className="modal">
          <div className="modal-container">
              <span className="close" onClick={onModalClose}>&#x2715;</span>
              {children}
          </div>
        </div>
    </>
  );
}

function Portal({ showModal, children, onModalClose }) {
  const element = document.body;
  if(!showModal) {
    return null;
  }
  return createPortal(<Modal onModalClose={onModalClose}>{children}</Modal>,element);

}

export default Portal;
