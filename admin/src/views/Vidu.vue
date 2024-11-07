<template>
    <div>
      <select v-model="selectedBranch">
        <option value="">Tất cả chi nhánh</option>
        <option value="branch1">Chi nhánh 1</option>
        <option value="branch2">Chi nhánh 2</option>
      </select>
  
      <select v-model="selectedFacilityType">
        <option value="">Tất cả loại cơ sở vật chất</option>
        <option value="type1">Loại 1</option>
        <option value="type2">Loại 2</option>
      </select>
  
      <ul>
        <!-- Lặp qua danh sách thiết bị đã lọc -->
        <li v-for="facility in filteredFacilities" :key="facility.id">
          {{ facility.name }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        facilities: [
          { id: 1, name: "Facility 1", branch: "branch1", facilityType: "type1" },
          { id: 2, name: "Facility 2", branch: "branch2", facilityType: "type2" },
          { id: 3, name: "Facility 3", branch: "branch1", facilityType: "type2" },
        ],
        selectedBranch: "",
        selectedFacilityType: ""
      };
    },
    computed: {
      filteredFacilities() {
        // Trả về danh sách thiết bị đã lọc dựa trên branch và facilityType
        return this.facilities.filter(facility => {
          return (
            (!this.selectedBranch || facility.branch === this.selectedBranch) &&
            (!this.selectedFacilityType || facility.facilityType === this.selectedFacilityType)
          );
        });
      }
    }
  };
  </script>