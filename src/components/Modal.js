import React, {useState} from "react";
import "./Modal.css"

const Modal = (props) => {
  const [modalOpened, setModalOpened] = useState(false);

  const coverClass = modalOpened ? 'modal-cover modal-cover-active' : 'modal-cover'
  const containerClass = modalOpened ? 'modal-container modal-container-active' : 'modal-container'
  return (
    <div>
      <button className='btn' onClick={() => setModalOpened(!modalOpened)}>+</button>

      <div className={containerClass}>
        <div className="modal-header">
          <button className='close-btn' onClick={() => setModalOpened(!modalOpened)}>X</button>
        </div>
        <div className='modal-body'>{props.children}</div>
      </div>

      <div className={coverClass} onClick={() => setModalOpened(!modalOpened)}></div>
    </div>
  )
}

export default Modal;
