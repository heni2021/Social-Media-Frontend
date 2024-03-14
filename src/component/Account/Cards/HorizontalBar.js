import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider } from '@mui/material';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function HorizontalBar(props) {
    const { updateDetails, deleteConfimation, loggedOut } = props;
    const { direction } = useTheme();
    const ref = React.useRef(null);
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const update = (e) => {
        ref.current.click();
        updateDetails();
    }

    const deleteAccount = (e) => {
        ref.current.click();
        deleteConfimation();
    }

    const loggedout = (e) => {
        ref.current.click();
        loggedOut();
    }

    const handleOverlayClick = () => {
        setOpen(false);
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <CssBaseline />
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, visibility: open ? 'hidden' : 'visible', top: -60, right: 10 }}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                variant="persistent"
                anchor="left"
                open={open}
            >
                <DrawerHeader>
                    <IconButton ref={ref} onClick={handleDrawerClose}>
                        {direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                <List>
                    <ListItem key="Update Details" disablePadding>
                        <ListItemButton onClick={update}>
                            <ListItemIcon >
                                <EditRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Update Details" />
                        </ListItemButton>
                    </ListItem>
                    <ListItem key="Delete Account" disablePadding>
                        <ListItemButton onClick={deleteAccount}>
                            <ListItemIcon >
                                <DeleteRoundedIcon />
                            </ListItemIcon>
                            <ListItemText primary="Delete Account" />
                        </ListItemButton>
                    </ListItem>
                </List>
                <Divider />
                <List>
                    <ListItem key="Log Out" disablePadding>
                        <ListItemButton onClick={loggedout}>
                            <ListItemIcon>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText primary="Log Out" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Drawer>
            {open && (
                <div
                    onClick={handleOverlayClick}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 1,
                    }}
                />
            )}
        </Box>
    );
}
