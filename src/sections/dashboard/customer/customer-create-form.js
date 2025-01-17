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
import { showLoaderToast } from "src/slices/toast";
import { useDispatch } from "react-redux";


const REQUIRED = "Field is required";
const validationSchema = Yup.object({
  title: Yup.string().max(255).required(REQUIRED),
  name: Yup.string().max(255).required(REQUIRED),
  mobile: Yup.string().max(20).required(REQUIRED),
  personalId: Yup.string().max(255),
  email: Yup.string().max(255),
  birthdate: Yup.date(),
  source: Yup.string().max(24),
  role: Yup.string().max(255),
  assignee: Yup.string().max(24).required(REQUIRED),
  description: Yup.string().max(500)
});

export const CustomerCreateForm = ({ formOptions }) => {
  const { user } = useAuth();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [files, setFiles] = useState([]);

  const createFileDetails = useCallback((doc) => {
    const file = doc.file;
    return {
      url: doc.url,
      src: doc.src,
      isImg: doc.isImg, 
      name: doc.name,
      isRemoved: doc.isRemoved,
      file: { name: file.name, size: file.size, type: file.type }
    };
  }, []);

  const formik = useFormik({
    // enableReinitialize: true,
    initialValues: {
      name: "",
      title: "",
      mobile: "",
      email: "",
      birthdate: new Date(Date.now()),
      address: "",
      personalId: "",
      assignee: "",
      description: ""
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      helpers.setSubmitting(true);
      values.documents = files.filter(doc => doc.file !== undefined).map(createFileDetails);
      
      const uploads = await handleUploads();
      values.documents = uploads.documents;
      const authInfo = BaseAPI.authForInfo(user);
      const response = await customerAPI.create(authInfo, values);
      if (response.status === "failure") {
        toast.error("Something went wrong!");
        helpers.setStatus({ success: false });
        helpers.setErrors({ submit: response.data });
        helpers.setSubmitting(false);
        return;
      }

      helpers.setStatus({ success: true });
      helpers.setSubmitting(false);
      toast.success("Customer created!");
      router.push(paths.dashboard.customers.index);
    },
  });

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

  const handleDocumentsUpload = useCallback(() => {
    const docFiles = files.filter(doc => doc.file !== undefined).map(doc => doc.file);
    const authInfo = BaseAPI.authForInfo(user);
    return customerAPI.uploadDocuments(authInfo, undefined, docFiles);
  }, [files, user]);

  const handleUploads = useCallback(async () => {
    const response = { documents: [] };
    if (files.length === 0) return response;

    try {
      const documentResponse = await handleDocumentsUpload();
      if (documentResponse.status === "success") response.documents = documentResponse.data;

    } catch (error) {
      console.error(error);
      toast.error("There was a problem uploading images!");

    } finally {
      return response;
    }

    // const toastInfo = {
    //   promise: handleDocumentsUpload(),
    //   messages: {
    //     loading: "Uploading files...",
    //     success: "Files uploaded successfully!",
    //     error: "There was a problem uploading the files!"
    //   },
    //   config: {
    //     success: {
    //       duration: 3000
    //     }
    //   }
    // };

    // dispatch(showLoaderToast(toastInfo));
  }, [files]);

  const handleCancel = useCallback((event) => {
    return router.push(paths.dashboard.customers.index);
  }, []);

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
        isSubmitting={formik.isSubmitting}
      />

    </form>
  );
};
