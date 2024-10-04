import api from "./api.service";

class StatisticsService {
  async revenueByDayFromBills(startDate, endDate) {
    return (
      await api.get("revenue-by-day-from-bills", {
        params: { startDate: startDate, endDate: endDate },
      })
    ).data;
  }

  async revenueByYearFromBills(year) {
    return (
      await api.get("revenue-by-year-from-bills", { params: { year: year } })
    ).data;
  }

  async getTop10UsersBySpendingOfMonth(month, year) {
    return (
      await api.get("get-top-10-users-by-spending-of-month", { params: { month: month, year: year}})
    )
  }

  async getTop10UsersBySpendingOfYear(year) {
    return (
      await api.get("get-top-10-users-by-spending-of-year", { params: { year: year } })
    ).data;
  }

  async getTopPurchasedPackagesOfMonth(month, year) {
    return (
      await api.get("get-top-purchased-packages-of-month", { params: { month: month, year: year}})
    )
  }

  async getTopPurchasedPackagesOfYear(year) {
    return (
      await api.get("get-top-purchased-packages-of-year", { params: { year: year } })
    ).data;
  }

  
}
export default new StatisticsService();
