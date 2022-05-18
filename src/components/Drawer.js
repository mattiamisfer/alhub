import React from 'react';
import clsx from 'clsx';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import {
    MainListItems,
    // secondaryListItems 
} from './listItems';

export default function DrawerComponent({ classes, drawer, open }) {
    return (
        <Drawer
            variant="permanent"
            classes={{
                paper: clsx(classes.drawerPaper, !open && classes.drawerPaperClose),
            }}
            open={open}
        >
            <div className={classes.toolbarIcon}>
                <IconButton onClick={drawer}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />
            <List>
                <MainListItems />
            </List>
        </Drawer>
    )
}
