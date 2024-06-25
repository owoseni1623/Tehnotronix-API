const { v4: uuidv4 } = require("uuid");

const handleAnonymousCart = (req, res, next) => {
    if (!req.cookies.cartId) {
        const cartId = uuidv4();
        res.cookie("cartId", cartId, { expire: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),

        });
        req.cardId = cartId;
    }else {
        req.cartId = req.cookies.cartId;
    }

    next();
}

module.exports = handleAnonymousCart;