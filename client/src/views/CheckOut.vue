<template>
  <div class="container">
    <h4>Thanh toán</h4>
    <div class="packages">
      <div v-for="(pkg, index) in packagePrices" class="package">
        <div class="seperate">
        </div>

        <div class="content">
          <p class="name">{{ pkg.servicePackageName }}</p>
          <p class="price">{{ formatPrice(pkg.price) }}</p>
        </div>
        <div class="info">
          <p>Thời hạn: {{ pkg.duration }} {{ switchDateEngToViet(pkg.durationType) }}</p>
          <p>{{ getTimeNow() }} {{ getEndTime(new Date(), pkg.durationType, pkg.duration, 'DD/MM/YYYY') }}</p>
        </div>
      </div>
    </div>

    <div>
      <h5><q-icon name="confirmation_number"></q-icon> Voucher - Mã giảm giá</h5>
      <div class="voucher">
        <div class="voucher-text" v-if="!voucherSelected">Bạn chưa áp dụng mã giảm giá nào</div>
        <div class="voucher-text" v-else>{{ getVoucherTitle(voucherSelected.discountType, voucherSelected.discount) }}
        </div>
        <div><q-icon @click="openVoucherDialog = true" class="voucher-icon" name="arrow_forward_ios"></q-icon></div>
      </div>

    </div>

    <div>

      <h5> <q-icon class="icon-title" name="paid"></q-icon> Phương thức thanh toán</h5>
      <q-select v-model="paymentMethodSelected" :options="paymentMethodOptions" borderless>
        <template v-slot:selected-item="scope">
          <img class="img-logo" :src="scope.opt.logo" />
          <span class="opt-label">{{ scope.opt.label }}</span>
        </template>
        <template v-slot:option="scope">
          <q-item v-bind="scope.itemProps" class="custom-option">
            <q-item-section avatar>
              <img class="img-logo" :src="scope.opt.logo" />
            </q-item-section>
            <q-item-section>
              <span class="opt-label">{{ scope.opt.label }}</span>
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    </div>

    <div>
      <h5><q-icon name="payments"></q-icon> Chi tiết thanh toán</h5>
      <table>
        <tr>
          <td>Tổng tiền gói tập</td>
          <td>{{ formatPrice(totalAmount) }}</td>
        </tr>
        <tr>
          <td>Voucher giảm giá</td>
          <td>{{ voucherSelected ? '- ' + formatPrice(getVoucherDiscount(voucherSelected.discountType,
            voucherSelected.discount)) :
            formatPrice(0) }}
          </td>
        </tr>
        <tr>
          <td>Tổng tiền thanh toán</td>
          <td>{{ voucherSelected ? formatPrice(totalAmount - getVoucherDiscount(voucherSelected.discountType,
            voucherSelected.discount)) : formatPrice(totalAmount) }}</td>
        </tr>
      </table>
    </div>
  </div>
  <div class="checkout">
    <div>
      <p class="checkout-title">Tổng thanh toán</p>
      <p class="checkout-total">{{ voucherSelected ? formatPrice(totalAmount -
        getVoucherDiscount(voucherSelected.discountType,
          voucherSelected.discount)) : formatPrice(totalAmount) }}</p>
    </div>
    <q-btn class="btn-checkout" @click="handleCreateBill">THANH TOÁN</q-btn>
  </div>
  <q-dialog v-model="openVoucherDialog">
    <q-card style="min-width: 370px;">
      <q-tabs v-model="tab" dense class="text-grey" active-color="primary" indicator-color="primary" align="justify"
        narrow-indicator>
        <q-tab name="active" label="Còn thời hạn" />
        <q-tab name="inactive" label="Không khả dụng" />
      </q-tabs>
      <q-separator />
      <q-tab-panels v-model="tab" animated>
        <q-tab-panel name="active">
          <q-item tag="label" v-ripple v-for="voucher in activeVoucher">
            <q-item-section>
              <q-item-label>{{ getVoucherTitle(voucher.discountType, voucher.discount) }}</q-item-label>
              <p class="min">Ngày hết hạn: {{ formatTime(voucher.endDate) }}</p>
              <p class="min">Giá trị tối thiểu: {{ formatPrice(voucher.minAmount) }}</p>
            </q-item-section>
            <q-item-section avatar>
              <q-radio v-model="voucherSelected" :val="voucher" color="teal" />
            </q-item-section>
          </q-item>
        </q-tab-panel>

        <q-tab-panel name="inactive">
          <div class="text-h6">Movies</div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </q-dialog>
</template>

