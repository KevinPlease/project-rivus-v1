export const paths = {
  index: '/',
  auth: {
    user: {
      login: '/auth/user/login'
    }
  },
  dashboard: {
    index: '/dashboard',
    account: '/dashboard/account',
    customers: {
      index: '/dashboard/customers',
      create: '/dashboard/customers/create',
      details: '/dashboard/customers/:id',
      edit: '/dashboard/customers/:id/edit'
    },
    orders: {
      index: '/dashboard/orders',
      details: '/dashboard/orders/:id'
    },
    properties: {
      index: '/dashboard/properties',
      create: '/dashboard/properties/create',
      details: '/dashboard/properties/:id',
      edit: '/dashboard/properties/:id/edit'
    }
  },
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500'
};
