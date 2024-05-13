import React, {useEffect, useState} from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import {CURRENCY} from "src/data/currency";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import {useFormikContext} from "formik";

const OpportunityCreateBudget = ({unlockedEdit }) => {
    const formik = useFormikContext()
    const [currencyValue, setCurrencyValue] = useState({label:"€", value:"EUR"});
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    useEffect(() => {
        setCurrencyValue({label: formik?.values?.currency})
    }, [formik?.values?.currency])
    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-4 mb-6">
                        <Typography variant="h6">
                            Budget
                        </Typography>
                    </div>
                    <div className="col-span-12 md:col-span-8 grid md:grid-cols-2 gap-6">
                        <Stack
                            spacing={3}
                            alignItems="center"
                            direction="row">
                            <Avatar
                                sx={{
                                    height: 45,
                                    width: 45,
                                    mr: 1
                                }}>
                                <SvgIcon>
                                    <PaymentsOutlinedIcon />
                                </SvgIcon>
                            </Avatar>

                            Price
                        </Stack>
                        <Stack spacing={3}
                               alignItems="center"
                               justifyContent="center"
                               direction="row"
                        >
                            {/*TODO make it so to can't be higher than from*/}
                            <TextField
                                error={!!(formik.touched.priceFrom && formik.errors?.priceFrom)}
                                fullWidth
                                helperText={formik.touched.priceFrom && formik.errors?.priceFrom}
                                label="From"
                                name="price.from"
                                type="text"
                                disabled={!unlockedEdit}
                                onBlur={formik.handleBlur}
                                onChange={e => {
                                    if (!(/^[0-9,]*$/.test(e.target.value))){
                                        return
                                    }else {
                                        const rawValue = e.target.value.replace(/,/g, ''); // Remove commas
                                        formik.setFieldValue("price.from", +rawValue);
                                    }
                                }}
                                value={Number(formik.values.price.from).toLocaleString()}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <IconButton
                                            style={{ fontSize: '18px', padding: '4px' }}
                                            disabled={!unlockedEdit}
                                            onClick={(e)=> {
                                                e.preventDefault()
                                                handleClick(e)
                                            }}
                                        >
                                            {currencyValue?.label}
                                        </IconButton>
                                    </InputAdornment>
                                }}
                            />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom', // Anchor point on the button
                                    horizontal: 'center', // Move the menu to the left
                                }}
                                transformOrigin={{
                                    vertical: 'top', // Position of the menu
                                    horizontal: 'center', // Position of the menu
                                }}
                                open={open}
                                onClose={()=>handleClose()}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                {CURRENCY.map(item=>(
                                    <MenuItem
                                        key={item.value}
                                        value={item.value}
                                        onClick={(e)=>{
                                            handleClose()
                                            formik.setFieldValue("currency", item?.label);
                                        }}
                                    >
                                        {item?.label}
                                    </MenuItem>
                                ))}
                            </Menu>

                            <TextField
                                error={!!(formik.touched.priceTo && formik.errors?.priceTo)}
                                fullWidth
                                // helperText={formik.touched.priceTo && formik.errors?.priceTo}
                                label="To"
                                name="price.to"
                                type="text"
                                disabled={!unlockedEdit}
                                onBlur={formik.handleBlur}
                                onChange={e => {
                                    if (!(/^[0-9,]*$/.test(e.target.value))){
                                        return
                                    }else {
                                        const rawValue = e.target.value.replace(/,/g, ''); // Remove commas
                                        formik.setFieldValue("price.to", +rawValue);
                                    }
                                }}
                                value={Number(formik.values.price.to).toLocaleString()}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">
                                        <IconButton
                                            style={{ fontSize: '18px', padding: '4px' }}
                                            disabled={!unlockedEdit}
                                            onClick={(e)=> {
                                                e.preventDefault()
                                                handleClick(e)
                                            }}
                                        >
                                            {currencyValue?.label}
                                        </IconButton>
                                    </InputAdornment>
                                }}
                            />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                anchorOrigin={{
                                    vertical: 'bottom', // Anchor point on the button
                                    horizontal: 'center', // Move the menu to the left
                                }}
                                transformOrigin={{
                                    vertical: 'top', // Position of the menu
                                    horizontal: 'center', // Position of the menu
                                }}
                                open={open}
                                onClose={()=>handleClose()}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                {CURRENCY.map(item=>(
                                    <MenuItem
                                        key={item.value}
                                        value={item.value}
                                        onClick={(e)=>{
                                            handleClose()
                                            formik.setFieldValue("currency", item?.label);
                                        }}
                                    >
                                        {item?.label}
                                    </MenuItem>
                                ))}
                            </Menu>

                        </Stack>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OpportunityCreateBudget;
