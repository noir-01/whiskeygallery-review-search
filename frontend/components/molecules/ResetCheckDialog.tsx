import { Button, Dialog, DialogActions, DialogContent } from "@mui/material";

import { ResetCheckDialogProps } from "@/types/review";

const ResetCheckDialog = ({
  open,
  onClose,
  onClick,
}: ResetCheckDialogProps) => (
  <Dialog
    open={open}
    onKeyDown={(e) => {
      if (e.key == "Escape") onClose();
      else if (e.key == "Enter") onClick();
    }}
    onBackdropClick={onClose}
  >
    <DialogContent sx={{ fontWeight: 700 }}>
      정말로 리셋하시겠습니까?
    </DialogContent>
    <DialogActions
      sx={{
        button: {
          color: "#755139",
          ":hover": { bgcolor: "transperent" },
        },
      }}
    >
      <Button onClick={onClose}>취소</Button>
      <Button onClick={onClick}>확인</Button>
    </DialogActions>
  </Dialog>
);

export default ResetCheckDialog;
