export const paths = {
  index: '/',
  checkout: '/checkout',
  contact: '/contact',
  pricing: '/pricing',
  auth: {
    auth0: {
      callback: '/auth/auth0/callback',
      login: '/auth/auth0/login'
    },
    jwt: {
      login: '/auth/jwt/login',
      register: '/auth/jwt/register'
    },
    user: {
      login: '/auth/user/login'
    },
    firebase: {
      login: '/auth/firebase/login',
      register: '/auth/firebase/register'
    },
    amplify: {
      confirmRegister: '/auth/amplify/confirm-register',
      forgotPassword: '/auth/amplify/forgot-password',
      login: '/auth/amplify/login',
      register: '/auth/amplify/register',
      resetPassword: '/auth/amplify/reset-password'
    }
  },
  authDemo: {
    forgotPassword: {
      classic: '/auth-demo/forgot-password/classic',
      modern: '/auth-demo/forgot-password/modern'
    },
    login: {
      classic: '/auth-demo/login/classic',
      modern: '/auth-demo/login/modern'
    },
    register: {
      classic: '/auth-demo/register/classic',
      modern: '/auth-demo/register/modern'
    },
    resetPassword: {
      classic: '/auth-demo/reset-password/classic',
      modern: '/auth-demo/reset-password/modern'
    },
    verifyCode: {
      classic: '/auth-demo/verify-code/classic',
      modern: '/auth-demo/verify-code/modern'
    }
  },
  dashboard: {
    index: '/dashboard',
    account: '/dashboard/account',
    calendar: '/dashboard/calendar',
    chat: '/dashboard/chat',
    crypto: '/dashboard/crypto',
    clients: {
      index: '/dashboard/clients',
      create: '/dashboard/clients/create'
    },
    leads: {
      index: '/dashboard/leads',
      details: '/dashboard/leads/:leadId',
      edit: '/dashboard/leads/:leadId/edit',
      create: '/dashboard/leads/create'
    },
    ecommerce: '/dashboard/ecommerce',
    fileManager: '/dashboard/file-manager',
    invoices: {
      index: '/dashboard/invoices',
      details: '/dashboard/invoices/:orderId'
    },
    jobs: {
      index: '/dashboard/jobs',
      create: '/dashboard/jobs/create',
      companies: {
        details: '/dashboard/jobs/companies/:companyId'
      }
    },
    kanban: '/dashboard/kanban',
    logistics: {
      index: '/dashboard/logistics',
      fleet: '/dashboard/logistics/fleet'
    },
    mail: '/dashboard/mail',
    orders: {
      index: '/dashboard/orders',
      details: '/dashboard/orders/:orderId'
    },
    properties: {
      index: '/dashboard/properties',
      create: '/dashboard/properties/create',
      details: '/dashboard/properties/:propertyId',
      edit: '/dashboard/properties/:propertyId/edit'
    },
    opportunity: {
      index: '/dashboard/opportunity',
      create: '/dashboard/opportunity/create',
      details: '/dashboard/opportunity/:opportunityId',
      edit: '/dashboard/opportunity/:opportunityId/edit',
      priorities: '/dashboard/opportunity/:opportunityId/priorities'
    },
    social: {
      index: '/dashboard/social',
      profile: '/dashboard/social/profile',
      feed: '/dashboard/social/feed'
    }
  },
  components: {
    index: '/components',
    dataDisplay: {
      detailLists: '/components/data-display/detail-lists',
      tables: '/components/data-display/tables',
      quickStats: '/components/data-display/quick-stats'
    },
    lists: {
      groupedLists: '/components/lists/grouped-lists',
      gridLists: '/components/lists/grid-lists'
    },
    forms: '/components/forms',
    modals: '/components/modals',
    charts: '/components/charts',
    buttons: '/components/buttons',
    typography: '/components/typography',
    colors: '/components/colors',
    inputs: '/components/inputs'
  },
  docs: '',
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500'
};
