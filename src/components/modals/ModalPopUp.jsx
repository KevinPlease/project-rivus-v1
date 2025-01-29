import * as React from 'react';
import Modal from '@mui/material/Modal';
import {motion} from "framer-motion"
import IconButton from "@mui/material/IconButton";
import {Clear} from "@mui/icons-material";

export default function BasicModal({open,children, handleClose = ()=>{}}) {

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <motion.div
                className="absolute top-1/2 left-1/2  transform -translate-x-1/2 shadow-md
                rounded-md p-4 max-h-85vh md:w-[40%] bg-white w-[90%]"
                style={{ y: '-50%', x:"-50%" }}
                initial={{
                    opacity: 0,
                    scale: 0.5,
                }}
                animate={{
                    opacity: 1,
                    scale: 1,
                    transition: {
                        ease: "easeOut",
                        duration: 0.15,
                    },
                }}
                exit={{
                    opacity: 0,
                    scale: 0.5,
                    transition: {
                        ease: "easeIn",
                        duration: 0.15,
                    },
                }}
            >
                {children}
            </motion.div>
        </Modal>
    );
}
