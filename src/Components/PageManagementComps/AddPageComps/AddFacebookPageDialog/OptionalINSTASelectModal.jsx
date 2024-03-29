import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Form from 'react-bootstrap/Form';
import { AppContext } from '../../../../context/Context';
import * as variables from '../../../../variables/variables';
import { ToastContainer, toast } from 'react-toastify';
import Slide from '@mui/material/Slide';
import NoteAddIcon from '@mui/icons-material/NoteAdd';
import CancelIcon from '@mui/icons-material/Cancel';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PagesDialog(props) {
  const { GlobalState, Dispatch } = React.useContext(AppContext);

  const [pages, setPages] = useState(props.FBINPages);

  const handlePreviousClose = () => {
    props.SetSelectFBPageModalFlag(false);
  };

  const handleClose = () => {
    variables.Pages.FBINGSelectedOptionalPagesList = [];
    props.handleAddINPages();
    props.SetShowFBINChoiceModal(false);
    handlePreviousClose();
  };

  const HandleCancel = () => {
    variables.Pages.FBINGSelectedOptionalPagesList = [];
    variables.Pages.FBSelectPagesList = [];
    variables.Pages.FBSelectedPagesList = [];
    props.SetShowFBINChoiceModal(false);
    handlePreviousClose();
  };
  const handleAddPage = () => {
    //This function make a call to add the IN and FB page in case there is optional FB, otherwise the previous modal does.
    //Here we prepare the list of selected optional FB pages
    variables.Pages.FBINGSelectedOptionalPagesList = [];
    pages.map((Page) => {
      var checkbox = document.getElementById('FBINOptionalPage' + Page.id);

      if (checkbox.checked) {
        variables.Pages.FBINGSelectedOptionalPagesList = [
          ...variables.Pages.FBINGSelectedOptionalPagesList,
          Page,
        ];
      }
    });
    if (variables.Pages.FBINGSelectedOptionalPagesList.length > 0) {
      props.handleAddINPages();
      props.SetShowFBINChoiceModal(false);
      handlePreviousClose();
    } else {
      toast.info('You need to select at least one page', {
        position: 'bottom-left',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      });
    }
  };

  return (
    <>
      <Dialog
        open={true}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        disableBackdropClick
        disableEscapeKeyDown
        PaperProps={{
          style: {
            position: 'absolute',
            margin: '30px auto',
            minWidth: '300px',
            bottom: '-0.5rem',
          },
        }}
      >
        <DialogTitle id="alert-dialog-title">
          Optional Instagram Pages Add
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="m-2" id="alert-dialog-description">
            The Selected Facebook Pages are linked to these Instagram accounts,
            would you like to add them as well and have them associated to each
            other?
            <br></br>
            <strong>
              Note: The Association between the pages is not gonna modify
              anything, it&apos;s just logical and for you to know which Instagram
              page is related to which Facebook Page.
            </strong>
          </DialogContentText>

          {pages.map((Page, index) => {
            return (
              <Form.Check
                id={'FBINOptionalPage' + Page.id}
                key={'FBINOptionalPage' + Page.id}
                type="switch"
                defaultChecked={false}
                autoComplete="off"
                autoSave="off"
                label={
                  <>
                    <strong>{Page.instagram_business_account.username}</strong>
                    {' Associated to '}
                    <strong>{Page.name}</strong>
                  </>
                }
              />
            );
          })}
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            startIcon={<HighlightOffIcon />}
            color="info"
            onClick={HandleCancel}
          >
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<CancelIcon />}
            color="warning"
            onClick={handleClose}
          >
            No
          </Button>
          <Button
            variant="outlined"
            startIcon={<NoteAddIcon />}
            color="warning"
            onClick={handleAddPage}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
