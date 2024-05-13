// Remove if react-quill is not used
import "react-quill/dist/quill.snow.css";
// Remove if react-draft-wysiwyg is not used
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// Remove if simplebar is not used
import "simplebar-react/dist/simplebar.min.css";
// Remove if mapbox is not used
import "mapbox-gl/dist/mapbox-gl.css";
import Head from "next/head";
import { Provider as ReduxProvider } from "react-redux";
import { CacheProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import { RTL } from "src/components/rtl";
import { SplashScreen } from "src/components/splash-screen";
import { SettingsButton } from "src/components/settings/settings-button";
import { SettingsDrawer } from "src/components/settings/settings-drawer";
import { Toaster } from "src/components/toaster";
import { gtmConfig } from "src/config";
import { AuthConsumer, AuthProvider } from "src/contexts/auth/user";
import { SettingsConsumer, SettingsProvider } from "src/contexts/settings";
import { useAnalytics } from "src/hooks/use-analytics";
import { useNprogress } from "src/hooks/use-nprogress";
import { useTabCounter } from "src/hooks/use-tab-counter";
import { STORAGE_KEY } from "src/contexts/auth/user/auth-provider";
import { store } from "src/store";
import { createTheme } from "src/theme";
import { createEmotionCache } from "src/utils/create-emotion-cache";
import "../globals.css"
// Remove if locales are not used
import "src/locales/i18n";

const clientSideEmotionCache = createEmotionCache();

const CustomApp = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  useAnalytics(gtmConfig);
  useNprogress();

  useTabCounter(() => {
    localStorage.removeItem(STORAGE_KEY);
  });

  const getLayout = Component.getLayout ?? ((page) => page);
  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          Rivus
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
      </Head>
      <ReduxProvider store={store}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <AuthProvider>
            <AuthConsumer>
              {(auth) => {


                return (
                  <SettingsProvider>
                    <SettingsConsumer>
                      {(settings) => {
                        // Prevent theme flicker when restoring custom settings from browser storage
                        if (!settings.isInitialized) {
                          // return null;
                        }

                        const theme = createTheme({
                          colorPreset: settings.colorPreset,
                          contrast: settings.contrast,
                          direction: settings.direction,
                          paletteMode: settings.paletteMode,
                          responsiveFontSizes: settings.responsiveFontSizes,
                          components: {
                            MuiTextField: {
                              styleOverrides: {
                                root: {
                                  input: {
                                    "&:-webkit-autofill": {
                                      WebkitBoxShadow: "0 0 0 100px #E0D98C <<<<(Your color here) inset",
                                      WebkitTextFillColor: "default",
                                    },
                                  },
                                },
                              },
                            },
                          },
                        });

                        // Prevent guards from redirecting
                        const showSlashScreen = !auth.isInitialized;

                        return (
                          <ThemeProvider theme={theme}>
                            <Head>
                              <meta
                                name="color-scheme"
                                content={settings.paletteMode}
                              />
                              <meta
                                name="theme-color"
                                content={theme.palette.neutral[900]}
                              />
                            </Head>
                            <RTL direction={settings.direction}>
                              <CssBaseline />
                              {showSlashScreen
                                ? <SplashScreen />
                                : (
                                  <>
                                    {getLayout(
                                      <Component {...pageProps} />
                                    )}
                                    <SettingsButton onClick={settings.handleDrawerOpen} />
                                    <SettingsDrawer
                                      canReset={settings.isCustom}
                                      onClose={settings.handleDrawerClose}
                                      onReset={settings.handleReset}
                                      onUpdate={settings.handleUpdate}
                                      open={settings.openDrawer}
                                      values={{
                                        colorPreset: settings.colorPreset,
                                        contrast: settings.contrast,
                                        direction: settings.direction,
                                        paletteMode: settings.paletteMode,
                                        responsiveFontSizes: settings.responsiveFontSizes,
                                        stretch: settings.stretch,
                                        layout: settings.layout,
                                        navColor: settings.navColor
                                      }}
                                    />
                                  </>
                                )}
                              <Toaster />
                            </RTL>
                          </ThemeProvider>
                        );
                      }}
                    </SettingsConsumer>
                  </SettingsProvider>
                )
              }}
            </AuthConsumer>
          </AuthProvider>
        </LocalizationProvider>
      </ReduxProvider>
    </CacheProvider>
  );
};

export default CustomApp;
