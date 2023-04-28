const express = require('express');
const authRoute = require('./auth.route');
const userRoute = require('./user.route');
const infoRoute = require('./info.route');
const proposalRoute = require('./proposal.route');
const purchaseRoute = require('./purchase.route');
const saleRoute = require('./sale.route');
const otherRoute = require('./other.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');
const walletRoute = require('./wallet.route');
const adminRoute = require('./admin.route');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/',
    route: userRoute,
  },
  {
    path: '/infos',
    route: infoRoute,
  },
  {
    path: '/proposal',
    route: proposalRoute,
  },
  {
    path: '/purchase',
    route: purchaseRoute,
  },
  {
    path: '/sale',
    route: saleRoute,
  },
  {
    path: '/',
    route: otherRoute,
  },
  {
    path: '/',
    route: walletRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
