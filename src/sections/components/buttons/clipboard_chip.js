import { useState } from "react";
import PropTypes from "prop-types";
import Chip from "@mui/material/Chip";
import {toast} from "react-hot-toast";
import Box from "@mui/material/Box";
import SvgIcon from "@mui/material/SvgIcon";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import IconButton from "@mui/material/IconButton";

export const ClipboardChip = ({
  label,
  size = "small"
}) => {

  const [showClipboard, setShowClipboard] = useState(true);

  return (
    <Box>
      <Chip
        label={label}
        size={size}
      />
      {
        showClipboard &&
        <IconButton
          edge="end"
          onClick={() => {
            navigator.clipboard.writeText(label);
            toast.success("Copied!");
          }}
        >
          <SvgIcon fontSize="small">
            <ContentCopyIcon />
          </SvgIcon>
        </IconButton>
      }
    </Box>

  )
};

ClipboardChip.propTypes = {
  label: PropTypes.string,
  size: PropTypes.string
};
