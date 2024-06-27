const { v4: uuidv4 } = require("uuid");
const Cart = require("../models/Cart");
const Order = require("../models/order");

const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

// exports.initiatePayment = async(req, res) => {
//     const {user} = req;
//     const {amount, currency, firstName, lastName, phone, address} = req.body

//     try {
//         const cart = await Cart.findOne({user: user.id}).populate("products.product")
//         if (!cart || cart.products.length === 0) {
//             res.json("Your cart is empty")
//         }

//         const orderId = uuidv4()

//          const paymentData = {
//             tx_ref: orderId,
//             amount,
//             currency,
//             redirect_url: "http://localhost:5173/thanks",
//             customer: {
//                 email: user.email,
//                 name: `${user.firstName} ${user.lastName}`
//             },
//             meta: {
//                 firstName: firstName,
//                 lastName: lastName,
//                 phone: phone,
//                 address: address
//             },
//             customization: {
//                 title: "Technotronix Purchase",
//                 description: "Payment for items in cart"
//             }
//          }
//          const response = await fetch("https://api.flutterwave.com/v3/payments", {
//             method: "POST",
//             headers: {
//                 Authorization: `Bearer ${FLW_SECRET_KEY}`,
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify(paymentData)
//          })

//          const data = await response.json()
//          if (data.status === "success") {
//             res.json({link: data.data.link, orderId})
//          }else {
//             res.json("Payment Initiation Failed")
//          }
//     } catch (error) {
//         res.json("server error")
//     }
// };

exports.initiatePayment = async (req, res) => {
    const { user } = req;
    const { amount, currency, firstName, lastName, phone, address } = req.body;
  
    try {
      const cart = await Cart.findOne({ user: user.id }).populate(
        "products.product"
      );
      if (!cart || cart.products.length === 0) {
        res.json("Your cart is empty");
      }
  
      const orderId = uuidv4();
  
      const paymentData = {
        tx_ref: orderId,
        amount,
        currency,
        redirect_url: "https://tehnotronix-frontend.vercel.app/thanks",
        customer: {
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        },
        meta: {
          firstName: firstName,
          lastName: lastName,
          phone: phone,
          address: address,
        },
        customizations: {
          title: "Technotronix Purchase",
          description: "Payment for items in cart",
        },
      };
  
      const response = await fetch("https://api.flutterwave.com/v3/payments", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });
  
      const data = await response.json();
      console.log(data);
      if (data.status === "success") {
        res.json({ link: data.data.link, orderId });
      } else {
        res.json("Payment Initiation Failed");
      }
    } catch (error) {
      res.json("server error");
      console.log(error);
  }
  };

exports.verifyPayment = async (req, res) => {
  const { transaction_id, orderId } = req.body;
  const user = req.user.id;

  try {
    const response = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${FLW_SECRET_KEY}`,
        },
      }
    );

    const data = await response.json();
    if (data.status === "success") {
      const cart = await Cart.findOne({ user: req.user.id }).populate(
        "products.product"
      );

      const order = new Order({
        user: user,
        orderId,
        firstName: data.data.meta.firstName,
        lastName: data.data.meta.lastName,
        phone: data.data.meta.phone,
        address: data.data.meta.address,
        product: cart.product,
        amount: data.data.amount,
        status: "completed",
        transactionId: transaction_id,
      });

      await order.save();
      await Cart.findOneAndDelete({ user: req.user.id });

      res.json({ msg: "Payment Successful", order });
    } else {
      res.json({ msg: "Payment verification failed" });
    }
  } catch (error) {
    console.error(error.message);
  }
};
