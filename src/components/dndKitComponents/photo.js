import React, { forwardRef } from "react";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import DownloadIcon from "@mui/icons-material/Download";
import { saveAs } from "file-saver";

export const Photo = forwardRef(
  function Photo({ url, index, faded, style, unlockedEdit, handleDeleteClick, ...props }, ref) {
    const inlineStyles = {
      opacity: faded ? "0.2" : "1",
      transformOrigin: "0 0",
      height: index === 0 ? 310 : 150,
      border: index === 0 ? "4px solid #355A74" : "none",
      gridRowStart: index === 0 ? "span 2" : null,
      gridColumnStart: index === 0 ? "span 2" : null,
      backgroundImage: `url("${url}")`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      ...style
    };

    const downloadImage = () => {
      saveAs(url, "image.png");
    };

    return (
      <div
        style={inlineStyles}
      >
        {unlockedEdit &&
          <>
            <div
              ref={ref}
              {...props}
              // handleDblClick={props.handleDblClick(index)}
              className="flex flex-row justify-between cursor-pointer w-full h-full"
            />
            <span
              className={`h-fit ml-auto relative ${index === 0 ? "left-1 bottom-[295px] right-[0]" : "left-1 bottom-[145px] right-[0]"} w-full`}>
              <IconButton
                removable={true}
                handle
                onClick={() => handleDeleteClick(index)}
                className="justify-end bg-black bg-opacity-40  rounded-3xl p-1 "
                sx={{
                  backgroundColor: "rgba(0, 0, 0, 0.4)",
                  borderRadius: "3xl",
                  "&:hover": {
                    color: "red", backgroundColor: "rgba(0, 0, 0, 0.4)",
                    borderRadius: "3xl",
                  }
                }}
              >
                <CloseIcon sx={{ fontSize: "20px", color: "white", "&:hover": { color: "red", } }} />
              </IconButton>
            </span>

            <span
              className={"h-fit ml-auto relative bottom-[4.6rem] right-0 w-full p-2 cursor-pointer whitespace-nowrap"}
              onClick={downloadImage}
            >
              <span
                className="bg-black bg-opacity-40 w-full flex flex-row justify-center items-center text-center  p-1">
                <DownloadIcon sx={{ fontSize: "30px", color: "white" }} />
                <span className="text-sm text-white block">Download</span>
              </span>
            </span>
          </>

        }
      </div>
    );
  }
);
