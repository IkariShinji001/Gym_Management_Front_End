<template>
  <div>
    <div class="circle"><q-icon class="check" name="done_outline"></q-icon></div>
    <p>Thanh toán thành công</p>
  </div>
</template>

<script setup>
  import { onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import billService from '../services/bill.service';
  import voucherService from '../services/voucher.service';
  const route = useRoute();
  const billId = route.query.bill_id;
  const userId = route.query.user_id;
  const userInvitedId = route.query.user_invited_id;

  onMounted(async () => {
    if (userInvitedId) {
      try {
        const res1 = await voucherService.createVoucher(userId, { discount: 10000, endDate: '2025-12-12', discountType: "fixed", minAmount: 0 })
        const res2 = await voucherService.createVoucher(userInvitedId, { discount: 10000, endDate: '2025-12-12', discountType: "fixed", minAmount: 0 })
      } catch (error) {
        console.log(error)
      }
    }

    if (billId) {
      try {
        const res = await billService.updateBill(billId, "PAID");
        console.log(res);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error("Bill ID không tồn tại trong query parameters.");
    }
  });
</script>


<style scoped>
  .check {
    color: green;
    font-size: 50px;
  }

  .circle {
    width: 100px;
    height: 100px;
    border-radius: 100%;
    border: 3px solid #056d08cc;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 200px;
  }

  p {
    text-align: center;
    font-size: 20px;
    margin-top: 10px;
  }



</style>