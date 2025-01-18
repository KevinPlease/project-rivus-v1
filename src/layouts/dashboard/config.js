import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Chip from '@mui/material/Chip';
import SvgIcon from '@mui/material/SvgIcon';
import AlignLeft02Icon from 'src/icons/untitled-ui/duocolor/align-left-02';
import BarChartSquare02Icon from 'src/icons/untitled-ui/duocolor/bar-chart-square-02';
import Building04Icon from 'src/icons/untitled-ui/duocolor/building-04';
import CalendarIcon from 'src/icons/untitled-ui/duocolor/calendar';
import CheckDone01Icon from 'src/icons/untitled-ui/duocolor/check-done-01';
import CreditCard01Icon from 'src/icons/untitled-ui/duocolor/credit-card-01';
import CurrencyBitcoinCircleIcon from 'src/icons/untitled-ui/duocolor/currency-bitcoin-circle';
import File01Icon from 'src/icons/untitled-ui/duocolor/file-01';
import GraduationHat01Icon from 'src/icons/untitled-ui/duocolor/graduation-hat-01';
import HomeSmileIcon from 'src/icons/untitled-ui/duocolor/home-smile';
import LayoutAlt02Icon from 'src/icons/untitled-ui/duocolor/layout-alt-02';
import LineChartUp04Icon from 'src/icons/untitled-ui/duocolor/line-chart-up-04';
import Lock01Icon from 'src/icons/untitled-ui/duocolor/lock-01';
import LogOut01Icon from 'src/icons/untitled-ui/duocolor/log-out-01';
import Mail03Icon from 'src/icons/untitled-ui/duocolor/mail-03';
import Mail04Icon from 'src/icons/untitled-ui/duocolor/mail-04';
import MessageChatSquareIcon from 'src/icons/untitled-ui/duocolor/message-chat-square';
import ReceiptCheckIcon from 'src/icons/untitled-ui/duocolor/receipt-check';
import Share07Icon from 'src/icons/untitled-ui/duocolor/share-07';
import ShoppingBag03Icon from 'src/icons/untitled-ui/duocolor/shopping-bag-03';
import ShoppingCart01Icon from 'src/icons/untitled-ui/duocolor/shopping-cart-01';
import Truck01Icon from 'src/icons/untitled-ui/duocolor/truck-01';
import Upload04Icon from 'src/icons/untitled-ui/duocolor/upload-04';
import Users03Icon from 'src/icons/untitled-ui/duocolor/users-03';
import XSquareIcon from 'src/icons/untitled-ui/duocolor/x-square';
import { tokens } from 'src/locales/tokens';
import { paths } from 'src/paths';
import EmojiObjectsOutlinedIcon from '@mui/icons-material/EmojiObjectsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ContactPageOutlinedIcon from '@mui/icons-material/ContactPageOutlined';
import UsersPlus from 'src/icons/untitled-ui/duocolor/users-plus';
import ShieldPlus from 'src/icons/untitled-ui/duocolor/shield-plus';

export const useSections = () => {
  const { t } = useTranslation();

  return useMemo(() => {
    return [
      {
        items: [
          {
            title: t(tokens.nav.overview),
            path: paths.dashboard.index,
            icon: (
              <SvgIcon fontSize="small">
                <HomeSmileIcon />
              </SvgIcon>
            )
          },
          // {
          //   title: t(tokens.nav.analytics),
          //   path: paths.dashboard.analytics,
          //   icon: (
          //     <SvgIcon fontSize="small">
          //       <BarChartSquare02Icon />
          //     </SvgIcon>
          //   )
          // },
          // {
          //   title: t(tokens.nav.ecommerce),
          //   path: paths.dashboard.ecommerce,
          //   icon: (
          //     <SvgIcon fontSize="small">
          //       <LineChartUp04Icon />
          //     </SvgIcon>
          //   )
          // },
          // {
          //   title: t(tokens.nav.crypto),
          //   path: paths.dashboard.crypto,
          //   icon: (
          //     <SvgIcon fontSize="small">
          //       <CurrencyBitcoinCircleIcon />
          //     </SvgIcon>
          //   ),
          //   label: (
          //     <Chip
          //       color="primary"
          //       label="New"
          //       size="small"
          //     />
          //   )
          // },
          // {
          //   title: t(tokens.nav.account),
          //   path: paths.dashboard.account,
          //   icon: (
          //     <SvgIcon fontSize="small">
          //       <HomeSmileIcon />
          //     </SvgIcon>
          //   )
          // }
        ]
      },
      {
        subheader: t(tokens.nav.management),
        items: [
          {
            title: t(tokens.nav.customers),
            path: paths.dashboard.customers.index,
            icon: (
              <SvgIcon fontSize="small">
                <Users03Icon />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.list),
                path: paths.dashboard.customers.index
              },
              {
                title: t(tokens.nav.add),
                path: paths.dashboard.customers.create
              }
            ]
          }]
      },
      {
        subheader: t(tokens.nav.administration),
        items: [
          {
            title: t(tokens.nav.users),
            path: paths.dashboard.users.index,
            icon: (
              <SvgIcon fontSize="small">
                <UsersPlus />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.list),
                path: paths.dashboard.users.index
              },
              {
                title: t(tokens.nav.add),
                path: paths.dashboard.users.create
              }
            ]
          },
          {
            title: t(tokens.nav.roles),
            path: paths.dashboard.roles.index,
            icon: (
              <SvgIcon fontSize="small">
                <ShieldPlus />
              </SvgIcon>
            ),
            items: [
              {
                title: t(tokens.nav.list),
                path: paths.dashboard.roles.index
              },
              {
                title: t(tokens.nav.add),
                path: paths.dashboard.roles.create
              }
            ]
          }
        ]
      },
    ];
  }, [t]);
};
