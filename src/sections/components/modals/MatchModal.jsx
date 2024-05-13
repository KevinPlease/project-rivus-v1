import React from 'react'
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import SvgIcon from "@mui/material/SvgIcon";
import CheckIcon from "@untitled-ui/icons-react/build/esm/Check";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const MatchModal = ({matchData, source, onClick})=>{

    return(
        <>
            <Container maxWidth="sm">
                <Box
                    sx={{
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >

                    <Typography variant="h5">
                        Match!!
                    </Typography>
                    <Typography
                        align="center"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                        variant="body2"
                    >
                        {`${matchData.length} ${source === "Opportunity" ? "Properties" : "Opportunities" } were found for this ${source} `}
                    </Typography>
                    <Button
                        fullWidth
                        size="large"
                        sx={{ mt: 4 }}
                        variant="contained"
                        onClick={onClick}
                    >
                        View {matchData.length > 1 ? "matches"  : "match" }
                    </Button>
                </Box>
            </Container>
        </>
    )
}
export default MatchModal