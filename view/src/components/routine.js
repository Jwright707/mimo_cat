import React, { Component } from 'react'

import withStyles from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';


import CardHeader from '@material-ui/core/CardActions';
import { Card, CardActions, CardContent, Divider, Grid, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';

import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import LaunchIcon from '@material-ui/icons/Launch';

import MenuItem from '@material-ui/core/MenuItem';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import Slide from '@material-ui/core/Slide';

import axios from 'axios';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { authMiddleWare } from '../util/auth';
import media from './media';

const styles = ((theme) => ({
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    toolbar: theme.mixins.toolbar,
    root: {
        flexGrow : 1,
        "& .MuiPaper-root": {
          borderColor: '#FFFFFF'
        }
    },
    floatingButton: {
        position: 'fixed',
        bottom: 0,
        right: 0
    },
    closeButton: {
		position: 'absolute',
		right: theme.spacing(1),
		top: theme.spacing(1),
		color: theme.palette.grey[500]
	},
    table: {
        minWidth: 650,
    },
    hideLastBorder: {
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      },
    })
);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

function fetchAPI(url, param) {
    const authToken = localStorage.getItem('AuthToken');
    let routines = [];

      axios.defaults.headers.common = { Authorization: `${authToken}` };
      axios
        .get(`/routines/${param}`)
        .then((response) => {
          this.setState({
            routines: response.data,
            uiLoading: false
          });
        })
        .catch((err) => {
          console.log(err);
        });

}



class routine extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          routines: [],
          media: [],
          routine_name: '',
          movements: [], 
          created_at: '',
          id: '',
          errors: [], 
          page: 1,
          page_count: 0,
          pageSize: 10,
          open: false,
          uiLoading: true,
          buttonType: '',
          viewOpen: false
        };
    
        this.pageSizes = [3, 6, 9];
    
        this.deleteRoutineHandler = this.deleteRoutineHandler.bind(this);
        this.handleEditClickOpen = this.handleEditClickOpen.bind(this);
        this.handleViewOpen = this.handleViewOpen.bind(this);
    
      }
    
      handleChange = (event) => {
        this.setState({
          [event.target.name]: event.target.value
        });
      };
    
      handleChangePage = (event, newPage) => {
        this.setState({
          [event.target.page]: newPage
        });
        // setPage(newPage);
      };
    
      componentWillMount = () => {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        axios
          .get('/routines')
          .then((response) => {
            this.setState({
              routines: response.data,
              uiLoading: false
            });
          })
          .catch((err) => {
            console.log(err);
          });

      };
    
      deleteRoutineHandler(data) {
        authMiddleWare(this.props.history);
        const authToken = localStorage.getItem('AuthToken');
        axios.defaults.headers.common = { Authorization: `${authToken}` };
        let routineId = data.routines.id;
        axios
          .delete(`routnes/${routineId}`)
          .then(() => {
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
      }
    
      handleEditClickOpen(data) {
        console.log(data.item);
        this.setState({
          active: true,
          id: data.item.routineId,
          routine_name: data.item.name,
          movements: data.item.movements, 
          created_at: data.item.created_at,
          buttonType: 'Edit',
          open: true
        });
      }
    
      handleViewOpen(data) {

        var routineData = [];

        axios.get(`/routines/${data.row.id}`)
            .then((response) => {
                    console.log(response.data[0]);
           
                        this.setState({ 
                                    routines: response.data, 
                                    id: data.row.id,
                                    routine_name: data.row.name,
                                    num_movements: data.row.num_movements,
                                    movements: response.data[0].movements,
                                    created_at: data.row.created_at,
                                    viewOpen: true
                                })
             });

      }
    

    render() {

    const DialogTitle = withStyles(styles)((props) => {
			const { children, classes, onClose, ...other } = props;
			return (
				<MuiDialogTitle disableTypography className={classes.root} {...other}>
					<Typography variant="h6">{children}</Typography>
					{onClose ? (
						<IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
							<CloseIcon />
						</IconButton>
					) : null}
				</MuiDialogTitle>
			);
		});

		const DialogContent = withStyles((theme) => ({
			viewRoot: {
				padding: theme.spacing(2)
			}
        }))(MuiDialogContent);
        dayjs.extend(relativeTime);
		const { classes } = this.props;
		const { open, errors, viewOpen } = this.state;

		const handleClickOpen = () => {
			this.setState({
                id: '',
                routine_name: '',
                movements: [], 
                created_at: '',
                id: '',
				buttonType: '',
				open: true
			});
		};

		const handleSubmit = (event) => {
			authMiddleWare(this.props.history);
			event.preventDefault();
			const userMedia = {
                id: this.state.media.id,
                active: this.state.media.active,
                created_by: this.state.media.uploade_by,
                media_name: this.state.media_name,
                media_filename: this.state.media_filename,
                media_tags: this.state.media_tags,
                media_category: this.state.category
			};
			let options = {};
			if (this.state.buttonType === 'Edit') {
				options = {
					url: `/routine/${this.state.id}`,
					method: 'put',
					data: userMedia
				};
			} else {
				options = {
					url: '/routine',
					method: 'post',
					data: userMedia
				};
			}
			const authToken = localStorage.getItem('AuthToken');
			axios.defaults.headers.common = { Authorization: `${authToken}` };
			axios(options)
				.then(() => {
					this.setState({ open: false });
					window.location.reload();
				})
				.catch((error) => {
					this.setState({ open: true, errors: error.response.data });
					console.log(error);
				});
		};

		const handleViewClose = () => {
			this.setState({ viewOpen: false });
		};

		const handleClose = (event) => {
			this.setState({ open: false });
		};
        
        return (
            <main className={classes.content}>
            <div className={classes.toolbar} />
            <Card  className={classes.root}>
            <CardHeader>
              <Typography className={classes.locationText} gutterBottom variant="h4">
                Routines
            </Typography>
            </CardHeader>
            <CardContent>
                <div className={classes.progress} />
            </CardContent>
            </Card>
            <br />
            <Card>
            <TableContainer component={Paper}>
                <Table className={classes.table} size="small" aria-label="a dense table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="center">Display Name</TableCell>
                        <TableCell align="center">Length</TableCell>
                        <TableCell align="center">Created</TableCell>
                        <TableCell align="center"> </TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.routines.map((row) => (
                        <TableRow key={row.name} className={classes.hideLastBorder}>
                        <TableCell component="th" scope="row">
                            {row.id}
                        </TableCell>
                        <TableCell align="center">{row.name}</TableCell>
                        <TableCell align="center">{row.num_movements}</TableCell>                        
                        <TableCell align="center">{dayjs(row.created_at).fromNow()}</TableCell>
                        <TableCell align="center">
                            <Button size="small" color="secondary" onClick={() => this.handleViewOpen({ row })}>
                                {' '}
                                View{' '}
                            </Button>
                            <Button size="small" color="secondary" disabled onClick={() => this.handleEditOpen({ row })}>
                                {' '}
                                Edit{' '}
                            </Button>
                        </TableCell>
                        
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </Card>

            <IconButton
            className={classes.floatingButton}
            color="primary"
            aria-label="Add Media"
            onClick={handleClickOpen}
          >
            <AddCircleIcon style={{ fontSize: 60 }} />
          </IconButton>

            <Dialog
                onClose={handleViewClose}
                aria-labelledby="customized-dialog-title"
                open={viewOpen}
                fullWidth
                classes={{ paperFullWidth: classes.dialogStyle }}
            >
                <DialogTitle id="customized-dialog-title" onClose={handleViewClose}>
                    {this.state.routine_name}
                </DialogTitle>
                <DialogContent dividers>
                <CardMedia
                    component="img"
                    className={classes.media}
                    title={this.state.name} 
                />
                
                
                <div className={classes.media_tags}>
                    This routine contains {this.state.num_movements} movements, created {dayjs(this.state.created_at).fromNow()}
                </div>
                
                <br />

                {this.state.movements.map((move) => (

                    <Typography className={classes.pos} color="textSecondary">
                    <Link href={`https://storage.googleapis.com/mimo-cat-f82c7/movement/${move.medie_filename}`} variant="body2">
                        {move.media_name} <LaunchIcon fontSize="small" />
                    </Link>
                    </Typography>
                ))}
                {/* .map((move) => (
                      <Link href="#" variant="body2">
                        {move.media_name} {' '}
                      </Link>
                    )) */}
                                
                </DialogContent>
            </Dialog>
            
            <Dialog open={open} onClose={handleClose} TransitionComponent={Transition}  aria-labelledby="edit-media-dialog">
          <DialogTitle id="edit-dialog-title">
            <Typography variant="h6" className={classes.title}>
              {this.state.buttonType === 'Edit' ? 'Edit Routine' : 'Create a new Routine'}
            </Typography>
          </DialogTitle>
          <Divider />
          <DialogContent>
            <DialogContentText>
              Instructions for the form can go here.
            </DialogContentText>


            <form className={classes.form} noValidate>
            <TextField
                variant="standard"
                disabled
                fullWidth
                id="media_id"
                label="Id"
                name="media_id"
                autoComplete="mediaId"
                helperText={errors.media_id}
                placeholder="system generated"
                value={this.state.media_id}
                error={errors.media_id ? true : false}
                onChange={this.handleChange}
                margin="normal"
              />

              <TextField
                variant="outlined"
                required
                fullWidth
                id="media_name"
                label="Display Name"
                name="media_name"
                autoComplete="mediaName"
                helperText={errors.media_name}
                value={this.state.media_name}
                error={errors.media_name ? true : false}
                onChange={this.handleChange}
                margin="normal"
              />

              <TextField
                variant="outlined"
                required
                fullWidth
                id="media_filename"
                label="Movements"
                name="media_filename"
                autoComplete="mediaFileName"
                helperText={errors.media_filename}
                error={errors.media_filename ? true : false}
                onChange={this.handleChange}
                value={this.state.media_filename}
                helperText="Movement ID's separated by tags"
                margin="normal"
              />

            </form>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button
                  autoFocus
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  {this.state.buttonType === 'Edit' ? 'Save' : 'Submit'}
                </Button>
            </DialogActions>
          </Dialog>

            </main>
        )
    }
}

export default (withStyles(styles)(routine));