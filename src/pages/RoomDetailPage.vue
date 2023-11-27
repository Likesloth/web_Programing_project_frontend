<template>
  <q-page class="flex flex-col">
    <div
      class="h-[95vh] w-full flex gap-4 flex-col items-center justify-center bg-gray-400"
    >
      <div
        class="w-[80%] h-[90%] border rounded-lg bg-white drop-shadow-2xl border-gray-500"
      >
        <div class="flex flex-col h-full w-full">
          <div
            class="grid grid-cols-2 justify-center items-center p-5 h-[20%] w-full"
          >
            <div class="font-bold text-2xl h-full text-center">
              <div>{{roomDetails.RoomNumber}}</div>
            </div>
            <div class="text-gray-500">Saturday, November 25, 2023</div>
          </div>
          <div class="flex flex-col justify-center h-[70%] border">
            <div class="border border-y-black">
              <div
                v-for="(val, index) in timeID.slice(0, -1)"
                :key="index"
                class="flex items-center justify-between p-2 cursor-pointer"
                :class="{ ' bg-gray-400': index % 2 !== 0 }"
                @click="selectTime(index)"
                @dblclick="removeTime(index)"
              >
                <div class="grid grid-cols-2 w-full">
                  <div
                    v-if="index < timeID.length - 1"
                    class="text-xl flex justify-center"
                  >
                    {{ val.Time }}
                    -------------
                    {{ timeID[index + 1].Time }}
                  </div>

                  <div
                    v-if="selectedTime[index]"
                    class="flex justify-center items-center"
                  >
                    selected
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class=" p-4 h-[10%] items-center grid-cols-3 grid w-full ">
            <div class="col-span-2">
                ToTal {{ roomdata }}
            
            </div>
            
            
            <div class=" justify-end flex ">

              <button class="bg-blue-500 text-white rounded-md px-4 py-2">
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useLoginUserStore } from "src/stores/loginUserStrore";
import { Notify } from "quasar";

export default defineComponent({
  name: "RoomDetailPage",
  data() {
    return {
      timeID: [],
      roomDetails: {},
      roomdata: {},
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
    getRomdetail() {
      console.log("Get room data->> token:" + this.storeLogUser.accessToken);
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      console.log("headers:" + JSON.stringify(headers));
      this.$api
        .get("/booking/showAllroomdetail", { headers })
        .then((res) => {
          if (res.status == 200) {
            res.data.map((timesObj) => {

              if (timesObj.SizeID == this.roomDetails.SizeID) {
              this.roomdata = timesObj
            }
            });
           
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
    },
  },
  async mounted() {
    await this.getAlltime();
    // Access the route params to get the object passed from the previous page
    this.roomDetails = JSON.parse(decodeURIComponent(this.$route.params.val));
    await this.getRomdetail();
    console.log(this.roomDetails);
    console.log("Received room details:", this.roomDetails);
  },
});
</script>
