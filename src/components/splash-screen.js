import Box from '@mui/material/Box';
import Image from "next/image";
import logo_secondary from "src/icons/Tokton_Primary_03.png";
export const SplashScreen = () => (
  <Box
    sx={{
      alignItems: 'center',
      backgroundColor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      justifyContent: 'center',
      left: 0,
      p: 3,
      position: 'fixed',
      top: 0,
      width: '100vw',
      zIndex: 1400
    }}
  >
      <Image
          alt=""
          width={70}
          height={70}
          src={logo_secondary}
      />
  </Box>
);
