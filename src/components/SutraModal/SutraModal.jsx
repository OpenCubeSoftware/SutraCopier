import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {useState} from 'react';
import PropTypes from "prop-types";

const SutraModal = ({isOpen, handleOk, prevIndex, sutraTitle}) => {
  const [open, setOpen] = useState(isOpen);

  const handleCancel = () => {
    setOpen(false);
  }

  const onOk = () => {
    handleOk();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>Resume Progress?</DialogTitle>
      <DialogContent><DialogContentText>
        Resume copying the {sutraTitle} from {prevIndex + 1}?
      </DialogContentText></DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>No</Button>
        <Button onClick={onOk}>Yes</Button>
      </DialogActions>
    </Dialog>
  )

}

SutraModal.propTypes = {
  handleOk: PropTypes.func,
}

export default SutraModal;