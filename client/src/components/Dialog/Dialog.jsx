import React from "react";
import ReactDom from "react-dom";
import CloseIcon from "@mui/icons-material/Close";

import "./dialog.css";

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return ReactDom.createPortal(
    <>
      <div className="modal_overlay_container" onClick={() => onClose(false)} />
      <div className="modal_style">{children}</div>
      <div
        // style={{
        //   width: "100%",
        //   display: "flex",
        //   justifyContent: "center",
        //   position: "relative",
        // }}
        className="modal_close_container"
      >
        <div onClick={() => onClose(false)}>
          <CloseIcon />
        </div>
      </div>
    </>,
    document.getElementById("dialog")
  );
}

export default Modal;
