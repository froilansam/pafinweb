import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { useDashboardPresenter } from "../../dashboard.presenter";
import { useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";

const DialogComponent = () => {
  const { deleteUser, handleClose, open } = useDashboardPresenter();
  const navigate = useNavigate();

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Delete Account</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure to delete your account?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={async () => {
            const success = await deleteUser();

            if (success) {
              navigate("/?deleted=true");
            }
          }}
          autoFocus
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default observer(DialogComponent);
