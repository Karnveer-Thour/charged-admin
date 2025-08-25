import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material"
import { Reward } from "../../../types";

interface DeleteRewardDialogProps{
    isDeleteRewardDialogOpened:boolean;
    SelectedRewardToDelete:Reward;
    setIsDeleteRewardDialogOpened:React.Dispatch<React.SetStateAction<boolean>>
    setSelectedRewardToDelete:React.Dispatch<React.SetStateAction<Reward|undefined>>
}

const DeleteRewardDialog = ({isDeleteRewardDialogOpened,SelectedRewardToDelete,setIsDeleteRewardDialogOpened,setSelectedRewardToDelete}:DeleteRewardDialogProps) => {
    const handleCloseDeleteRewardDialog=()=>{
        setIsDeleteRewardDialogOpened(false);
        setSelectedRewardToDelete(undefined);
    }
    const handleDeleteReward=()=>{

    }
  return (
    <Dialog open={isDeleteRewardDialogOpened} onClose={handleCloseDeleteRewardDialog} maxWidth="sm" fullWidth>
      <DialogTitle>Delete Reward</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Do you really want to delete {SelectedRewardToDelete?.title} reward?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteRewardDialog} color="inherit">
          Close
        </Button>
        <Button onClick={handleDeleteReward} color="error" variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteRewardDialog