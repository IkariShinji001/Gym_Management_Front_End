<template>
  <div class="page-container">
    <div class="search-add-div">
      <q-input class="search-bar" outlined v-model="searchText" label="Search">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn class="header-btn" @click="isAddProductFormVisible = true">
        <q-item-label class="header-btn-title">Sản phẩm</q-item-label>
        <q-icon name="add_circle" class="header-icon" size="35px" />
      </q-btn>

      <!-- btn-drop -->
      <q-btn-dropdown
        class="header-btn"
        flat
        size="20px"
        label="Loại"
        dropdown-icon="settings"
      >
        <q-list>
          <q-item
            class="header-btn-item"
            clickable
            v-close-popup
            @click="isAddTypeFormVisible = true"
          >
            <q-item-section>
              <q-item-label class="item-label">Thêm loại</q-item-label>
            </q-item-section>
          </q-item>
          <q-item
            clickable
            v-close-popup
            @click="isRemoveTypeFormVisible = true"
            class="header-btn-item"
          >
            <q-item-section>
              <q-item-label class="item-label">Cập nhật loại</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!-- btn-drop -->

      <q-btn class="header-btn">
        <router-link class="chart-link" to="supplement-products/charts">
          <q-item-label class="header-btn-title">Thống kê</q-item-label>
          <q-icon name="query_stats" class="header-icon" size="35px" />
        </router-link>
      </q-btn>
    </div>

    <div class="product-type">
      <q-btn
        class="btn-type"
        @click="fileterProductsByTypeIdHandler(-1)"
        style="background-color: teal; color: white"
      >
        Tất cả
      </q-btn>
      <div
        v-for="(type, index) in types.slice(0, 3)"
        :key="index"
        class="btn-type-container"
      >
        <q-btn class="btn-type" @click="fileterProductsByTypeIdHandler(type)">
          {{ type.name }}
        </q-btn>
      </div>

      <q-btn-dropdown v-if="types.length > 3" label="Khác" class="btn-type">
        <q-list>
          <q-item
            v-for="(type, index) in types.slice(3)"
            clickable
            v-close-popup
            :key="index"
            :value="type.name"
            @click="fileterProductsByTypeIdHandler(type)"
          >
            <q-item-section>
              <q-item-label>{{ type.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!-- ====== PRODUCT -==========---->
    <!-- ====== PRODUCT -==========---->
    <div class="open-cart-btn-container">
      <button class="btn-open-cart-dialog" @click="isShowCartDialog = true">
        <q-icon size="40px" name="shopping_cart"></q-icon>
      </button>
    </div>
    <div class="q-pa-md product-card-container">
      <div
        v-for="product in filteredSupplementProducts"
        :key="product.id"
        class="product-card"
      >
        <q-card class="product-p-card">
          <q-img :src="product.imageUrl" class="product-card-img" />
          <q-card-section>
            <div class="row no-wrap items-center">
              <div class="col text-h6 ellipsis">
                {{ product.name }}
              </div>
              <button
                class="product-edit-btn"
                @click="confirmRemoveProduct(product.id)"
              >
                <q-icon
                  name="cancel"
                  class="remove-icon"
                  size="20px"
                  color="black"
                ></q-icon>
              </button>
              <button
                class="product-edit-btn"
                @click="openUpdateProductForm(product)"
              >
                <q-icon
                  name="edit"
                  class="update-icon"
                  size="20px"
                  color="black"
                ></q-icon>
              </button>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-none hmm">
            <div class="cost-sold">
              <div class="text-subtitle1">Giá: {{ product.price }}</div>
              <i class="text-subtitle1" style="color: gray; text-decoration: ">
                Đã bán: {{ product.totalSold }}
              </i>
            </div>
            <div class="sell-container">
              <div class="amount-edit-btns-container">
                <button
                  class="amount-btn"
                  @click="decreaseAmountHandler(product.id)"
                >
                  <q-icon
                    name="remove"
                    color="black"
                    size="20px"
                    class="amount-icon"
                  ></q-icon>
                </button>
                <h6 class="amount-btn">{{ amountProductList[product.id] }}</h6>
                <button
                  class="amount-btn"
                  @click="increaseAmountHandler(product.id)"
                >
                  <q-icon
                    name="add"
                    color="black"
                    size="20px"
                    class="amount-icon"
                  ></q-icon>
                </button>
              </div>
              <button class="add-to-cart-btn" @click="addToCart(product)">
                <q-icon name="shopping_cart" size="24px"> </q-icon>
              </button>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- ====== Dialog -==========---->
    <!-- ====== Dialog -==========---->
    <q-dialog v-model="isAddProductFormVisible">
      <q-card>
        <AddProductForm @getNewProduct="getNewProduct"> </AddProductForm>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isAddTypeFormVisible">
      <q-card>
        <AddTypeForm
          v-if="isAddTypeFormVisible"
          @getNewType="getNewType"
          :typeList="types"
        >
        </AddTypeForm>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isRemoveTypeFormVisible">
      <q-card>
        <UpdateTypeForm
          v-if="isRemoveTypeFormVisible"
          :typeList="types"
          @deletedType="deletedTypeHandler"
        >
        </UpdateTypeForm>
      </q-card>
    </q-dialog>
    <q-dialog v-model="isUpdateProductFormVisible">
      <q-card>
        <UpdateProductForm
          v-if="isUpdateProductFormVisible"
          :productData="selectedProduct"
          @filterAfterUpdate="filterAfterUpdate"
        ></UpdateProductForm>
      </q-card>
    </q-dialog>

    <q-dialog v-model="showConfirmDialog">
      <q-card>
        <q-card-section>
          <div class="text-h6">Xác nhận xóa</div>
          <div>Bạn có chắc chắn muốn xóa sản phẩm này không?</div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Không" color="primary" v-close-popup />
          <q-btn
            flat
            label="Có"
            color="negative"
            @click="removeProduct"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog :maximized="true" v-model="isShowCartDialog">
      <q-card class="cart-dialog-container">
        <CartDialog
          :cart="cart"
          :filteredSupplementProducts="filteredSupplementProducts"
        ></CartDialog>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { ref, watchEffect, onBeforeMount, computed, reactive } from "vue";
import { useToast } from "vue-toastification";

import supplementProductService from "../services/supplementProduct.service";
import typeService from "../services/type.service";
import AddProductForm from "../components/AddProductForm.vue";
import AddTypeForm from "../components/AddTypeForm.vue";
import UpdateTypeForm from "../components/UpdateTypeForm.vue";
import UpdateProductForm from "../components/UpdateProductForm.vue";
import CartDialog from "../components/CartDialog.vue";

export default {
  components: {
    AddProductForm,
    AddTypeForm,
    UpdateTypeForm,
    UpdateProductForm,
    CartDialog,
  },

  setup() {
    const toast = useToast();
    const searchText = ref("");
    const selectedProduct = ref(null);
    const isAddProductFormVisible = ref(false);
    const isAddTypeFormVisible = ref(false);
    const isRemoveTypeFormVisible = ref(false);
    const isUpdateProductFormVisible = ref(false);
    const isShowCartDialog = ref(false);
    const showConfirmDialog = ref(false);
    const supplementProducts = ref([]);
    const types = ref([]);
    const cart = ref([]);
    const filteredSupplementProducts = ref([]);

    const employeeId = localStorage.getItem("id")
    const selectedProductId = ref(null);
    const soldProductPayload = reactive({
      img: "",
      name: "",
      supplementProductId: 0,
      profileId: 0,
      quantity: 0,
      pricePerUnit: 0,
      price: 0,
    });

    const amountProductList = ref([]);
    const totalPrice = computed(() => {
      return cart.value.reduce((total, item) => total + item.price, 0);
    });

    onBeforeMount(async () => {
      try {
        types.value = await typeService.getAllType();
        supplementProducts.value =
          await supplementProductService.getAllSupplementProduct();

        supplementProducts.value.forEach((product) => {
          amountProductList.value[product.id] = 0;
        });
        filteredSupplementProducts.value = supplementProducts.value;
      } catch (e) {
        console.log(e);
      }
    });

    watchEffect(() => {
      filteredSupplementProducts.value.forEach((product) => {
        if (!amountProductList.value.hasOwnProperty(product.id)) {
          amountProductList.value[product.id] = 0;
        }
      });
    });

    watchEffect(() => {
      filterProductsBySearchText();
    });
    function filterProductsBySearchText() {
      if (!searchText.value) {
        filteredSupplementProducts.value = supplementProducts.value;
      } else {
        filteredSupplementProducts.value = supplementProducts.value.filter(
          (product) =>
            product.name.toLowerCase().includes(searchText.value.toLowerCase())
        );
      }
    }

    async function fileterProductsByTypeIdHandler(type) {
      if (type < 0) {
        filteredSupplementProducts.value = supplementProducts.value;
      } else {
        filteredSupplementProducts.value =
          await supplementProductService.getAllByType(type.id);
      }
    }

    function filterAfterUpdate(product) {
      isUpdateProductFormVisible.value = false;
      filteredSupplementProducts.value =
        filteredSupplementProducts.value.filter((pro) => pro.id != product.id);

      filteredSupplementProducts.value.push(product);
    }

    function openUpdateProductForm(product) {
      isUpdateProductFormVisible.value = !isUpdateProductFormVisible.value;
      selectedProduct.value = product;
    }

    function confirmRemoveProduct(id) {
      selectedProductId.value = id;
      showConfirmDialog.value = true;
    }
    async function removeProduct() {
      await supplementProductService.deleteProduct(selectedProductId.value);
      filteredSupplementProducts.value =
        filteredSupplementProducts.value.filter(
          (product) => product.id != selectedProductId.value
        );
    }
    function getNewProduct(product) {
      isAddProductFormVisible.value = false;
      supplementProducts.value.push(product);
    }
    function getNewType(type) {
      isAddTypeFormVisible.value = false;
      types.value.push(type);
    }
    function deletedTypeHandler(id) {
      types.value = types.value.filter((type) => type.id !== id);
    }

    function increaseAmountHandler(productId) {
      if (amountProductList.value[productId] !== undefined) {
        amountProductList.value[productId]++;
      }
    }

    function decreaseAmountHandler(productId) {
      if (
        amountProductList.value[productId] !== undefined &&
        amountProductList.value[productId] > 0
      ) {
        amountProductList.value[productId]--;
      }
    }

    function addToCart(product) {
      try {
        const res = cart.value.filter(
          (item) => item.supplementProductId === product.id
        );

        if (res.length === 0) {
          soldProductPayload.img = product.imageUrl;
          soldProductPayload.name = product.name;
          soldProductPayload.profileId = employeeId;
          soldProductPayload.supplementProductId = product.id;
          soldProductPayload.quantity = amountProductList.value[product.id];
          soldProductPayload.pricePerUnit = product.price;
          soldProductPayload.price =
            soldProductPayload.quantity * product.price;

          cart.value.push({ ...soldProductPayload });
        } else {
          cart.value.map((item) => {
            if (item.supplementProductId === product.id) {
              item.quantity += amountProductList.value[product.id];
            }
          });
        }

        toast.success("Sản phẩm đã được thêm vào giỏ hàng", {
          timeout: 1000,
        });
        amountProductList.value[product.id] = 0;
      } catch (e) {
        console.log(e);
        console.log("== Loi add2cart ==");
      }
    }

    

    return {
      searchText,
      supplementProducts,
      types,
      selectedProduct,
      openUpdateProductForm,
      removeProduct,
      isAddProductFormVisible,
      isAddTypeFormVisible,
      isRemoveTypeFormVisible,
      isUpdateProductFormVisible,
      showConfirmDialog,
      isShowCartDialog,

      getNewProduct,
      getNewType,
      deletedTypeHandler,
      fileterProductsByTypeIdHandler,
      filteredSupplementProducts,
      cart,

      filterAfterUpdate,
      confirmRemoveProduct,
      amountProductList,
      increaseAmountHandler,
      decreaseAmountHandler,

      addToCart,
      totalPrice,
   
    };
  },
};
</script>

<style scoped>
/* =======  Search vs btn (header)  ===============
==========  Search vs btn (header)  ==================*/
.page-container {
  width: 100%;
  height: 100%;
  padding: 20px;

  .search-add-div {
    display: flex;
    justify-content: end;

    .search-bar {
      width: 40%;
      margin-right: 20px;
      background-color: white;
    }

    .header-btn {
      height: 53px;
      margin-right: 10px;

      color: white;
      background-color: var(--icon-color);
      border-radius: 0 0;
      box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
        rgba(0, 0, 0, 0.5) 0px 7px 13px -3px,
        rgba(0, 0, 0, 0.2) 0px -3px 0px inset;

      .header-btn-title {
        font-size: 20px;
        margin-right: 10px;
      }

      .header-icon {
        color: rgb(255, 255, 255);
      }

      .chart-link {
        display: flex;
        align-items: center;
        text-decoration: none;
        color: white;
      }
    }

    .header-btn:hover {
      background: #ff8512;
      box-shadow: rgba(155, 155, 155, 0.4) 0px 2px 4px,
        rgba(0, 0, 0, 0.3) 0px 7px 13px -3px,
        rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
    }
  }
}

.header-btn-item .item-label {
  color: var(--icon-color);
  font-size: 16px;
  font-weight: bold;
}

.remove-icon,
.update-icon {
  color: var(--icon-color) !important;
}

.open-cart-btn-container .btn-open-cart-dialog {
  color: white;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  position: fixed;
  bottom: 20px;
  right: 20px;
  cursor: pointer;
  background: var(--icon-color);
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.5) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
  z-index: 99;
}

.open-cart-btn-container .btn-open-cart-dialog:hover {
  width: 58px;
  height: 58px;
  background: rgb(255, 153, 0);
  box-shadow: rgba(170, 170, 170, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

/* =======  Product Type  ===============
==========  Product Type  ==================*/
.product-type {
  margin-top: 10px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-type {
  min-width: 100px;
  border-radius: 0;
  width: fit-content;
}

.product-type-drawer-open {
  display: flex;
  align-items: center;
  justify-content: center;
}

/* =======  Product Card  ===============
==========  Product Card  ==================*/
.product-card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, min(235px));
  gap: 10px;
  justify-content: center;
}

.product-card-container .product-card .product-p-card {
  margin-right: 10px;
  margin-top: 15px;
  background-color: rgba(220, 220, 220, 0.15);

  .product-card-img {
    height: 100px;
    border-radius: 5px;
  }

  .product-edit-btn {
    border: none;
    background: none;
    color: var(--icon-color);
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-right: 2px;
  }

  .product-edit-btn:hover {
    border: 1px solid var(--icon-color);
  }
}

.sell-container {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;

  .amount-edit-btns-container {
    display: flex;
  }

  .amount-btn {
    background: none;
    border: 1px solid rgb(201, 201, 201);
    width: 35px;
    margin: 0 0;
    text-align: center;
    padding: 0 0;
    cursor: pointer;
  }
  .amount-btn:hover {
    border: 1px solid rgb(120, 120, 120);
  }
}

.sell-container .add-to-cart-btn {
  border: none;
  border-radius: 2px;
  background: var(--icon-color);
  width: 60px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.sell-container .add-to-cart-btn:hover {
  background: #ff882d;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 2px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.1) 0px -3px 0px inset;
}

.cost-sold {
  display: flex;
  justify-content: space-between;
}
</style>
