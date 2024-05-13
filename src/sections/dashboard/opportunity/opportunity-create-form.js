import React, { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { FormikProvider, useFormik } from "formik";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Divider from "@mui/material/Divider";
import Badge from "@mui/material/Badge";

import { useRouter } from "src/hooks/use-router";
import { paths } from "src/paths";
import OpportunityCreateStages from "./opportunity-create-stages";
import OpportunityCreatePropertyReq from "./opportunity-create-property-req";
import OpportunityCreateRoomsSpaces from "./opportunity-create-rooms-spaces";
import OpportunityCreateLocation from "./opportunity-create-location";
import OpportunityCreateBudget from "./opportunity-create-budget";
import { ConfirmationDialog } from "src/sections/confirmation-dialog";
import { FormButtons } from "src/sections/form-buttons";
import { askQuickNotifications } from "src/slices/notification";
import { ClipboardChip } from "src/sections/components/buttons/clipboard_chip";
import opportunityAPI from "src/api/opportunity";
import BaseAPI from "src/api/BaseAPI";
import { useAuth } from "src/hooks/use-auth";
import OpportunityCreatePriorities from "./opportunity-create-priorities";
import { MatchDetails } from "../match/match-details";
import { AnimatePresence } from "framer-motion";
import ModalPopUp from "../../components/modals/ModalPopUp";
import MatchModal from "../../components/modals/MatchModal";
import ENV from "../../../../env";

const LIMITED_ROLES = ENV.LIMITED_ROLES;

const REQUIRED = "Field is required!";
const validationSchema = Yup.object({
  propertyType: Yup.string().max(255).required(REQUIRED),
  availability: Yup.string().max(255),
  country: Yup.string().max(255).required(REQUIRED),
  city: Yup.string().max(255).required(REQUIRED),
  constructionYearFrom: Yup.number().min(0),
  areaFrom: Yup.number().min(0),
  areaTo: Yup.number().min(0),
  constructionYearTo: Yup.number().min(0),
  businessType: Yup.string().max(255),
  priceFrom: Yup.number().min(0),
  priceTo: Yup.number().min(0),
  owner: Yup.string().max(255).required(REQUIRED),
  assignee: Yup.string().max(255).required(REQUIRED),
  title: Yup.string().max(255).required(REQUIRED),
  description: Yup.string().max(5000),
  saleStage: Yup.string().max(255).required(REQUIRED),
  bedroomsFrom: Yup.number().min(1),
  bedroomsTo: Yup.number().min(1),
  bathroomsFrom: Yup.number().min(1),
  bathroomsTo: Yup.number().min(1),
  floorsFrom: Yup.number().min(1),
  floorsTo: Yup.number().min(1),
  livingRoomsFrom: Yup.number().min(1),
  livingRoomsTo: Yup.number().min(1),
  source: Yup.string(),
  furniture: Yup.string(),
  hasMortgage: Yup.bool(),
  luxury: Yup.bool()
});
export const OpportunityCreateForm = ({ current, displayId, opportunityData, opportunityId, formOptions, matchCount, ...props }) => {
  const searchParams = new URLSearchParams(window.location.search)
  const matchQuery = searchParams.get('tab');
  const { user } = useAuth();
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentTab, setCurrentTab] = useState("details");
  const [priorities, setPriorities] = useState([]);
  const [selectedZones, setSelectedZones] = useState([]);
  const [unlockedEdit, setUnlockedEdit] = useState(current === "Create");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [matchData, setMatchData] = useState([])
  const [open, setOpen] = useState(false);

  const isLimitedUser = useMemo(() => {
    return LIMITED_ROLES.includes(user?.data.role._id) && opportunityData?.assignee !== user?._id;
  }, [opportunityData, user]);

  const getInitialValues = useCallback((opportunityData) => {
    const details = opportunityData?.details;
    return {
      propertyType: opportunityData?.propertyType || "",
      availability: opportunityData?.availability || "",
      country: opportunityData?.country || "Albania",
      city: opportunityData?.city || "",
      zone: opportunityData?.zone || [],
      businessType: opportunityData?.businessType || "",
      currency: opportunityData?.currency || "€",
      price: { from: opportunityData?.price.from || 0, to: opportunityData?.price.to || 0 },
      owner: opportunityData?.owner || "",
      assignee: opportunityData?.assignee || user?._id || "",
      title: opportunityData?.title || "",
      saleStage: opportunityData?.saleStage || "",
      source: opportunityData?.source || "",
      details: {
        constructionYear: { from: details?.constructionYear.from || 1, to: details?.constructionYear.to || 3 },
        description: details?.description || "",
        furniture: details?.furniture || "",
        area: { from: details?.area.from || 1, to: details?.area.to || 100 },
        bedrooms: { from: details?.bedrooms.from || 1, to: details?.bedrooms.to || 3 },
        bathrooms: { from: details?.bathrooms.from || 1, to: details?.bathrooms.to || 3 },
        floors: { from: details?.floors.from || 1, to: details?.floors.to || 3 },
        livingRooms: { from: details?.livingRooms.from || 1, to: details?.livingRooms.to || 3 },
        hasMortgage: details?.hasMortgage || false,
        luxury: details?.luxury || false
      },
      submit: null
    };
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: getInitialValues(opportunityData),
    validationSchema,
    onSubmit: async (values, helpers) => {
      values.isDraft = false;
      values.title = values.title.toUpperCase();
      values.zone = selectedZones;
      formik.setSubmitting(true);
      const authInfo = BaseAPI.authForInfo(user);
      const response = await opportunityAPI.updateWithPriorities(authInfo, opportunityId, values, priorities);
      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        return;
      }

      dispatch(askQuickNotifications());

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      const message = current === "Edit" ? "Opportunity updated!" : "Opportunity created!";
      toast.success(message);
      if (!!response.data.hunt.data.result.findings.properties.length) {
        setMatchData(response.data.hunt.data.result.findings.properties)
        setOpen(true)
      } else {
        router.replace(paths.dashboard.opportunity.index);
      }
    }
  });

  const tabs = useMemo(() => [
    { label: !unlockedEdit ? "Details" : "Edit Details", value: "details" },
    { label: "Matches", value: "matches" },
  ], [unlockedEdit]);

  const redirectMatchFound = () => {

    const queryParams = { tab: 'matches' }; // Replace with your actual parameter and value
    const queryString = new URLSearchParams(queryParams).toString();
    if (current === "Create") {
      const matchPath = `/dashboard/opportunity/${opportunityId}/edit?${queryString}`;
      router.replace(matchPath);
    } else {
      setCurrentTab("matches")
    }
    setOpen(false)
  }

  const handlePrioritiesChanged = useCallback((priorityId, destinationIndex) => {
    setPriorities((prevPriorities) => {
      const prio = prevPriorities.find(prioInArr => prioInArr._id === priorityId);
      prevPriorities.splice(prevPriorities.indexOf(prio), 1);
      prevPriorities.splice(destinationIndex, 0, prio);
      return [...prevPriorities];
    });
  }, []);

  const handleZonesChanged = useCallback((selectedValues) => {
    setSelectedZones(selectedValues);
  }, []);

  const handleCancel = useCallback((event) => {
    if (current === "Create") return router.push(paths.dashboard.opportunity.index);
    formik.setSubmitting(false);
    setUnlockedEdit(prevState => !prevState);
  }, []);

  const handleTabsChange = useCallback((event, value) => {
    setCurrentTab(value);
  }, []);

  const handleDelete = useCallback(async (event) => {
    const authInfo = BaseAPI.authForInfo(user);
    const response = await opportunityAPI.delete(authInfo, opportunityId);

    let status = "success";
    let message = "Opportunity Deleted!";
    if (response.status === "failure") {
      status = "error";
      message = "Something went wrong!";
    }

    formik.setSubmitting(false);
    toast[status](message);
    router.replace(paths.dashboard.opportunity.index);
  }, [opportunityId, router]);

  useEffect(() => {
    if (Object.values(formOptions)[0].length && current === "Create") formik.setSubmitting(0);
  }, [Object.values(formOptions)[0].length]);


  useEffect(() => {
    if (!opportunityData) return;

    setPriorities(opportunityData.hunt._raw);
    setSelectedZones(opportunityData.zone);
  }, [opportunityData]);

  useEffect(() => {
    if (matchQuery) {
      setCurrentTab(matchQuery);
    }
  }, [matchQuery])

  return (
    <>
      <FormikProvider value={formik}>
        <form {...props} onSubmit={formik.handleSubmit}>

          <Stack spacing={1}>
            <Typography variant="h4" sx={{ textTransform: "uppercase" }}>
              {formik.values.title}
            </Typography>
            <Stack
              alignItems="center"
              direction="row"
              spacing={1}
            >
              <Typography variant="subtitle2">
                ID:
              </Typography>
              <ClipboardChip
                label={displayId}
                size="small"
              />
            </Stack>
          </Stack>
          {current !== "Create" && <div>
            <Tabs
              indicatorColor="primary"
              onChange={handleTabsChange}
              scrollButtons="auto"
              textColor="primary"
              value={currentTab}
              variant="scrollable"
            >
              {tabs.map((tab) => (
                <Tab
                  key={tab.value}
                  label={
                    tab.value === "matches" ? (
                      <Badge color="error" className="mx-3" badgeContent={matchCount}>
                        {tab.label}
                      </Badge>
                    ) : (
                      tab.label
                    )
                  }
                  value={tab.value}
                />
              ))}
            </Tabs>
            <Divider />
          </div>}
          {currentTab === "details" && <Stack spacing={4}>
            <Stack flex="flex" flexDirection="row" justifyContent="flex-end" sx={{ mb: 2 }}>
              {!unlockedEdit && !isLimitedUser &&
                <Button
                  size="large"
                  variant="text"
                  onClick={() => {
                    setUnlockedEdit(prevState => !prevState)
                    formik.setSubmitting("");
                  }}>
                  Edit Details
                </Button>
              }
            </Stack>
            <OpportunityCreatePropertyReq formOptions={formOptions} unlockedEdit={unlockedEdit} />
            <OpportunityCreateRoomsSpaces formOptions={formOptions} unlockedEdit={unlockedEdit} />
            <OpportunityCreateLocation formOptions={formOptions} unlockedEdit={unlockedEdit} handleZonesChanged={handleZonesChanged} selectedZones={selectedZones} />
            <OpportunityCreateBudget formOptions={formOptions} unlockedEdit={unlockedEdit} />
            <OpportunityCreateStages formOptions={formOptions} unlockedEdit={unlockedEdit} />
            <OpportunityCreatePriorities priorities={priorities} handlePrioritiesChanged={handlePrioritiesChanged} unlockedEdit={unlockedEdit} />
            <FormButtons
              unlockedEdit={unlockedEdit}
              formik={formik}
              current={current}
              handleDelete={() => setIsDialogOpen(true)}
              handleCancel={handleCancel}
            />
          </Stack>}
          {currentTab === "matches" && opportunityId && <MatchDetails id={opportunityId} source="Opportunity" />}
          <ConfirmationDialog
            modelName={"Opportunity"}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            handleDelete={handleDelete}
            isSubmitting={formik.isSubmitting}
          />
        </form>
      </FormikProvider>
      <AnimatePresence>
        {open && <ModalPopUp open={open} handleClose={() => {
          setOpen(false)
          router.replace(paths.dashboard.opportunity.index);
        }} >
          <MatchModal source="Opportunity" matchData={matchData} onClick={redirectMatchFound} />
        </ModalPopUp>}
      </AnimatePresence>
    </>

  )
}  