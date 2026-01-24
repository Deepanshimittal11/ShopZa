const razorpay = require("../config/razorpayClient");
const orderService = require("../models/Order");

// Generate Payment Link
const createPaymentLink = async(orderId) => {
    try {
        const order = await orderService.findById(orderId).populate('user');
        if (!order) {
            throw new Error('Order not found');
        }
        if (!order.user) {
            throw new Error('Order user not found');
        }
        const phone = order.shippingAddress && order.shippingAddress.phone ? order.shippingAddress.phone : "";
        const paymentLinkRequest = {
            amount: order.totalPrice * 100, // amount in paise
            currency: "INR",
            customer: {
                name: order.user.name,
                contact: phone,
                email: order.user.email
            },
            notify: {
                sms: true,
                email: true,
            },
            reminder_enable: true,
            // Use env variable for frontend callback URL, Razorpay will append payment_id and order_id
            callback_url: `${process.env.FRONTEND_URL || "http://localhost:5173"}/order-confirmation`,
            callback_method: "get",
        };
        const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);
        const paymentLinkId = paymentLink.id;
        const payment_link_url = paymentLink.short_url;
        const resData = {
            paymentLinkId,
            payment_link_url,
        };
        return resData;
    } catch (error) {
        console.error('Razorpay payment error:', error);
        if (error && error.response) {
            console.error('Razorpay error response:', error.response);
        }
        throw new Error(error.message || JSON.stringify(error));
    }
}

// Update Payment Status
const updatePaymentInformation = async(reqData) => {
    
    const paymentId = reqData.payment_id;
    const orderId = reqData.order_id;
    
    try {
        const order = await orderService.findById(orderId);

        const payment = await razorpay.payments.fetch(paymentId);

        if(payment.status === "captured"){
            order.paymentDetails.paymentId = paymentId;
            order.paymentDetails.status = "Paid";
            order.orderStatus = "Confirmed";
            await order.save();
        }
        const resData = {message: "Your order is confirmed", success:true}

        return resData;

    } catch (error) {
        throw new Error(error.message);
    }

}

module.exports={
    createPaymentLink,
    updatePaymentInformation
}