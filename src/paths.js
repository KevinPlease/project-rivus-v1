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
      details: '/dashboard/customers/:id'
    },
    orders: {
      index: '/dashboard/orders',
      create: '/dashboard/orders/create',
      details: '/dashboard/orders/:id'
    },
    users: {
      index: '/dashboard/users',
      create: '/dashboard/users/create',
      details: '/dashboard/users/:id'
    },
    roles: {
      index: '/dashboard/roles',
      create: '/dashboard/roles/create',
      details: '/dashboard/roles/:id'
    }
  },
  notAuthorized: '/401',
  notFound: '/404',
  serverError: '/500'
};
