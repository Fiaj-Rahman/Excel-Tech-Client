import { Label } from "@mui/icons-material";
import React, { useState } from "react";

const ForgetPassword = () => {
  const [open, setOpen] = useState(false);

  const handleModalToggle = () => {
    setOpen(!open);
  };

  return (
    <div>
      <Label className="label">
        <a onClick={handleModalToggle} className="label-text-alt link link-hover">
          Forget Password
        </a>
      </Label>
      {open && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">Press ESC key or click outside to close</p>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button type="button" onClick={handleModalToggle}>
              Close
            </button>
          </form>
        </dialog>
      )}
    </div>
  );
};

export default ForgetPassword;
