<template>
  <div>
    <q-bar>
      <q-space />
      <button class="close-popup-btn" v-close-popup>
        <q-icon name="close" size="24px"></q-icon>
      </button>
    </q-bar>
    <q-card-section>
      <div class="cart-container">
        <div class="cart-header-container">
          <div class="col col-1"><span>Sản phẩm</span></div>
          <div class="col col-2">Số lượng</div>
          <div class="col col-3">Giá bán</div>
          <div class="col col-4">Thành tiền</div>
          <div class="col col-5">Thao tác</div>
        </div>
        <div class="cart-body-container">
          <div v-for="(item, index) in cart" class="item-container">
            <div class="col col-1">
              <img class="item-img" :src="item.img" alt="" />
              <div class="item-name">{{ item.name }}</div>
            </div>
            <div class="col col-2">
              <div class="quantity-btn-container">
                <button
                  class="quantity-btn"
                  @click="handleDecreaseProductQuantity(index)"
                >
                  <q-icon
                    name="remove"
                    color="black"
                    size="20px"
                    class="quantity-icon"
                  ></q-icon>
                </button>
                <div class="item-quantity">
                  {{ item.quantity }}
                </div>
                <button
                  class="quantity-btn"
                  @click="handleIncreaseProductQuantity(index)"
                >
                  <q-icon
                    name="add"
                    color="black"
                    size="20px"
                    class="quantity-icon"
                  ></q-icon>
                </button>
              </div>
            </div>
            <div class="col col-3">
              {{ handleFormatPrice(item.pricePerUnit) }}đ
            </div>
            <div class="col col-4">{{ handleFormatPrice(item.price) }}đ</div>
            <div class="col col-5">
              <button
                class="remove-item-btn"
                @click="handleRemoveProductFromCart(index)"
              >
                Bỏ khỏi giỏ hàng
              </button>
            </div>
          </div>
        </div>
        <div class="total-amount-row">
          <div class="">Tổng tiền:</div>
          <div class="">{{ handleFormatPrice(totalPrice) }} VND</div>
          <button class="total-amount-btn payment-btn" @click="handleSell">
            Thanh Toán
          </button>
          <button
            class="total-amount-btn print-invoice-btn"
            @click="handlePrintInvoice"
          >
            In Hóa Đơn
          </button>
        </div>
      </div>
    </q-card-section>
  </div>
</template>

<script>
import { computed, onBeforeMount, ref, watchEffect } from "vue";
import { useToast } from "vue-toastification";
import soldProductService from "../services/soldProduct.service";
import employeeService from "../services/employee.service";

export default {
  props: {
    cart: Array,
    filteredSupplementProducts: Array,
  },
  setup(props, { emit }) {
    const toast = useToast();
    const employeeId = localStorage.getItem("id");
    const employee = ref("");

    const cart = ref(props.cart);

    const totalPrice = computed(() => {
      return cart.value.reduce((total, item) => total + item.price, 0);
    });

    onBeforeMount(async () => {
      employee.value = await employeeService.getEmployeeById(employeeId);
    });

    watchEffect(() => {
      cart.value.forEach(
        (item) => (item.price = item.quantity * item.pricePerUnit)
      );
    });

    function handleIncreaseProductQuantity(index) {
      cart.value[index].quantity++;
    }

    function handleDecreaseProductQuantity(index) {
      if (cart.value[index].quantity > 0) {
        cart.value[index].quantity--;
      }
    }

    function handleRemoveProductFromCart(index) {
      if (index >= 0 && index < cart.value.length) cart.value.splice(index, 1);
    }

    async function handleSell() {
      try {
        const soldPro = await soldProductService.createSoldProduct(cart.value);

        cart.value.forEach((cartItem) => {
          const product = props.filteredSupplementProducts.map((product) => {
            if (product.id === cartItem.supplementProductId) {
              product.totalSold += cartItem.quantity;
            }
          });
        });
        toast.success("Đã bán", {
          timeout: 1000,
        });
      } catch (e) {
        console.log(e);
        toast.error("Lỗi bán");
      }
    }

    function handlePrintInvoice() {
      const cartItemsHtml = cart.value
        .map(
          (item) => `
            <div>
              <div class="row-name">${item.name}</div>
              <div class="row-below-name">
                <div class="col col-1">${item.quantity}</div>
                <div class="col col-2">${item.pricePerUnit} VND</div>
                <div class="col col-3">${item.price} VND</div>
              </div>
            </div>
          `
        )
        .join("");

      const printContent = `
          <div id="invoiceContent">
            <div class="invoice-title-container">
              <div class="title1">Gym4</div>
              <div class="title2">Phiếu thanh toán</div>
              <div class="title3">
                Nhân viên: ${employee.value.profile.fullName}
              </div>
            </div>
            <div class="header-invoice-table">
              <div class="col col-1">SL</div>
              <div class="col col-2">Giá bán</div>
              <div class="col col-3">Thành tiền</div>
            </div>
            <div class="body-invoice-table">
              ${cartItemsHtml}
            </div>
            <div class="total-amount">
              <div class="col">Tổng tiền:</div>
              <div class="col">${totalPrice.value} VND</div>
            </div>
          </div>`;

      const printWindow = window.open("", "", "width=900,height=600");

      printWindow.document.write(`
          <html>
            <head>
              <title>In Hóa Đơn</title>
              <style>
                body {
                  font-family: Arial, sans-serif;
                  font-size: 30px;
                  font-weight: bold;
                }

                .title1 {
                  display: flex;
                  justify-content: start;
                  font-size: 35px;
                }

                .title2 {
                  display: flex;
                  justify-content: center;
                  font-size: 40px;
                  margin-top: 10px;
                  margin-bottom: 10px;
                }

                .title3 {
                  font-size: 30px;
                  font-weight: 400;
                }

                .header-invoice-table {
                  display: flex;
                  font-weight: bold;
                  font-size: 31px;
                  margin-top: 10px;
                  margin-bottom: 5px;
                  border-top: dashed 1px black;
                  padding-top: 10px;
                }

                .row-below-name {
                  display: flex;
                  justify-content: end;
                  margin-bottom: 5px;
                }

                .total-amount {
                  margin-top: 20px;
                  padding-top: 10px;
                  border-top: dashed 1px black;
                  display: flex;
                }

                .col {
                  flex: 1;
                  display: flex;
                  justify-content: end;
                }

                .col-1 {
                  flex: 1;
                  display: flex;
                  justify-content: center;
                }

                .col-2 {
                  flex: 3;
                }

                .col-3 {
                  flex: 2;
                }
              </style>
            </head>
            <body>
              ${printContent}
            </body>
          </html>
        `);

      printWindow.document.close();
      printWindow.focus();
      printWindow.print();  
    }

    function handleFormatPrice(value) {
      if (!value) return "0";
      return value.toLocaleString("vi-VN");
    }
    return {
      cart,

      totalPrice,

      handleIncreaseProductQuantity,
      handleDecreaseProductQuantity,
      handleRemoveProductFromCart,
      handleSell,
      handlePrintInvoice,
      handleFormatPrice,
    };
  },
};
</script>

