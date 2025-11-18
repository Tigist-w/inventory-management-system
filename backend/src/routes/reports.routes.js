router.get("/sales-summary", requireAuth, async (req, res) => {
  const summary = await Sale.aggregate([
    {
      $group: { _id: null, totalSales: { $sum: "$total" }, count: { $sum: 1 } },
    },
  ]);
  res.json(summary[0]);
});
