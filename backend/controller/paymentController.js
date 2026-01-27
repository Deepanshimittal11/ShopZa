const paymentService = require("../Services/paymentService");

const createPaymentLink = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId || orderId === 'undefined') {
            return res.status(400).json({ message: 'Order ID is missing or invalid' });
        }
        const paymentLink = await paymentService.createPaymentLink(orderId);
        return res.status(200).json(paymentLink);
    } catch (error) {
        const message = typeof error?.message === 'string' ? error.message : 'Failed to create payment link';
        if (message.includes('Order not found')) {
            return res.status(404).json({ message });
        }
        return res.status(500).json({ message }); 
    }
}

const updatePaymentInformation = async (req, res) => {
    try {
        const result = await paymentService.updatePaymentInformation(req.query);
        return res.status(200).json({ ...result, status: true });
    } catch (error) {
        const message = typeof error?.message === 'string' ? error.message : 'Failed to update payment information';
        if (message.includes('Missing order_id') || message.includes('Missing payment_id')) {
            return res.status(400).json({ message });
        }
        if (message.includes('Order not found')) {
            return res.status(404).json({ message });
        }
        return res.status(500).json({ message }); 
    }
}

module.exports = {
    createPaymentLink,
    updatePaymentInformation
}