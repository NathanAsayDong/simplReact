import { FC } from "react";
import "./ConfirmModal.scss";

interface ConfirmModalProps {
  prompt: string;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmModal: FC<ConfirmModalProps> = ({ prompt, onCancel, onConfirm }) => {
  return (
    <div className="confirm-modal">
        <h3 className="modal-prompt">{prompt}</h3>
        <div className="modal-buttons">
            <button className="cancel-button" onClick={onCancel}>
                Cancel
            </button>
            <button className="confirm-button special-background" onClick={onConfirm}>
                Confirm
            </button>
        </div>
    </div>
  );
};

export default ConfirmModal;