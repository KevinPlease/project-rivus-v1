import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { toast } from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import ChevronRightIcon from "@untitled-ui/icons-react/build/esm/ChevronRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import SvgIcon from "@mui/material/SvgIcon";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import { ExString } from "server/src/shared/String";
import { useRouter } from "src/hooks/use-router";
import { useAuth } from "src/hooks/use-auth";
import { Scrollbar } from "src/components/scrollbar";
import { SeverityPill } from "src/components/severity-pill";
import opportunityAPI from "src/api/opportunity";
import BaseAPI from "src/api/BaseAPI";
import ArrowRightIcon from "@untitled-ui/icons-react/build/esm/ArrowRight";
import Avatar from "@mui/material/Avatar";
import { getInitials } from "../../../utils/get-initials";
import InputAdornment from "@mui/material/InputAdornment";
import Menu from "@mui/material/Menu";
import { CURRENCY } from "../../../data/currency";
import { motion } from "framer-motion"

import { dateStringFromTimestamp } from "src/utils/date-locale";
import { useUpdateEffect } from "src/hooks/use-update-effect";

const REQUIRED = "Field is required!";
const validationSchema = Yup.object({
  title: Yup.string().max(255).required(REQUIRED),
  saleStage: Yup.string().max(255),
  assignee: Yup.string().max(255).required(REQUIRED),
  price: Yup.number().min(0),

});

