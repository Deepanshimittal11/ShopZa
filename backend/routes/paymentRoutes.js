const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();


const paymentController = require('../controller/paymentController');
const { protect } = require('../middleware/authMiddleware');
const mongoose = require('mongoose');

router.post('/:id', protect, (req, res, next) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res.status(400).json({ message: 'Invalid order ID' });
	}
	next();
}, paymentController.createPaymentLink);

router.put("/", protect, paymentController.updatePaymentInformation);

module.exports = router;