<script setup>
  import { onBeforeMount, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router'
  import servicePackagePriceService from '../services/servicePackagePrice.service';
  import voucherService from '../services/voucher.service';
  import billService from '../services/bill.service';

  const router = useRouter()
  const route = useRoute();
  const fitnessPriceId = route.query?.fitnessPriceId;
  const ptPriceId = route.query?.ptPriceId;
  const listPriceIds = ref([]);
  const packagePrices = ref([]);
  const paymentMethodOptions = ref([
    { label: 'Stripe', logo: 'https://cdn.brandfetch.io/stripe.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1717858517316' },
    { label: 'Momo', logo: 'https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png' },
    { label: 'VNpay', logo: 'https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg' }
  ]);
  const paymentMethodSelected = ref({ label: 'Stripe', logo: 'https://cdn.brandfetch.io/stripe.com/fallback/transparent/theme/dark/h/512/w/512/icon?t=1717858517316' });
  const openVoucherDialog = ref()
  const tab = ref('active')
  const vouchers = ref([]);
  const activeVoucher = ref([]);
  const inActiveVoucher = ref([]);
  const userId = localStorage.getItem('userId');
  let totalAmount;
  const voucherSelected = ref();


  const getVoucherTitle = (discountType, discount) => {
    if (discountType === 'fixed') {
      return 'Giảm trực tiếp ' + formatPrice(discount);
    } else {
      return 'Giảm trực tiếp ' + discount + '%';
    }
  }

  const handleCreateBill = async () => {
    try {
      if (voucherSelected.value) {
        const res = await billService.createBill(userId, listPriceIds.value, voucherSelected.value.id);
        if (res.url) {
          window.location.href = res.url;
        }
        return;
      }
      const res = await billService.createBill(userId, listPriceIds.value);
      if (res.url) {
        window.location.href = res.url;
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getVoucherDiscount = (discountType, discount) => {
    if (discountType === 'fixed') {
      return discount;
    } else {
      return Math.floor(totalAmount / 100) * discount;
    }
  }

  const formatTime = (time) => {
    const now = new Date(time);
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `${day}-${month}-${year}`;
  };


  const getTimeNow = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();

    return `${day}-${month}-${year}`;
  };

  const formatPrice = (amount) => {
    amount = parseInt(amount)
    const formattedAmount = amount.toLocaleString('vi-VN', {
      style: 'currency',
      currency: 'VND',
    });
    return formattedAmount;
  };


  const getEndTime = (
    timeNow,
    durationType,
    duration,
    typeDate,
  ) => {
    const endTime = new Date(timeNow);

    if (durationType.includes('month')) {
      endTime.setMonth(endTime.getMonth() + duration);
    } else if (durationType.includes('year')) {
      endTime.setFullYear(endTime.getFullYear() + duration);
    } else {
      endTime.setDate(endTime.getDate() + duration);
    }

    const day = String(endTime.getDate()).padStart(2, '0');
    const month = String(endTime.getMonth() + 1).padStart(2, '0');
    const year = endTime.getFullYear();

    if (typeDate === 'DD/MM/YYYY') return `${day}-${month}-${year}`;
    else return `${year}-${month}-${day}`;
  };

  onBeforeMount(async () => {
    if (fitnessPriceId) {
      listPriceIds.value.push({ id: fitnessPriceId });
    }
    if (ptPriceId) {
      listPriceIds.value.push({ id: ptPriceId });
    }

    try {
      packagePrices.value = (await servicePackagePriceService.getPackagePriceByListIds(listPriceIds.value)).servicePackagePriceList;
      totalAmount = packagePrices.value.reduce((sum, p) => sum + parseInt(p.price), 0);
      vouchers.value = await voucherService.getVouchersByUserId(userId);
      vouchers.value.forEach((voucher) => {
        if (voucher.isUsed || voucher.minAmount > totalAmount) {
          inActiveVoucher.value.push(voucher);
        } else {
          activeVoucher.value.push(voucher);
        }
      })

    } catch (error) {
      console.log(error);
    }
  })

  const switchDateEngToViet = (date) => {
    switch (date) {
      case 'year': return 'Năm';
      case 'month': return 'Tháng';
      case 'day': return 'Ngày';
    }
  }


</script>

<style scoped>

  .container {
    width: 95%;
    margin: 0 auto;
  }

  .btn-checkout {
    height: 100%;
    background-color: #D90429;
    color: white;
    font-size: 20px;
    font-weight: bold;
  }

  td {
    font-size: 17px;
  }

  table {
    width: 95%;
  }

  tr {
    display: flex;
    justify-content: space-between;
  }



  h4 {
    text-align: center;
  }

  .packages {
    width: 90%;
    margin: 0 auto;
  }

  .package {
    display: flex;
    background-color: #EDF2F4;
  }

  .checkout-total {
    font-size: 25px;
    margin: 0;
    font-weight: bold;
    color: #D90429;
  }

  .seperate {
    background-color: #D90429;
    width: 10px;
  }

  .content {
    margin-left: 10px;
  }

  .name {
    font-size: 20px;
    font-weight: bold;
  }

  .price {
    color: #D90429;
    font-weight: bold;
    font-size: 18px;
  }

  .info {
    margin-left: 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;

  }

  h5 {
    font-size: 22px;
    margin: 20px 0;
  }

  .img-logo {
    width: 30px;
  }

  .opt-label {
    margin-left: 10px;
  }

  .voucher-icon {
    font-size: 25px;
    margin-left: 120px;
  }

  .voucher {
    display: flex;
    justify-content: space-around;
  }

  .min {
    margin: 0;
  }

  .voucher-text {
    width: 85%;
  }

  .checkout {
    position: fixed;
    bottom: 60px;
    background-color: white;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: end;
    border-top: 5px solid #e0dfdf;
  }

  .checkout-title {
    margin: 0;
    margin-right: 20px;
    font-size: 18px;
  }


</style>