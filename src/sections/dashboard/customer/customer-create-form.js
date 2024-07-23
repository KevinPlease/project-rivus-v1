import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import * as Yup from "yup";
import { useFormik } from "formik";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import { paths } from "src/paths";
import { CustomerBasicDetails } from "src/sections/dashboard/customer/customer-basic-details";
import { CustomerCreateDocuments } from "src/sections/dashboard/customer/customer-create-documents";
import { CustomerPersonalDetails } from "src/sections/dashboard/customer/customer-personal-details";
import { toDocDetails } from "src/utils/files-to-docdetails";
import customerAPI from "src/api/customer";
import BaseAPI from "src/api/BaseAPI";

import { useRouter } from "next/router";
import { ConfirmationDialog } from "src/sections/confirmation-dialog";
import { useAuth } from "src/hooks/use-auth";


const REQUIRED = "Field is required";
const validationSchema = Yup.object({
  title: Yup.string().max(255).required(REQUIRED),
  name: Yup.string().max(255).required(REQUIRED),
  mobile: Yup.string().max(20).required(REQUIRED),
  personalId: Yup.string().max(255),
  email: Yup.string().max(255),
  // birthdate: Yup.date(),
  source: Yup.string().max(24),
  role: Yup.string().max(255),
  assignee: Yup.string().max(24).required(REQUIRED),
  description: Yup.string().max(500)
});

export const CustomerCreateForm = ({ customerData, id, formOptions }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      name: customerData.name || "",
      title: customerData.title || "",
      mobile: customerData.mobile || "",
      email: customerData.email || "",
      birthdate: customerData.birthdate ? new Date(customerData.birthdate) :null,
      address: customerData.address || "",
      personalId: customerData.personalId || "",
      assignee: customerData.assignee || user?._id || "",
      description: customerData.description || "",
      // documents: customerData.documents || [],
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      const loaderId = toast.loading("Updating customer...");
      values.isDraft = false;
      values.title = values.title.toUpperCase();
      await handleDocumentsUpload(files)
      const authInfo = BaseAPI.authForInfo(user);
      const response = await customerAPI.update(authInfo, id, values);

      toast.dismiss(loaderId);
      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: err.message });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("Customer created!");
      router.push(paths.dashboard.customers.index);
    },
  });

  useEffect(() => {
    setFiles((prevFiles) => {
      if (!customerData.documents) return prevFiles;

      return [...prevFiles, ...customerData.documents];
    });
  }, [customerData]);

  const handleFilesDrop = useCallback((newFiles) => {
    setFiles((prevFiles) => {
      const documents = toDocDetails(newFiles);
      return [...prevFiles, ...documents];
    });
  }, []);

  const handleFileRemove = useCallback((index) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles]; // Create a copy of the array
      newFiles.splice(index, 1); // Remove the element at the specified index
      return newFiles;
    });
  }, []);

  const handleFilesRemoveAll = useCallback(() => {
    setFiles([]);
  }, []);

  const handleDocumentsUpload = useCallback(async (allDocuments) => {
    try {
      formik.setSubmitting(true);
      const docFiles = allDocuments.map(docDetail => docDetail.file).filter(docFile => docFile !== undefined);
      const authInfo = BaseAPI.authForInfo(user);
      const response = await customerAPI.uploadDocuments(authInfo, id, docFiles);
      if (response.status === "success") {
        formik.setErrors(null);
        formik.setSubmitting(false);
        return
      }

      const errMsg = "There was a problem uploading documents!";
      formik.setErrors({ documents: errMsg });
      formik.setSubmitting(false);
      toast(errMsg);
    } catch (err) {
      console.error(err);
    }
  }, [id]);


  const handleCancel = useCallback((event) => {
    return router.push(paths.dashboard.customers.index);
  }, []);


  const handleDelete = useCallback(async (event) => {
    const authInfo = BaseAPI.authForInfo(user);
    const response = await customerAPI.delete(authInfo, id);

    let status = "success";
    let message = "Customer Deleted!";
    if (response.status === "failure") {
      status = "error";
      message = "Something went wrong!";
    }

    formik.setSubmitting(false);
    toast[status](message);
    router.replace(paths.dashboard.customers.index);
  }, [id, router]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Stack spacing={4}>
        <CustomerPersonalDetails formik={formik} unlockedEdit={true} />
        <CustomerBasicDetails formik={formik} formOptions={formOptions} unlockedEdit={true} />
        <CustomerCreateDocuments
          formik={formik}
          files={files}
          // handleFilesUpload={handleDocumentsUpload}
          handleFilesDrop={handleFilesDrop}
          handleFileRemove={handleFileRemove}
          handleFilesRemoveAll={handleFilesRemoveAll}
          unlockedEdit={true}
        />

        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={2}
        >
          <Button
            color="inherit"
            disabled={formik.isSubmitting}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={formik.isSubmitting}
            variant="contained"
          >
            Create
          </Button>
        </Stack>

      </Stack>

      <ConfirmationDialog
        modelName={"Customer"}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        handleDelete={handleDelete}
        isSubmitting={formik.isSubmitting}
      />

    </form>
  );
};
