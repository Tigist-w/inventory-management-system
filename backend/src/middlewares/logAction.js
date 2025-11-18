// backend/src/middlewares/logAction.js
const StockLog = require("../models/StockLog");

function logAction(actionName, opts = {}) {
  // opts: { takeBodySnapshot: true, productIdPath: 'body.productId' }
  return async (req, res, next) => {
    try {
      const userId = req.user?.id || req.user?._id || null;
      // allow explicit product id from options or default to req.body.productId or req.params.id
      const productId =
        opts.productId || req.body?.productId || req.params?.id || null;

      // build small safe body snapshot (omit sensitive fields)
      let bodySnapshot = null;
      if (opts.takeBodySnapshot) {
        const body = { ...req.body };
        // remove common sensitive fields if present
        delete body.password;
        delete body.passwordHash;
        bodySnapshot = body;
      }

      await StockLog.create({
        product: productId,
        type: opts.type || "action",
        quantity:
          req.body && req.body.quantity ? Number(req.body.quantity) : undefined,
        note: actionName, // human readable action
        user: userId,
        source: req.originalUrl || req.url,
        meta: {
          method: req.method,
          url: req.originalUrl || req.url,
          ip: req.ip,
          body: bodySnapshot,
          timestamp: new Date(),
        },
      });
    } catch (err) {
      // do not block main request if logging fails
      console.error("Action logging failed:", err);
    } finally {
      next();
    }
  };
}

module.exports = logAction;
