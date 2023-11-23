const invoiceController = require('../controllers/invoiceController');
const authController = require('../controllers/authController');
const { isAccountVerified } = require('../middlewares/isAccountVerfied');

const router = require('express').Router();

// router.use(authController.protect);
// router.use(authController.restrictTo('owner'));

router
  .route('/')
  .get(
    authController.protect,
    isAccountVerified,
    authController.restrictTo('owner'),
    invoiceController.getMyInvoices
  )
  .post(
    authController.protect,
    isAccountVerified,
    authController.restrictTo('owner'),
    invoiceController.createInvoice
  );

router
  .route('/:id')
  .get(
    authController.protect,
    isAccountVerified,
    authController.restrictTo('owner'),
    invoiceController.getOneInvoice
  )
  .patch(
    authController.protect,
    isAccountVerified,
    authController.restrictTo('owner'),
    invoiceController.updateInvoice
  )
  .delete(
    authController.protect,
    isAccountVerified,
    authController.restrictTo('owner'),
    invoiceController.deleteOneInvoice
  );

router.route('/:id/pay').post(invoiceController.updateInvoiceToPaid);

module.exports = router;