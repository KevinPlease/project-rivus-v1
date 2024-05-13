import React from "react";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Unstable_Grid2";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Card from "@mui/material/Card";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import {useFormikContext} from "formik";
import OpportunityCreateRooms from "./opportunity-create-rooms";


const OpportunityCreateRoomsSpaces = ({formOptions, unlockedEdit}) => {
    const formik = useFormikContext()

    return (
        <Card>
            <CardContent>
                <div className="grid grid-cols-12">
                    <div className="col-span-12 md:col-span-4 mb-6">
                        <Typography variant="h6">
                            Rooms and Spaces
                        </Typography>
                    </div>
                    <div className="col-span-12 md:col-span-8">
                        <OpportunityCreateRooms unlockedEdit={unlockedEdit}/>
                        <div className="my-6">
                            <TextField
                                error={!!(formik.touched.furniture && formik.errors?.furniture)}
                                fullWidth
                                label="Mobilimi"
                                name="details.furniture"
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                select
                                disabled={!unlockedEdit}
                                value={formik.values.details.furniture}
                            >
                                {formOptions.furniture.map((option) => (
                                    <MenuItem
                                        key={option._id}
                                        value={option._id}
                                    >
                                        {option.data.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </div>
                        <Stack>
                            Attributes
                        </Stack>
                        <div className="grid grid-cols-2">
                            <FormControlLabel
                                control={<Checkbox/>}
                                label="Luxury"
                                name="details.luxury"
                                disabled={!unlockedEdit}
                                onChange={formik.handleChange}
                                checked={formik.values.details.luxury}
                                value={formik.values.details.luxury}/>
                            <FormControlLabel
                                control={<Checkbox/>}
                                label="Has Mortgage"
                                name="details.hasMortgage"
                                disabled={!unlockedEdit}
                                onChange={formik.handleChange}
                                checked={formik.values.details.hasMortgage}
                                value={formik.values.details.hasMortgage}/>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OpportunityCreateRoomsSpaces;
