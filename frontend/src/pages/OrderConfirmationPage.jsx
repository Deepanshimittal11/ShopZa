// const checkout = {
//     _id: "12323",
//     createAt: new Date(),
//     checkoutItems: [
//         {
//             productId: "1",
//             name: "Jacket",
//             color: "black",
//             size: "M",
//             price:150,
//             quantity: 1,
//             image: "https://picsum.photos/150?random=1",
//         },
//         {
//             productId: "2",
//             name: "T-shirt",
//             color: "black",
//             size: "M",
//             price:120,
//             quantity: 2,
//             image: "https://picsum.photos/150?random=2",
//         },
//     ],
//     shippingAddress: {
//         address: "123 Fashion Street",
//         city: "New York",
//         country: "USA"
//     }
// }

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchOrderDetails } from "../redux/slices/orderSlice";
import { clearCart } from "../redux/slices/cartSlice";

const OrderConfirmationPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { checkout } = useSelector((state) => state.checkout);
    const { orderDetails, loading, error } = useSelector((state) => state.orders);
    // Try to get orderId from localStorage if present
    let orderId = localStorage.getItem("orderId");
    // Parse Razorpay callback params from query string
    const searchParams = new URLSearchParams(location.search);
    const razorpayOrderId = searchParams.get("razorpay_order_id");
    const razorpayPaymentId = searchParams.get("razorpay_payment_id");
    if (!orderId && razorpayOrderId) {
        orderId = razorpayOrderId;
        localStorage.setItem("orderId", orderId);
    }

    
    // Clear the cart when the order is confirmed
    useEffect(() => {
        if (checkout && checkout._id) {
            dispatch(clearCart && typeof clearCart === 'function' ? clearCart() : { type: 'cart/clearCart' });
            localStorage.removeItem("Cart");
            // Always store orderId in localStorage when payment link is created
            if (checkout.orderId) {
                localStorage.setItem("orderId", checkout.orderId);
            }
            // If checkout is finalized, fetch order details
            if (checkout.isFinalized && checkout.finalizedAt && checkout.orderId) {
                dispatch(fetchOrderDetails(checkout.orderId));
            }
        } else if (orderId) {
            // If no checkout, but orderId is present, fetch order details
            dispatch(fetchOrderDetails(orderId));
        } else if (razorpayOrderId) {
            // If Razorpay callback param is present, fetch order details
            dispatch(fetchOrderDetails(razorpayOrderId));
        } else {
            navigate("/my-orders");
        }
    }, [checkout, dispatch, navigate, orderId, razorpayOrderId]);

    const calculateEstimatedDelivery = (createdAt) => {
        const orderDate = new Date(createdAt);
        orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to the order date
        return orderDate.toLocaleDateString();
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
                Thank You for Your Order!
            </h1>
            {loading ? (
                <p className="text-center text-gray-500">Loading order details...</p>
            ) : error ? (
                <p className="text-center text-red-600">{error}</p>
            ) : (orderDetails || checkout) ? (
                <>
                    {razorpayPaymentId && (
                        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded text-green-700">
                            Payment successful! Razorpay Payment ID: {razorpayPaymentId}
                        </div>
                    )}
                    <div className="p-6 rounded-lg border">
                        <div className="flex justify-between mb-20">
                            {/* Order Id and Date */}
                            <div>
                                <h2 className="text-xl font-semibold">
                                    Order ID: {(orderDetails && orderDetails._id) || (checkout && checkout._id)}
                                </h2>
                                <p className="text-gray-500">
                                    Order date: {new Date((orderDetails && orderDetails.createdAt) || (checkout && checkout.createAt)).toLocaleDateString()}
                                </p>
                            </div>
                            {/* Estimated Delivery */}
                            <div>
                                <p className="text-emerald-700 text-sm">
                                    Estimated Delivery: {" "}
                                    {calculateEstimatedDelivery((orderDetails && orderDetails.createdAt) || (checkout && checkout.createAt))}
                                </p>
                            </div>
                        </div>
                        {/* Ordered Items */}
                        <div className="mb-20">
                            {Array.isArray(orderDetails?.orderItems) && orderDetails.orderItems.length > 0 ? (
                                orderDetails.orderItems.map((item) => (
                                    <div key={item.productId || item._id || item.name} className="flex items-center mb-4">
                                        <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md mr-4" />
                                        <div>
                                            <h4 className="text-md font-semibold">{item.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {item.color} | {item.size}
                                            </p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-md">${item.price}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))
                            ) : Array.isArray(checkout?.checkoutItems) && checkout.checkoutItems.length > 0 ? (
                                checkout.checkoutItems.map((item) => (
                                    <div key={item.productId || item._id || item.name} className="flex items-center mb-4">
                                        <img src={item.image} alt={item.name} className="h-16 w-16 object-cover rounded-md mr-4" />
                                        <div>
                                            <h4 className="text-md font-semibold">{item.name}</h4>
                                            <p className="text-sm text-gray-500">
                                                {item.color} | {item.size}
                                            </p>
                                        </div>
                                        <div className="ml-auto text-right">
                                            <p className="text-md">${item.price}</p>
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No products found for this order.</p>
                            )}
                        </div>
                        {/* Payment and Delivery Info */}
                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Payment</h4>
                                <p className="text-gray-600">Razorpay</p>
                            </div>
                            {/* Delivery Info */}
                            <div>
                                <h4 className="text-lg font-semibold mb-2">Delivery</h4>
                                <p className="text-gray-600">
                                    {(orderDetails && orderDetails.shippingAddress?.address) || (checkout && checkout.shippingAddress?.address)}
                                    {orderDetails && orderDetails.shippingAddress ? (
                                        <>
                                            <br />{orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.postalCode}, {orderDetails.shippingAddress.country}
                                        </>
                                    ) : checkout && checkout.shippingAddress ? (
                                            <>
                                                <br />{checkout.shippingAddress.city}, {checkout.shippingAddress.postalCode}, {checkout.shippingAddress.country}
                                            </>
                                    ) : null}
                                </p>
                            </div>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
};

export default OrderConfirmationPage;