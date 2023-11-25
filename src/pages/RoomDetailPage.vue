<template>
  <q-page class="flex flex-col">
    <div class="h-[100vh] w-full bg-stone-600 flex gap-4 flex-col items-center">
      <div class=" bg-white w-full h-[30%]"> this is room details</div>

      <div class="w-[80%] h-[60%] border rounded-lg bg-white">
        <div class=" flex flex-col">
          <div class="flex justify-between items-center p-5">
            <div class="font-bold text-xl">roomNum Booking</div>
            <div class="text-gray-500">Saturday, November 25, 2023</div>
          </div>

          <div class="flex flex-col overflow-y-auto h-80vh">
            <div v-for="(val, index) in timeID.slice(0, -1)" :key="index"
              class="flex items-center justify-between p-2 cursor-pointer" @click="selectTime(index)"
              @dblclick="removeTime(index)">
              <div class="flex">
                <div v-if="index < timeID.length - 1">
                  {{ val.Time }}
                  -------------
                  {{ timeID[index + 1].Time }}
                </div>
              </div>
              <div v-if="selectedTime[index]"> selected </div>
            </div>


          </div>

          <div class="flex justify-end p-4">
            <button class="bg-blue-500 text-white rounded-md px-4 py-2">Book Now</button>
          </div>
        </div>
      </div>

    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useLoginUserStore } from "src/stores/loginUserStrore";
import { Dialog } from "quasar";

export default defineComponent({
  name: "RoomDetailPage",
  data() {
    return {
      timeID: [],
      selectedTime: [],
      storeLogUser: useLoginUserStore(),
      dialog: {
        icon: "",
        msg: "",
        btnType: "",
        iconColor: "primary",
      },
    };
  },
  methods: {
    getAlltime() {
      console.log("Get All Time ->> token:" + this.storeLogUser.accessToken);
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      console.log("headers:" + JSON.stringify(headers));
      this.$api
        .get("/booking/gettime", { headers })
        .then((res) => {
          if (res.status == 200) {
            res.data.map((timesObj) => {
              this.timeID.push({
                Id: timesObj.Id,
                Time: timesObj.Time,
              });
            });
            console.log("show time " + this.timeID);
          }
        })
        .catch((err) => {
          console.log(err);
          Notify.create({
            type: "negative",
            message: "Unauthorized",
          });
        });
    },
    selectTime(index) {
      this.selectedTime[index] = this.timeID[index].Time;
    },
    removeTime(index) {
      this.selectedTime[index] = null;
    }
  },
  async mounted() {
    await this.getAlltime();
    console.log("token@mount:" + this.storeLogUser.accessToken);
    this.dataReady = true;
  },
});
</script>
