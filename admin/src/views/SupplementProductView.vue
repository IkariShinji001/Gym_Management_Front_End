<template>
  <div class="page-3container">
    <div :class="['search-add-div', { centered: !drawerOpen1 }]">
      <q-input outlined v-model="searchText" label="Search" class="search-bar">
        <template v-slot:append>
          <q-icon name="search" />
        </template>
      </q-input>

      <q-btn class="update-btn" @click="createProduct">
        <q-icon name="add" class="add-icon" />
        <q-item-label>Thêm sản phẩm</q-item-label>
      </q-btn>

      <!-- btn-drop -->
      <q-btn-dropdown class="update-btn" label="Loại" icon="settings">
        <q-list>
          <q-item clickable v-close-popup @click="createType">
            <q-item-section side>
              <q-icon name="add_circle" class="add-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Thêm loại</q-item-label>
            </q-item-section>
          </q-item>
          <q-item clickable v-close-popup @click="removeType">
            <q-item-section side>
              <q-icon name="build_circle" class="remove-icon" />
            </q-item-section>
            <q-item-section>
              <q-item-label>Cập nhật</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      <!-- btn-drop -->

      <q-btn class="update-btn">
        <router-link class="chart-link" to="supplement-products/charts">
          <q-icon name="query_stats" class="add-icon" />
          <q-item-label>Thống kê</q-item-label>
        </router-link>
      </q-btn>
    </div>
    <q-dialog v-model="isAddProductFormVisible">
      <q-card>
        <AddProductForm
          v-if="isAddProductFormVisible"
          @createProduct="createProduct"
          @getNewProduct="getNewProduct"
        >
        </AddProductForm>
      </q-card>
    </q-dialog>

    <q-dialog v-model="isAddTypeFormVisible">
      <q-card>
        <AddTypeForm
          v-if="isAddTypeFormVisible"
          @createType="createType"
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
          @removeType="removeType"
          :typeList="types"
          @deletedType="deletedType"
        >
        </UpdateTypeForm>
      </q-card>
    </q-dialog>

    <div
      :class="['product-type', { 'product-type-drawer-open': !drawerOpen1 }]"
    >
      <q-btn
        class="btn-type"
        @click="fileterProductsByTypeId(-1)"
        style="background-color: teal; color: white"
      >
        Tất cả
      </q-btn>
      <div
        v-for="(type, index) in types.slice(0, 3)"
        :key="index"
        class="btn-type-container"
      >
        <q-btn class="btn-type" @click="fileterProductsByTypeId(type)">
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
            @click="fileterProductsByTypeId(type)"
          >
            <q-item-section>
              <q-item-label>{{ type.name }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>

    <!-- PRODUCT --------------->
    <div class="q-pa-md img-container">
      <div
        v-for="product in filteredSupplementProducts"
        :key="product.id"
        class="list-items"
      >
        <q-card class="q-card-class">
          <q-img :src="product.imageUrl" class="q-img-class" />
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
                click="sellFunction(product.id, product)"
              >
                <q-icon name="shopping_cart" size="24px"> </q-icon>
              </button>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="isUpdateProductFormVisible">
      <q-card>
        <UpdateProductForm
          v-if="isUpdateProductFormVisible"
          :productData="selectedProduct"
          @filterAfterUpdate="filterAfterUpdate"
          @openUpdateProductForm="openUpdateProductForm"
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
  props: {
    drawerOpen: Boolean,
  },

  setup(props) {
    const toast = useToast();
    const searchText = ref("");
    const drawerOpen1 = ref(props.drawerOpen);
    const supplementProducts = ref([]);
    const selectedProduct = ref(null);
    const isAddProductFormVisible = ref(false);
    const isAddTypeFormVisible = ref(false);
    const isRemoveTypeFormVisible = ref(false);
    const isUpdateProductFormVisible = ref(false);
    const types = ref([]);
    const filteredSupplementProducts = ref([]);
    const showConfirmDialog = ref(false);
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

        filteredSupplementProducts.value = supplementProducts.value;

        supplementProducts.value.forEach((product) => {
          amounts.value[product.id] = 0;
        });
      } catch (e) {
        console.log(e);
      }
    });

    watchEffect(() => {
      drawerOpen1.value = props.drawerOpen;
      filteredSupplementProducts.value.forEach((product) => {
        if (!amounts.value.hasOwnProperty(product.id)) {
          amounts.value[product.id] = 0;
        }
      });
    });

    async function fileterProductsByTypeId(type) {
      if (type < 0) {
        filteredSupplementProducts.value = supplementProducts.value;
      } else {
        filteredSupplementProducts.value =
          await supplementProductService.getAllByType(type.id);
      }
    }
    function createProduct() {
      isAddProductFormVisible.value = !isAddProductFormVisible.value;
    }
    function createType() {
      isAddTypeFormVisible.value = !isAddTypeFormVisible.value;
    }
    function removeType() {
      isRemoveTypeFormVisible.value = !isRemoveTypeFormVisible.value;
    }
    function openUpdateProductForm(product) {
      isUpdateProductFormVisible.value = !isUpdateProductFormVisible.value;
      selectedProduct.value = product;
    }

    function filterAfterUpdate(product) {
      filteredSupplementProducts.value =
        filteredSupplementProducts.value.filter((pro) => pro.id != product.id);
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
      supplementProducts.value.push(product);
    }
    function getNewType(type) {
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
        const soldPro = await soldProductService.createSoldProduct(
          soldProductPayload
        );
        toast.success("Đã bán");
      } catch (e) {
        console.log(e);
        toast.error("Lỗi bán");
      }
    }
    return {
      drawerOpen1,
      searchText,
      supplementProducts,
      types,
      selectedProduct,
      createProduct,
      openUpdateProductForm,
      createType,
      removeType,
      removeProduct,
      isAddProductFormVisible,
      isAddTypeFormVisible,
      isRemoveTypeFormVisible,
      isUpdateProductFormVisible,
      showConfirmDialog,
      getNewProduct,
      getNewType,
      deletedType,
      fileterProductsByTypeId,
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
}

.search-add-div {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  /* Default alignment */
  transition: justify-content 0.3s;
  /* Smooth transition */
}

.centered {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Center alignment when drawer is open */
}

.search-bar {
  width: 40%;
  /* Default width */
  margin-right: 15px;
  background-color: white;
}

.update-btn {
  width: 160px;
  height: 52px;
  margin-right: 10px;
}

.update-btn .chart-link {
  text-decoration: none;
  color: black;
}

.add-icon {
  color: blue;
}

.remove-icon,
.update-icon {
  color: var(--icon-color) !important;
}

/* product-type */
.product-type {
  /* border: 1px solid green; */
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
  /* padding: 10px; */
}

/* card--product */

.img-container {
  margin-top: 20px;
  padding: 0 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
}

.q-card-class {
  width: 244px;
  margin-right: 10px;
  margin-top: 15px;
}

.q-card-class .product-edit-btn {
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

.q-card-class .product-edit-btn:hover {
  border: 1px solid var(--icon-color);
}

.q-img-class {
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

.sell-container .amount-edit-btns-container .amount-btn:hover {
  border: 1px solid rgb(120, 120, 120);
}

.sell-container .sell-btn {
  border: none;
  border-radius: 2px;
  background: var(--icon-color);
  width: 50px;
}

.sell-container .sell-btn:hover {
  background: #ff8225;
}

.amount-icon {
  /* border: 1px solid black; */
  margin: 0 0;
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
