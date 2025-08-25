const Order = require('../../models/order.model')
const variableConfig = require('../../config/variable.config')
const moment = require('moment')
module.exports.dashboard = async (req, res) => {
  const orderTotal = await Order.countDocuments({})
  const revenueList = await Order.find({
    paymentStatus: 'paid'
  })
  .select('total')
  const revenueTotal = revenueList.reduce((sum, item) => sum+item.total ,0)
  const limitItem = 5
  const newestOrder = await Order
  .find({})
  .sort({
    createdAt: 'desc'
  })
  .limit(limitItem)
  if(newestOrder) {
    for(const order of newestOrder) {
      order.statusName = variableConfig.orderStatus.find((status) => status.value==order.status).label
      order.paymentStatusName = variableConfig.paymentStatus.find((status) => status.value==order.paymentStatus).label
      order.paymentMethodName = variableConfig.paymentMethod.find((method) => method.value==order.paymentMethod).label
      order.hourCreatedFormat = moment(order.createdAt).format('HH:mm')
      order.dateCreatedFormat = moment(order.createdAt).format('DD/MM/YYYY')
    }
  }
  res.render(`admin/pages/dashboard.pug`, {
    pageTitle: "Tổng quan",
    orderTotal: orderTotal,
    revenueTotal: revenueTotal,
    newestOrder: newestOrder
  })
}

module.exports.revenueChartPost = async (req, res) => {
  const {currentMonth, currentYear, previousMonth, previousYear, arrayDay} = req.body
  const ordersCurrentMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(currentYear, currentMonth - 1, 1),
      $lt: new Date(currentYear, currentMonth, 1)
    }
  })
  const ordersPreviousMonth = await Order.find({
    deleted: false,
    createdAt: {
      $gte: new Date(previousYear, previousMonth - 1, 1),
      $lt: new Date(previousYear, previousMonth, 1)
    }
  })
  const dataMonthCurrent = [];
  const dataMonthPrevious = [];

  for (const day of arrayDay) {
    // Tính tổng doanh thu theo từng ngày của tháng này
    let totalCurrent = 0;
    for (const order of ordersCurrentMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if(day == orderDate) {
        totalCurrent += order.total;
      }
    }
    dataMonthCurrent.push(totalCurrent);

    // Tính tổng doanh thu theo từng ngày của tháng trước
    let totalPrevious = 0;
    for (const order of ordersPreviousMonth) {
      const orderDate = new Date(order.createdAt).getDate();
      if(day == orderDate) {
        totalPrevious += order.total;
      }
    }
    dataMonthPrevious.push(totalPrevious);
  }

  res.json({
    code: "success",
    dataMonthCurrent: dataMonthCurrent,
    dataMonthPrevious: dataMonthPrevious
  });
}