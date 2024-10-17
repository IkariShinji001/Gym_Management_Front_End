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
    <div class="q-pa-md product-card-container">
      <div
        v-for="product in filteredSupplementProducts"
        :key="product.id"
        class="product-card"
      >
        <q-card>
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
                <button class="amount-btn" @click="decreaseAmount(product.id)">
                  <q-icon
                    name="remove"
                    color="black"
                    size="20px"
                    class="amount-icon"
                  ></q-icon>
                </button>
                <h6 class="amount-btn">{{ amounts[product.id] }}</h6>
                <button class="amount-btn" @click="increaseAmount(product.id)">
                  <q-icon
                    name="add"
                    color="black"
                    size="20px"
                    class="amount-icon"
                  ></q-icon>
                </button>
              </div>
              <button
                class="sell-btn"
                @click="sellFunction(product.id, product)"
              >
                <q-icon name="shopping_cart" size="24px"> </q-icon>
              </button>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
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
          @deletedType="deletedType"
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
import soldProductService from "../services/soldProduct.service";

export default {
  components: {
    AddProductForm,
    AddTypeForm,
    UpdateTypeForm,
    UpdateProductForm,
  },

  setup() {
    const toast = useToast();
    const searchText = ref("");
    const selectedProduct = ref(null);
    const isAddProductFormVisible = ref(false);
    const isAddTypeFormVisible = ref(false);
    const isRemoveTypeFormVisible = ref(false);
    const isUpdateProductFormVisible = ref(false);
    const showConfirmDialog = ref(false);
    const supplementProducts = ref([]);
    const types = ref([]);
    const filteredSupplementProducts = ref([]);
    const selectedProductId = ref(null);
    const soldProductPayload = reactive({
      supplementProductId: 0,
      profileId: 0,
      quantity: 0,
      price: 0,
    });

    const amounts = ref({});

    onBeforeMount(async () => {
      try {
        types.value = await typeService.getAllType();
        supplementProducts.value =
          await supplementProductService.getAllSupplementProduct();

        supplementProducts.value.forEach((product) => {
          amounts.value[product.id] = 0;
        });
        filteredSupplementProducts.value = supplementProducts.value;
      } catch (e) {
        console.log(e);
      }
    });

    watchEffect(() => {
      filteredSupplementProducts.value.forEach((product) => {
        if (!amounts.value.hasOwnProperty(product.id)) {
          amounts.value[product.id] = 0;
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
    function deletedType(id) {
      types.value = types.value.filter((type) => type.id !== id);
    }

    function increaseAmount(productId) {
      if (amounts.value[productId] !== undefined) {
        amounts.value[productId]++;
      }
    }

    function decreaseAmount(productId) {
      if (
        amounts.value[productId] !== undefined &&
        amounts.value[productId] > 0
      ) {
        amounts.value[productId]--;
      }
    }

    async function sellFunction(productId, product) {
      try {
        soldProductPayload.profileId = 1;
        soldProductPayload.supplementProductId = productId;
        soldProductPayload.quantity = amounts.value[productId];
        soldProductPayload.price = soldProductPayload.quantity * product.price;

        product.totalSold += amounts.value[productId];
        console.log(soldProductPayload);

        const soldPro = await soldProductService.createSoldProduct(
          soldProductPayload
        );
        console.log(soldPro);
        toast.success("Đã bán");
      } catch (e) {
        console.log(e);
        toast.error("Lỗi bán");
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
      getNewProduct,
      getNewType,
      deletedType,
      fileterProductsByTypeIdHandler,
      filteredSupplementProducts,
      filterAfterUpdate,
      confirmRemoveProduct,
      amounts,
      increaseAmount,
      decreaseAmount,
      sellFunction,
    };
  },
};
</script>

<style scoped>
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

.product-card-container .product-card {
  margin-right: 10px;
  margin-top: 15px;
}

.product-card-container .product-card .product-edit-btn {
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

.product-card .product-edit-btn:hover {
  border: 1px solid var(--icon-color);
}

.product-card-img {
  height: 100px;
  border-radius: 5px;
}

.sell-container {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
}

.sell-container .amount-edit-btns-container {
  display: flex;
}

.sell-container .amount-edit-btns-container .amount-btn {
  background: none;
  border: 1px solid rgb(201, 201, 201);
  width: 35px;
  margin: 0 0;
  text-align: center;
  padding: 0 0;
  cursor: pointer;
}

.amount-icon {
  margin: 0 0;
}

.sell-container .amount-edit-btns-container .amount-btn:hover {
  border: 1px solid rgb(120, 120, 120);
}

.sell-container .sell-btn {
  border: none;
  border-radius: 2px;
  background: var(--icon-color);
  width: 60px;
  cursor: pointer;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 4px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset;
}

.sell-container .sell-btn:hover {
  background: #ff882d;
  box-shadow: rgba(0, 0, 0, 0.4) 0px 0px 2px,
    rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.1) 0px -3px 0px inset;
}

.cost-sold {
  display: flex;
  justify-content: space-between;
}

/* 
.q-card-action-class {
  height: 45px;
  font-weight: 500;
  color: var(--secondary-color);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
} */

/* a {
  text-decoration: none;
  color: inherit;
} */
</style>