function getInitialValues(opportunityData) {
  const data = opportunityData?.map(item => {
    return {
      title: item?.data?.title || "",
      saleStage: item?.data?.saleStage?._id || "",
      assignee: item?.data?.assignee?._id || "",
      price: { from: item?.data?.price.from || 0, to: item?.data?.price.to || 0 },
      currency: item?.data?.currency || "",
      submit: null
    }
  })
  return data
}
export const OpportunityListTable = (props) => {
  const router = useRouter();
  const { user } = useAuth();
  const [currentItem, setCurrentItem] = useState({ index: null, opportunityId: null, handleSubmitLoader: 0 })
  const {
    count = 0,
    items = [],
    formDetails = null,
    onPageChange = () => { },
    refreshTable = () => { },
    onRowsPerPageChange,
    pageNr = 0,
    itemsPerPage = 10
  } = props;

  const gridFilters = useSelector(state => state.gridFilters);
  const [currentOpportunity, setCurrentOpportunity] = useState(null);
  const [currencyValue, setCurrencyValue] = useState({ label: "€", value: "EUR" });
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpportunityToggle = useCallback((opportunityId) => {
    setCurrentOpportunity((prevOpportunityId) => {
      if (prevOpportunityId === opportunityId) {
        return null;
      }

      return opportunityId;
    });
  }, []);

  const handleOpportunityClose = useCallback(() => {
    setCurrentOpportunity(null);
  }, []);

  const handleOpportunityUpdate = useCallback((index, opportunityId) => {
    setCurrentItem(prevState => {
      return {
        index,
        opportunityId,
        handleSubmitLoader: prevState.handleSubmitLoader += 1
      }
    })
  }, []);

  const renderZoneString = useCallback((zone, isExpanded) => {
    const zoneString = zone.join(", ");
    
    if (zoneString.length > 20 && !isExpanded) {
      return zoneString.slice(0, 20) + "...";

    } else {
      return zoneString;

    }
  }, []);

  useEffect(() => {
    if (currentItem.index === null) return;

    formik.handleSubmit();
  }, [currentItem.handleSubmitLoader, currentItem.index]);

  useUpdateEffect(() => {
    onPageChange(null, gridFilters.pageNr);
    onRowsPerPageChange({ target: { value: gridFilters.itemsPerPage }});
  }, [gridFilters]);

  const handleOpportunityDelete = useCallback(() => {
    toast.error("WIP 🚧");
  }, []);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(items),
    validationSchema,
    onSubmit: async (values, helpers) => {
      values.isDraft = false;
      const authInfo = BaseAPI.authForInfo(user);
      const response = await opportunityAPI.update(authInfo, currentItem.opportunityId, values[currentItem.index]);
      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("Opportunity updated!");
      setCurrentOpportunity(null);
      refreshTable();
    }
  });


  return (
    <div>
      <Scrollbar>
        <Table sx={{ minWidth: 1200 }}>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell width="20%">
                Title
              </TableCell>
              <TableCell>
                ID
              </TableCell>
              {/* <TableCell>
                Matches
              </TableCell> */}
              <TableCell>
                Sales Status
              </TableCell>
              <TableCell>
                Budget
              </TableCell>
              <TableCell>
                Mobile
              </TableCell>
              <TableCell>
                Agent
              </TableCell>
              <TableCell align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items?.map((opportunity, index) => {
              const opportunityId = opportunity?._id;
              const opportunityData = opportunity?.data;
              const isCurrent = opportunityId === currentOpportunity;
              //const quantityColor = opportunity.quantity >= 10 ? 'success' : 'error';
              const statusColor = opportunityData.availability?.data?.name === "Available" ? "success" : "info";
              // const hasManyVariants = opportunity.variants > 1;

              return (
                <Fragment key={opportunityId}>
                  <TableRow
                    hover
                    key={opportunityId}
                  >
                    <TableCell
                      padding="checkbox"
                      sx={{
                        ...(isCurrent && {
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: "\" \"",
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)"
                          }
                        })
                      }}
                      width="25%"
                    >
                      <IconButton onClick={() => handleOpportunityToggle(opportunityId)}>
                        <SvgIcon
                          component={motion.div}
                          animate={{ rotate: isCurrent ? 90 : 0 }}
                        >
                          <ChevronRightIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          cursor: "pointer"
                        }}
                      >
                        <Typography variant="subtitle2">
                          {opportunityData.title}
                        </Typography>
                        <Typography
                          color="text.secondary"
                          variant="body2"
                        >
                          {opportunityData?.propertyType?.data?.name} in {opportunityData ? renderZoneString(opportunityData.zone, isCurrent) : ""}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="subtitle2"
                        className="break-words"
                      >
                        {opportunity?.displayId}
                      </Typography>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {opportunity ? dateStringFromTimestamp(opportunity?.meta.timeCreated) : ""}
                      </Typography>
                    </TableCell>
                    {/* <TableCell>
                      <Typography>
                        2
                        matches
                      </Typography>
                    </TableCell> */}
                    <TableCell>
                      <SeverityPill color={statusColor}>
                        {opportunityData?.saleStage?.data?.name}
                      </SeverityPill>
                    </TableCell>
                    <TableCell>
                      {`${Number(opportunityData?.price?.from || 0).toLocaleString()} ${opportunityData?.currency} - ${Number(opportunityData?.price?.to || 0).toLocaleString()} ${opportunityData?.currency}`}
                    </TableCell>
                    <TableCell>
                      {opportunityData?.owner?.data?.mobile}
                    </TableCell>
                    <TableCell>
                      <Stack
                        alignItems="center"
                        direction="row"
                        spacing={1}
                      >
                        <Avatar
                          sx={{
                            height: 42,
                            width: 42,
                          }}
                        >
                          {getInitials(opportunity?.data?.assignee?.data?.name)}
                        </Avatar>
                        <div>
                          <div>
                            {opportunity?.data?.assignee?.data?.name}
                          </div>
                          <Typography
                            color="text.secondary"
                            variant="body2"
                          >
                            {opportunity?.data?.assignee?.repository ? ExString.betweenFirstTwo(opportunity?.data?.assignee?.repository, "/", "@") : ""}
                          </Typography>
                        </div>
                      </Stack>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton onClick={() => {
                        router.push(`/dashboard/opportunity/${opportunityId}/edit`)
                      }}>
                        <SvgIcon>
                          <ArrowRightIcon />
                        </SvgIcon>
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  {isCurrent && (
                    <TableRow>
                      <TableCell
                        colSpan={12}
                        sx={{
                          p: 0,
                          position: "relative",
                          "&:after": {
                            position: "absolute",
                            content: "\" \"",
                            top: 0,
                            left: 0,
                            backgroundColor: "primary.main",
                            width: 3,
                            height: "calc(100% + 1px)"
                          }
                        }}
                      >
                        <CardContent>
                          <Grid
                            container
                            spacing={3}
                          >
                            <Grid
                              item
                              md={0.5}
                              xs={12}
                            />
                            <Grid
                              item
                              md={11.5}
                              xs={12}
                            >

                              <Grid
                                container
                                spacing={3}
                              >
                                <Grid
                                  item
                                  md={3}
                                  xs={12}
                                >
                                  <TextField
                                    error={!!(formik.touched.title && formik.errors?.title)}
                                    fullWidth
                                    helperText={formik.touched.title && formik.errors?.title}
                                    label="Title"
                                    required
                                    name="title"
                                    onBlur={formik.handleBlur}
                                    onChange={e => {
                                      const uppercaseTitle = e.target.value.toUpperCase();
                                      formik.setFieldValue(`[${index}].title`, uppercaseTitle);
                                    }
                                    }
                                    value={formik.values[index].title}
                                  />
                                </Grid>
                                <Grid
                                  item
                                  md={3}
                                  xs={12}
                                >
                                  <TextField
                                    error={!!(formik.touched.priceFrom && formik.errors?.priceFrom)}
                                    fullWidth
                                    helperText={formik.touched.priceFrom && formik.errors?.priceFrom}
                                    label="From"
                                    name="price.from"
                                    type="text"
                                    onBlur={formik.handleBlur}
                                    onChange={e => {
                                      if (!(/^[0-9,]*$/.test(e.target.value))) {
                                        return
                                      } else {
                                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                                        formik.setFieldValue(`[${index}].price.from`, +rawValue);
                                      }
                                    }}
                                    value={Number(formik.values[index].price.from).toLocaleString()}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start">
                                        <IconButton
                                          style={{ fontSize: "18px", padding: "4px" }}
                                          onClick={(e) => {
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
                                      vertical: "bottom", // Anchor point on the button
                                      horizontal: "center", // Move the menu to the left
                                    }}
                                    transformOrigin={{
                                      vertical: "top", // Position of the menu
                                      horizontal: "center", // Position of the menu
                                    }}
                                    open={open}
                                    onClose={() => handleClose()}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button",
                                    }}
                                  >
                                    {CURRENCY.map(item => (
                                      <MenuItem
                                        key={item.value}
                                        value={item.value}
                                        onClick={(e) => {
                                          handleClose()
                                          formik.setFieldValue(`[${index}].currency`, item?.label);
                                        }}
                                      >
                                        {item?.label}
                                      </MenuItem>
                                    ))}
                                  </Menu>


                                </Grid>
                                <Grid
                                  item
                                  md={3}
                                  xs={12}
                                >
                                  <TextField
                                    error={!!(formik.touched.priceTo && formik.errors?.priceTo)}
                                    fullWidth
                                    // helperText={formik.touched.priceTo && formik.errors?.priceTo}
                                    label="To"
                                    name="price.to"
                                    type="text"
                                    onBlur={formik.handleBlur}
                                    onChange={e => {
                                      if (!(/^[0-9,]*$/.test(e.target.value))) {
                                        return
                                      } else {
                                        const rawValue = e.target.value.replace(/,/g, ""); // Remove commas
                                        formik.setFieldValue(`[${index}].price.to`, +rawValue);
                                      }
                                    }}
                                    value={Number(formik.values[index].price.to).toLocaleString()}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start">
                                        <IconButton
                                          style={{ fontSize: "18px", padding: "4px" }}
                                          onClick={(e) => {
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
                                      vertical: "bottom", // Anchor point on the button
                                      horizontal: "center", // Move the menu to the left
                                    }}
                                    transformOrigin={{
                                      vertical: "top", // Position of the menu
                                      horizontal: "center", // Position of the menu
                                    }}
                                    open={open}
                                    onClose={() => handleClose()}
                                    MenuListProps={{
                                      "aria-labelledby": "basic-button",
                                    }}
                                  >
                                    {CURRENCY.map(item => (
                                      <MenuItem
                                        key={item.value}
                                        value={item.value}
                                        onClick={(e) => {
                                          handleClose()
                                          formik.setFieldValue(`[${index}].currency`, item?.label);
                                        }}
                                      >
                                        {item?.label}
                                      </MenuItem>
                                    ))}
                                  </Menu>
                                </Grid>
                                <Grid
                                  item
                                  md={3}
                                  xs={12}
                                >
                                  <TextField
                                    error={!!(formik.touched.saleStage && formik.errors?.saleStage)}
                                    fullWidth
                                    label="Sale Stage"
                                    name="saleStage"
                                    onBlur={formik.handleBlur}
                                    onChange={e => {
                                      formik.setFieldValue(`[${index}].saleStage`, e.target.value);
                                    }}
                                    select
                                    value={formik.values[index].saleStage}
                                  >

                                    {formDetails?.saleStage.map((option) => (
                                      <MenuItem
                                        key={option._id}
                                        value={option._id}
                                        width={200}
                                      >
                                        {option.data.name}
                                      </MenuItem>
                                    ))}

                                  </TextField>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid
                              item
                              md={0.6}
                              xs={12}
                            />
                            <Grid
                              item
                              md={11.4}
                              xs={12}
                            >
                              <Stack
                                alignItems="center"
                                direction="row"
                                justifyContent="space-between"
                              >
                                <Stack
                                  alignItems="center"
                                  direction="row"
                                  spacing={2}
                                >
                                  <Button
                                    onClick={() => handleOpportunityUpdate(index, opportunityId)}
                                    type="submit"
                                    variant="contained"
                                  >
                                    Update
                                  </Button>
                                  <Button
                                    color="inherit"
                                    onClick={handleOpportunityClose}
                                  >
                                    Cancel
                                  </Button>
                                </Stack>
                                <Button
                                  onClick={handleOpportunityDelete}
                                  color="error"
                                >
                                  Delete opportunity
                                </Button>
                              </Stack>
                            </Grid>

                          </Grid>
                        </CardContent>

                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Scrollbar>
      <TablePagination
        component="div"
        count={count}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
        page={pageNr}
        rowsPerPage={itemsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </div>
  );
};

OpportunityListTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  formDetails: PropTypes.object,
  refreshTable: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  pageNr: PropTypes.number,
  itemsPerPage: PropTypes.number,
};
