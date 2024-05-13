import { useCallback, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import { withAuthGuard } from "src/hocs/with-auth-guard";
import { useSettings } from "src/hooks/use-settings";

import { useSections } from "./config";
import { HorizontalLayout } from "./horizontal-layout";
import { VerticalLayout } from "./vertical-layout";
import BaseAPI from "../../api/BaseAPI";
import matchAPI from "../../api/match";
import { addNotifications, deleteAllNotifications } from "../../slices/notification";
import { useMounted } from "../../hooks/use-mounted";
import { useAuth } from "../../hooks/use-auth";

export const Layout = withAuthGuard((props) => {
  const settings = useSettings();
  const { user } = useAuth();
  const sections = useSections();
  const dispatch = useDispatch();
  const isMounted = useMounted();
  const matchTimer = useSelector(state => state.notification.matchTimer);
  const matchSchedulerRef = useRef(null);

  const fetchMatchNotifications = useCallback(async () => {
    const authInfo = BaseAPI.authForInfo(user);
    const syncInfo = await matchAPI.getSyncInfo(authInfo);

    if (isMounted() && syncInfo) {
      const notifications = syncInfo.data.map(item => {
        const opportunityCount = item.opportunityCount;
        const propertyCount = item.propertyCount;
        return {
          id: item.displayId,
          createdAt: syncInfo.time,
          description: `${opportunityCount ? `${opportunityCount} Opportunities found ` : ""}
       ${opportunityCount && propertyCount ? "and" : ""}
       ${propertyCount ? `${propertyCount} Properties found` : ""}`,
          read: true,
          type: "match_client"
        };
      });

      dispatch(addNotifications(notifications));
      toast.success("New Matches were found!");
    }

    // continue next schedule
    matchSchedulerRef.current = setTimeout(fetchMatchNotifications, matchTimer);

  }, [matchTimer, user]);

  useEffect(() => {
    if (matchSchedulerRef.current) {
      clearTimeout(matchSchedulerRef.current);
    }

    matchSchedulerRef.current = setTimeout(fetchMatchNotifications, matchTimer);

    return () => {
      clearTimeout(matchSchedulerRef.current);
      matchSchedulerRef.current = null;
    };
  }, [matchTimer]);

  useEffect(() => {
    dispatch(deleteAllNotifications());
  });

  if (settings.layout === "horizontal") {
    return (
      <HorizontalLayout
        sections={sections}
        navColor={settings.navColor}
        {...props} />
    );
  }

  return (
    <VerticalLayout
      sections={sections}
      navColor={settings.navColor}
      {...props} />
  );
});

Layout.propTypes = {
  children: PropTypes.node
};
