import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { observer } from "mobx-react-lite";
import { useDashboardPresenter } from "./dashboard.presenter";
import { Button, Grid, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useNavigate } from "react-router-dom";
import AppBarComponent from "./components/appbar";
import DialogComponent from "./components/dialog";

function Dashboard() {
  const {
    name,
    email,
    getUser,
    isEditing,
    setIsEditing,
    handleClickOpen,
    setValue,
    editUser,
    errors,
  } = useDashboardPresenter();
  const navigate = useNavigate();

  React.useEffect(() => {
    navigate("/");
    getUser();
  }, []);

  return (
    <>
      <AppBarComponent />
      <Box
        component="form"
        style={{ padding: 20 }}
        noValidate
        autoComplete="off"
      >
        <Typography variant="h3">User Information</Typography>
        <Tooltip title="Delete">
          <IconButton onClick={handleClickOpen}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        {!isEditing && (
          <Tooltip title="Delete">
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
        )}
        <TextField
          margin="normal"
          disabled={!isEditing}
          required
          fullWidth
          name="name"
          label="Name"
          type="name"
          id="name"
          autoComplete="name"
          value={name}
          onChange={(event) => {
            setValue("name", event.target.value);
          }}
          error={errors.name !== ""}
          helperText={errors.name}
        />
        <TextField
          margin="normal"
          disabled={!isEditing}
          required
          fullWidth
          id="email"
          label="Email Address"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(event) => {
            setValue("email", event.target.value);
          }}
          error={errors.email !== ""}
          helperText={errors.email}
        />
        {isEditing && (
          <>
            <TextField
              margin="normal"
              required
              fullWidth
              name="current password"
              label="Current Password"
              type="password"
              id="current-password"
              autoComplete="current-password"
              error={!!errors.password.length}
              onChange={(event) => {
                setValue("currentPassword", event.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="new password"
              label="New Password"
              type="password"
              id="new-password"
              autoComplete="new-password"
              error={!!errors.password.length}
              onChange={(event) => {
                setValue("newPassword", event.target.value);
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirm password"
              label="Confirm Password"
              type="password"
              id="confirm-password"
              autoComplete="confirm-password"
              error={!!errors.password.length}
              onChange={(event) => {
                setValue("confirmPassword", event.target.value);
              }}
            />

            <Grid item xs={12} style={{ marginLeft: 20, marginBottom: 20 }}>
              {errors.password?.map((error) => (
                <Grid item xs={12}>
                  <Typography variant="caption" color="rgb(194,63,56)">
                    {error}
                  </Typography>
                </Grid>
              ))}
            </Grid>

            <Button
              variant="contained"
              endIcon={<SaveIcon />}
              onClick={async () => {
                await editUser();
              }}
            >
              Save
            </Button>
          </>
        )}
      </Box>
      <DialogComponent />
    </>
  );
}
export default observer(Dashboard);
