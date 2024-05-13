import React from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
import StairsOutlinedIcon from '@mui/icons-material/StairsOutlined'
import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import ChairOutlinedIcon from "@mui/icons-material/ChairOutlined";
import ShowerOutlinedIcon from "@mui/icons-material/ShowerOutlined";
import AspectRatioOutlinedIcon from '@mui/icons-material/AspectRatioOutlined';
import DomainAddOutlinedIcon from '@mui/icons-material/DomainAddOutlined';
import {useFormikContext, FastField} from "formik";
import MenuItem from "@mui/material/MenuItem";
const GENERIC_COUNT = 10;
function menuItemCount() {
    const menuItems = [];

    for (let index = 1; index <= GENERIC_COUNT; index += 1) {
        menuItems.push(<MenuItem key={index} value={index}>{index}</MenuItem>);
    }

    return menuItems;
}

const OpportunityCreateRooms = ({unlockedEdit }) => {
    const formik = useFormikContext()
    return (
        <div className="grid md:grid-cols-2 gap-6">
            <Stack
                spacing={3}
                alignItems="center"
                direction="row"
            >
                <Avatar
                    sx={{
                        height: 45,
                        width: 45,
                        mr: 1
                    }}>
                    <SvgIcon>
                        <BedOutlinedIcon />
                    </SvgIcon>
                </Avatar>
                Bedroom
            </Stack>
            <Stack spacing={3}
                alignItems="center"
                justifyContent="center"
                direction="row"
            >
                <FastField name="details.bedrooms.from">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.bedroomsFrom && form.errors?.bedroomsFrom)}
                            fullWidth
                            label="From"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            select
                            type="number"
                            disabled={!unlockedEdit}
                            value={field.value}
                        >
                            {menuItemCount()}
                        </TextField>
                    )}
                </FastField>

                <FastField name="details.bedrooms.to">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.bedroomsTo && form.errors?.bedroomsTo)}
                            fullWidth
                            label="To"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            select
                            type="number"
                            disabled={!unlockedEdit}
                            value={field.value}
                        >
                            {menuItemCount()}
                        </TextField>
                    )}
                </FastField>
            </Stack>
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
                        <ChairOutlinedIcon />
                    </SvgIcon>
                </Avatar>
                Living Rooms
            </Stack>
            <Stack spacing={3}
                alignItems="center"
                justifyContent="center"
                direction="row"
            >
                <FastField name="details.livingRooms.from">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.livingRoomsFrom && form.errors?.livingRoomsFrom)}
                            fullWidth
                            label="From"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            select
                            type="number"
                            disabled={!unlockedEdit}
                            value={field.value}
                        >
                            {menuItemCount()}
                        </TextField>
                    )}
                </FastField>
                <FastField name="details.livingRooms.to">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.livingRoomsTo && form.errors?.livingRoomsTo)}
                            fullWidth
                            label="To"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            select
                            type="number"
                            disabled={!unlockedEdit}
                            value={field.value}
                        >
                            {menuItemCount()}
                        </TextField>
                    )}
                </FastField>

            </Stack>
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
                        <ShowerOutlinedIcon />
                    </SvgIcon>
                </Avatar>
                Bathroom
            </Stack>
            <Stack spacing={3}
                alignItems="center"
                justifyContent="center"
                direction="row"
            >
                <FastField name="details.bathrooms.from">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.bathroomsFrom && form.errors?.bathroomsFrom)}
                            fullWidth
                            label="From"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            select
                            type="number"
                            disabled={!unlockedEdit}
                            value={field.value}
                        >
                            {menuItemCount()}
                        </TextField>
                    )}
                </FastField>
                <FastField name="details.bathrooms.to">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.bathroomsTo && form.errors?.bathroomsTo)}
                            fullWidth
                            label="To"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            select
                            type="number"
                            disabled={!unlockedEdit}
                            value={field.value}
                        >
                            {menuItemCount()}
                        </TextField>
                    )}
                </FastField>

            </Stack>
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
                        <StairsOutlinedIcon />
                    </SvgIcon>
                </Avatar>

                Floor
            </Stack>
            <Stack spacing={3}
                alignItems="center"
                justifyContent="center"
                direction="row"
            >
                <FastField name="details.floors.from">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.floorsFrom && form.errors?.floorsFrom)}
                            fullWidth
                            label="From"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            select
                            disabled={!unlockedEdit}
                            value={field.value}
                            type="number"
                        >
                            {menuItemCount()}
                        </TextField>
                    )}
                </FastField>
                <FastField name="details.floors.to">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.floorsTo && form.errors?.floorsTo)}
                            fullWidth
                            label="To"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            type="number"
                            select
                            disabled={!unlockedEdit}
                            value={field.value}
                        >
                            {menuItemCount()}
                        </TextField>
                    )}
                </FastField>
            </Stack>
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
                        <AspectRatioOutlinedIcon />
                    </SvgIcon>
                </Avatar>

                Area
            </Stack>
            <Stack spacing={3}
                   alignItems="center"
                   justifyContent="center"
                   direction="row"
            >
                <FastField name="details.area.from">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.areaFrom && form.errors?.areaFrom)}
                            fullWidth
                            label="From"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            disabled={!unlockedEdit}
                            value={field.value}
                            type="number"
                        />
                    )}
                </FastField>

                <FastField name="details.area.to">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.areaTo && form.errors?.areaTo)}
                            fullWidth
                            label="To"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            type="number"
                            disabled={!unlockedEdit}
                            value={field.value}
                        />
                    )}
                </FastField>

            </Stack>
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
                        <DomainAddOutlinedIcon />
                    </SvgIcon>
                </Avatar>

                Year of construction
            </Stack>
            <Stack spacing={3}
                   alignItems="center"
                   justifyContent="center"
                   direction="row"
            >
                <FastField name="details.constructionYear.from">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.constructionYearFrom && form.errors?.constructionYearFrom)}
                            fullWidth
                            label="From"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            disabled={!unlockedEdit}
                            value={field.value}
                            type="number"
                        />
                    )}
                </FastField>

                <FastField name="details.constructionYear.to">
                    {({ field, form }) => (
                        <TextField
                            error={!!(form.touched.constructionYearTo && form.errors?.constructionYearTo)}
                            fullWidth
                            label="To"
                            name={field.name}
                            onBlur={field.onBlur}
                            onChange={field.onChange}
                            type="number"
                            disabled={!unlockedEdit}
                            value={field.value}
                        />
                    )}
                </FastField>
            </Stack>
        </div>
    );
};

export default OpportunityCreateRooms