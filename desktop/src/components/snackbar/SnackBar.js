import React from 'react';
import Typography from '@material-ui/core/Typography';
import { SnackbarContent } from '@material-ui/core';
import Snackbar from '@material-ui/core/Snackbar';
import Palette from '../../constants/palette.json'

// export default function SimpleSnackbar({ open, setOpen, contents }) {

// 	const handleClose = (event, reason) => {
// 		if (reason === 'clickaway') {
// 			return;
// 		}
// 		setOpen(false);
// 	}
// 	return (
// 		<div>
// 			<Snackbar
// 				anchorOrigin={{
// 					vertical: 'top',
// 					horizontal: 'center',
// 				}}
// 				open={open}
// 				autoHideDuration={3000}
// 				onClose={handleClose}
// 			>
// 				<SnackbarContent
// 					message={
// 						contents.length === 0 ? <Typography variant='h6'>Update sucessfully!!!</Typography> :
// 							contents.map((content, i) => <Typography style={{ fontSize: '18px' }} key={i} variant='h6'>{content.msg}</Typography>)
// 					}
// 					style={{ alignContent: "center", backgroundColor: `${contents.length === 0 ? "green" : "red"}` }}
// 				/>
// 			</Snackbar>
// 		</div>
// 	);
// }

export default function InformationSnackbar({ open, setOpen, content }) {

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  }
  return (
    <div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <SnackbarContent
          message={<Typography>{content}</Typography>}
          style={{ alignContent: "center", backgroundColor: Palette.secondary }}
        />
      </Snackbar>
    </div>
  );
}