<style scoped>
.cart-dialog-container {
  background: rgb(245, 245, 245);
}
.close-popup-btn {
  display: flex;
  align-items: center;
  justify-content: end;
  padding: 4px 0;
  width: 40px;
  border: none;
  cursor: pointer;
  background: none;
  color: rgb(40, 40, 40);
}
.cart-container {
  position: relative;
  .cart-header-container {
    background: white;
    border-radius: 4px;
    box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
      rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
    font-size: 16px;
    display: flex;
    color: rgb(40, 40, 40);
    font-weight: 300;
    margin-bottom: 10px;
    padding: 14px 30px;
  }

  .cart-body-container {
    background: white;
    border-radius: 4px;
    box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
      rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
    padding: 20px 30px;
  }
  .cart-body-container .item-container {
    display: flex;
    padding: 20px 0;

    border-bottom: 1px solid rgb(200, 200, 200);
  }
}

.col {
  display: flex;
  justify-content: center;
}
.col-1 {
  flex: 5;
  justify-content: start;

  span {
    margin-left: 30px;
  }
  .item-img {
    width: 80px;
    height: 80px;
    margin-left: 30px;
    margin-right: 10px;
  }
  .item-name {
    padding: 10px;
  }
}
.col-2,
.col-3,
.col-4,
.col-5 {
  flex: 2;
  display: flex;
  align-items: center;
}

.quantity-btn-container {
  display: flex;
  width: 100%;
  height: 35px;
  padding: 0 10px;

  .quantity-btn {
    flex: 1;
    border: none;
    background: white;
    border: 1px solid rgba(128, 128, 128, 0.5);
    cursor: pointer;
  }
  .quantity-btn:hover {
    background: rgb(245, 245, 245);
  }

  .item-quantity {
    flex: 3;
    display: flex;
    justify-content: center;
    font-size: 20px;
    border: 1px solid rgba(128, 128, 128, 0.5);
  }
}

.col-5 .remove-item-btn {
  border: 1px solid rgba(128, 128, 128, 0.5);
  width: 150px;
  height: 40px;
  font-size: 16px;
  font-weight: 400;
  color: white;
  cursor: pointer;
  background: white;
  color: black;
}
.col-5 .remove-item-btn:hover {
  border: 1px solid rgb(230, 37, 37);

  color: rgb(230, 37, 37);
}

.total-amount-row {
  position: sticky;
  bottom: 0px;
  margin-top: 20px;
  padding: 20px 30px;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 20px;

  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
  background: white;

  .total-amount-btn {
    border: none;
    border-radius: 3px;
    width: 150px;
    height: 40px;
    font-size: 17px;
    font-weight: 500;
    color: white;
    cursor: pointer;
  }
  .payment-btn {
    background: rgb(230, 37, 37);
  }
  .payment-btn:hover {
    background: rgb(245, 0, 0);
  }
  .print-invoice-btn {
    background: rgb(20, 161, 20);
  }
  .print-invoice-btn:hover {
    background: rgb(0, 190, 0);
  }
}
</style>
