<template>
    <div class="container">
        <div class="back-button">
            <q-btn flat icon="arrow_back" size="md" @click="$router.go(-1)">
            </q-btn>
        </div>
        <div v-if="ptPackage?.servicePackage.name">
            <!-- <h5 class="container-header ">Gói {{ ptPackage.servicePackage.name }}</h5> -->
            <h4 class="container-header "></h4>
            <q-card-section>
                <q-carousel v-if="ptPackage?.pt.images.length > 0" animated v-model="slide" arrows infinite swipeable
                    thumbnails>
                    <q-carousel-slide v-for="(image, imgIndex) in ptPackage?.pt.images" :key="image.id" :name="imgIndex"
                        :img-src="image.imageUrl" />
                    <q-carousel v-if="ptPackage?.pt.images.length > 0" animated v-model="slide" arrows infinite
                        swipeable thumbnails>
                        <q-carousel-slide v-for="(image, imgIndex) in ptPackage?.pt.images" :key="image.id"
                            :name="imgIndex" :img-src="image.imageUrl" />
                    </q-carousel>
                </q-carousel>
            </q-card-section>
        </div>
        <div class="duration" v-if="ptPackage?.servicePackage?.servicePackagePrices?.length > 0">
            <div v-for="(servicePackagePrice, index) in ptPackage.servicePackage.servicePackagePrices" :key="index">
                <div class="chossed">
                    <q-btn class="button" :class="{ 'selected': selectPriceId === servicePackagePrice.id }"
                        @click="getPrice(servicePackagePrice.id)">
                        <q-badge color="red" floating v-if="selectPriceId === servicePackagePrice.id"></q-badge>
                        {{ servicePackagePrice.packageDuration?.duration + " " +
                            formatDurationType(servicePackagePrice.packageDuration?.durationType) }}
                    </q-btn>
                </div>
            </div>
        </div>
        <div class="price">
            <div> {{ formatPrice(price) }}</div>
        </div>

        <h5 class="container-header">Thông tin PT</h5>
        <div v-if="ptPackage?.pt">
            <div class="pt-info">
                <div><strong>Họ và tên:</strong> {{ ptPackage.pt.profile.fullName }}</div>
                <div><strong>Cân nặng:</strong> {{ ptPackage.pt.weight }} kg</div>
                <div><strong>Chiều cao:</strong> {{ ptPackage.pt.height }} cm</div>
                <div><strong>Số đo 3 vòng:</strong> {{ ptPackage.pt.bust }} - {{ ptPackage.pt.waist }} - {{
                    ptPackage.pt.hips }} </div>
                <div><strong>Link facebook: </strong>
                    <a :href="ptPackage.pt.fbLink">{{ ptPackage.pt.fbLink }}</a>
                </div>
            </div>
        </div>

        <div class="buy">
            <q-icon name="sms" class="icon chat"></q-icon>
            <!-- đường dẫn tương đối không có / ở đầu thì nối đuôi đường dẫn cũ ra -->
            <router-link class="buy" :to="`/`">
                <q-icon name="shopping_cart" class="icon">
                    <p class="icon-text">Mua gói tập</p>
                </q-icon>
            </router-link>
        </div>

    </div>
</template>


<script setup>
    import { onBeforeMount, ref } from "vue";
    import ptPackageService from "../services/ptPackage.service";
    import { useRoute } from "vue-router";


    const ptPackage = ref();
    const ptPackageId = ref(0);
    const route = useRoute();
    const slide = ref(0);
    const selectPriceId = ref(0);
    const price = ref(0);



    onBeforeMount(async () => {
        try {
            ptPackageId.value = route.params.ptPackageId;
            ptPackage.value = await ptPackageService.getPtPackageById(ptPackageId.value);
            if (ptPackage.value.servicePackage.servicePackagePrices.length > 0) {
                selectPriceId.value = ptPackage.value.servicePackage.servicePackagePrices[0].id;
                price.value = ptPackage.value.servicePackage.servicePackagePrices[0].price;
            }
        } catch (error) {
            console.error("Error loading PT package data:", error);
        }
    });




    const getPrice = (id) => {
        selectPriceId.value = id;
        ptPackage.value.servicePackage.servicePackagePrices.forEach((servicePackagePrice) => {
            if (servicePackagePrice.id === selectPriceId.value) {
                price.value = servicePackagePrice.price;
            }
        });
    };

    const formatDurationType = (durationType) => {
        if (durationType === "month") {
            return "Tháng";
        } else if (durationType === "week") {
            return "Tuần";
        } else if (durationType === "day") {
            return "Ngày";
        } else if (durationType === "year") {
            return "Năm";
        }
    }

    function formatPrice(price) {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    }


</script>

<style>
    .container {
        background-color: #edf2f4;
        min-height: 150vh;
    }

    .container-header {
        text-align: center;
        font-size: 30px;
        font-weight: bold;
        padding: 10px;
        margin: 0;
        background-color: #edf2f4;
    }

    .duration {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin: 10px;
    }

    .button.selected {
        background-color: #D90429;
        /* Màu nền khi nút được chọn */
        color: white;
        /* Màu chữ khi nút được chọn */
    }

    .button {
        margin: 10px;
        width: 70%;
        height: 50px;
        font-size: 15px;
        color: #D90429;
        border-color: #D90429;
        background-color: white;
        font-weight: bold;
        text-align: center;
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: 0.3s;
    }

    .container-body {
        margin: 20px;
    }

    .price {
        font-size: 30px;
        color: rgb(197, 38, 38);
        font-weight: bold;
        text-align: center;

    }

    .pt-info {
        font-size: 18px;
        margin: 20px;
        padding: 10px;
        background-color: #f8f9fa;
        border-radius: 8px;
    }

    .pt-info div {
        margin-bottom: 10px;
    }

    .price {
        font-size: 30px;
        color: rgb(197, 38, 38);
        font-weight: bold;
        text-align: center;
    }


    .buy {
        width: 100%;
        display: flex;
        justify-content: right;
        position: fixed;
        bottom: 60px;
        text-decoration: none;
    }

    .icon {
        width: 250px;
        height: 70px;
        font-size: 30px;
        color: white;
        display: flex;
        background-color: #D90429;
        align-items: center;
        text-align: center;
        border-radius: 10px;

    }

    .icon-text {
        margin-top: 10px;
    }

</style>