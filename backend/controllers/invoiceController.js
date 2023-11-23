const Invoice = require('../models/Invoice');
const Email = require('../utils/email');
const Customer = require('../models/Customer');
const Owner = require('../models/Owner');

exports.getAllInvoices = async (req, res) => {
  try {
    const allInvoices = await Invoice.find({});
    return res.json({
      message: 'All Invoices fetched successfully',
      data: allInvoices
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

//////// Implemented after AUTH
exports.getMyInvoices = async (req, res) => {
  try {
    const owner = req.owner;
    const allInvoices = await Invoice.find({ owner_id: owner.id });
    return res.json({
      message: `Invoices for ${owner.business_name}:`,
      data: allInvoices
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

exports.getOneInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const foundInvoice = await Invoice.find({
      _id: invoiceId,
      owner_id: req.owner._id
    });
    if (!foundInvoice.length) {
      return res.status(404).json({
        message: 'Invoice not found!',
        data: null
      });
    }

    return res.status(200).json({
      message: 'Invoice fetched successfully',
      data: foundInvoice
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

exports.createInvoice = async (req, res) => {
  try {
    // get the customer details using the customer_id
    const foundCustomer = await Customer.findOne({
      _id: req.body.customer_id,
      owner_id: req.owner._id
    });
    if (!foundCustomer) {
      return res.status(404).json({
        message: 'Customer not found!',
        data: null
      });
    }

    // if customer is found for the user, create the invoice
    const newInvoice = await Invoice.create({
      ...req.body,
      owner_id: req.owner._id
    });

    // send email to customer

    //   const url = `${req.protocol}://${req.get(
    //  	'host'
    //   )}/v1/auth/activate/${urlActivationToken}`;
    const url = 'Some Random URL for now';
    try {
      await new Email(
        foundCustomer,
        url,
        newInvoice,
        req.owner.business_name
      ).sendInvoice();
      return res.status(201).json({
        status: 'success',
        message:
          'Invoice Successfully created. Your client will be notified via email.',
        data: newInvoice
      });
    } catch (err) {
      await Owner.deleteOne({ email: req.body.email });
      return next(err);
    }

    //  return res.status(201).json({
    //    message: 'Invoice created successfully',
    //    data: newInvoice
    //  });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

exports.updateInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const foundInvoice = await Invoice.findOne({
      _id: invoiceId,
      owner_id: req.owner._id
    });
    if (!foundInvoice) {
      return res.status(404).json({
        message: 'Invoice not found!',
        data: null
      });
    }
    const updatedInvoice = await Invoice.findOneAndUpdate(
      { _id: invoiceId, owner_id: req.owner_id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    return res.status(201).json({
      message: 'Invoice Updated successfully',
      data: updatedInvoice
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

exports.updateInvoiceToPaid = async (req, res) => {
  try {
	// find the invoice
    const invoiceId = req.params.id;
    const foundInvoice = await Invoice.findOne({
      _id: invoiceId
    });
    if (!foundInvoice) {
      return res.status(404).json({
        message: 'Invoice not found!',
        data: null
      });
    }

	 // find the customer
	 const foundCustomer = await Customer.findOne({
		_id: foundInvoice.customer_id
	 });

	 // find the business owner
	 const foundOwner = await Owner.findOne({
		_id: foundInvoice.owner_id
	 })

	 // update the invoice
    foundInvoice.status = "Paid";
    foundInvoice.date_paid = Date.now();
    foundInvoice.save();

    const url = 'Some Random URL for now';
    try {
      await new Email(
        foundCustomer,
        url,
        foundInvoice,
        foundOwner.business_name
      ).sendReceipt();
      return res.status(201).json({
        status: 'success',
        message:
          'Invoice Successfully Paid. Your receipt has been sent to your mailbox.',
        data: foundInvoice
      });
    } catch (err) {
      await Owner.deleteOne({ email: req.body.email });
      return next(err);
    }

    //  return res.status(201).json({
    //    message: 'Invoice Updated successfully',
    //    data: 'updatedInvoice'
    //  });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null
    });
  }
};

exports.deleteOneInvoice = async (req, res) => {
  try {
    const invoiceId = req.params.id;
    const foundInvoice = await Invoice.findOne({
      _id: invoiceId,
      owner_id: req.owner._id
    });
    if (!foundInvoice) {
      return res.status(404).json({
        message: 'Invoice not found!',
        data: null
      });
    }

    const deletedInvoice = await Invoice.findByIdAndDelete(invoiceId);

    return res.status(204).json({
      message: 'Invoice deleted successfully',
      data: null
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      data: null
    });
  }
};