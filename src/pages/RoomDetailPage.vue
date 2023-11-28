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
            class="flex justify-center items-center p-5 h-[20%] w-full"
          >
            <div class="font-bold text-2xl h-full text-center">
              <div>Room Number: {{ roomDetails.RoomNumber }}</div>
              <div>Date: {{ datenow }}</div>
            </div>     
          </div>
          <div class="flex flex-col justify-center h-[70%] border">
            <div class="border border-y-black">
              <div
                v-for="(val, index) in timeID.slice(0, -1)"
                :key="index"
                class="flex items-center justify-between p-2 cursor-pointer"
                :class="{ ' bg-gray-400': index % 2 !== 0 }"
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
                  <div class="w-full flex justify-center">
                    <q-btn
                    v-if="selectedTime[index]"
                    class="flex justify-center items-center"
                    @click="removeTime(index)"
                    label="selected"
                    />
                    <q-btn
                    v-else
                    class="flex justify-center items-center text-red-500"
                    color="purple"
                    label="booking"
                    @click="selectTime(index)"
                    />
                  </div>
                </div>
              </div>
            </div>
           <div v-for="booking in bookedTimes" :key="booking.Id">
      {{ getTimeRangeForBooking(val.Id, timeID[index + 1].Id, booking) }}
    </div>
          </div>
          
          <div class="p-4 h-[10%] items-center grid-cols-3 grid w-full">
            <div class="col-span-2">
              ToTal {{ counthour() }} hour
              {{ counthour() * roomdata.CurrentPricePerHour }}
            </div>
            
            <div class="justify-end flex">
              <button
              class="bg-blue-500 text-white rounded-md px-4 py-2"
                @click="editRecord()"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </q-page>

  <q-dialog v-model="form_edit" persistent>
    <q-card class="w-[20vw] h-[60vh]">
      <q-card-section class="flex h-[90%]">
        <div class="h-[30%] w-full text-center text-xl bg-blue-300">
          <div class="text-3xl text-center font-bold">RECIPT</div>
          <div class="text-xl text-center">Room number</div>
          <div class="font-bold">{{ roomDetails.RoomNumber }}</div>
          <div class="font-bold">{{ datenow }}</div>
        </div>
        <div class="h-[60%] w-full text-center text-xl">
          <div>Price Per Hour</div>
          <div class="font-bold">{{ roomdata.CurrentPricePerHour }}</div>
          <div>TOTAL HOUR</div>
          <div class="font-bold">{{ counthour() }}</div>
          <div>TOTAL PRICE</div>
          <div class="font-bold">
            {{ counthour() * roomdata.CurrentPricePerHour }}
          </div>
          <div>Form</div>
          <div class="font-bold">{{ timeID[starttime - 1].Time }}</div>
          <div>To</div>
          <div class="font-bold">{{ timeID[endtime].Time }}</div>
        </div>
      </q-card-section>

      <q-card-actions align="right" class="h-[10%]">
        <q-btn flat label="CANCLE" color="RED" v-close-popup />
        <q-btn
          flat
          label="CONFIRM"
          color="primary"
          @click="showResave()"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
  <DialogComponent v-model="showDialog" :propDialog="dialog"></DialogComponent>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useLoginUserStore } from "src/stores/loginUserStrore";
import { Notify } from "quasar";
import DialogComponent from "src/components/DialogcomponentBooking.vue";
export default defineComponent({
  name: "RoomDetailPage",
  setup() {
    const currentDate = new Date();
    const formattedDate = ref(currentDate.toISOString().split("T")[0]); // Extracts the date part
    console.log(formattedDate);
    const selectedDate = ref({
      day: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    });

    return {
      date: formattedDate,
      selectedDate,
    };
  },

  data() {
    return {
      timeID: [],
      form_edit: false,
      theroomFull: [],
      roomDetails: {},
      datenow: {},
      roomdata: {},
      TotalPrice: 0,
      selectedTime: [],
      starttime: 0,
      endtime: 0,

      showDialog: false,
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
     getTimeRangeForBooking(startTime, endTime, booking) {
    // Format and display the time range for each booking
    return `${this.timeID[startTime].Time} - ${this.timeID[endTime].Time} for Booking: ${booking.StartTime} - ${booking.EndTime}`;
  },
    isTimeBooked(index) {
    // Check if the time range at the given index is booked
    const startTime = this.timeID[index].Id;
    const endTime = this.timeID[index + 1].Id;
    return this.bookedTimes.some((booking) => {
      return startTime >= booking.StartTime && endTime <= booking.EndTime;
    });
  },
    editRecord() {
      this.form_edit = true;
    },
    onDelete() { },
    getbooked() {
     
      const data = {
        RoomID: this.roomDetails.RoomID,
        BookingDate: this.datenow,
      };
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      this.$api
        .put("/booking/getroomtime", data, { headers })
        .then((res) => {
          if (res.status == 200) {
          
          console.log(JSON.stringify(res.data))
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
          Notify.create({
            type: "negative",
            message: "can not book ",
          });
        });
    },
    showResave() {
      this.$router.push("/user");
      const data = {
        RoomID: this.roomDetails.RoomID,
        UserID: this.storeLogUser.userid,
        BookingDate: this.datenow,
        StartTime: this.starttime,
        EndTime: this.endtime + 1,
        TotalHour: 1 + this.endtime - this.starttime,
        TotalPrice: this.counthour() * this.roomdata.CurrentPricePerHour,
      };
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      this.$api
        .post("/booking/newbooking", data, { headers })
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Booking Sucessfuly",
            });
            console.log(res.data);
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
          Notify.create({
            type: "negative",
            message: "can not book ",
          });
        });
    },
    counthour() {
      var count = 0;
      if (this.starttime !== 0 && this.endtime !== 0) {
        count = this.endtime - this.starttime + 1;
      }
      return count;
    },

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
                this.roomdata = timesObj;
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
      const selectedId = this.timeID[index].Id;

      if (this.starttime === 0 && this.endtime === 0) {
        // If both starttime and endtime are null, set both to the selected time
        this.starttime = selectedId;
        this.endtime = selectedId;
      } else {
        // If either starttime or endtime is not null, adjust accordingly
        if (selectedId < this.starttime) {
          this.starttime = selectedId;
        } else if (selectedId > this.endtime) {
          this.endtime = selectedId;
        }
      }

      // Store the selected time in the array
      this.selectedTime[index] = selectedId;

      console.log(
        "start Time " + this.starttime + "/// end time " + this.endtime
      );
    },
    removeTime(index) {
      // Remove the selected time
      var temp = this.selectedTime[index];

      // Recalculate start and end times
      if (this.starttime === this.endtime) {
        this.starttime = 0;
        this.endtime = 0;
      } else {
        this.selectedTime.map((time) => {
          console.log(time + "time");
          if (time !== null) {
            if (temp === this.starttime) {
              this.starttime = temp + 1;
            }
            if (temp === this.endtime) {
              this.endtime = temp - 1;
            }
          }
        });
      }

      this.selectedTime[index] = null;
      console.log(
        "start Time " + this.starttime + "/// end time " + this.endtime
      );
    },
  },
  components: { DialogComponent },

  async mounted() {
    await this.getAlltime();
    // Access the route params to get the object passed from the previous page
    this.roomDetails = JSON.parse(decodeURIComponent(this.$route.params.val));
    this.datenow = JSON.parse(decodeURIComponent(this.$route.params.date));
    await this.getRomdetail();
    await this.getbooked();

    console.log(this.roomDetails);
    console.log("Received room details:", this.roomDetails);
  },
});
</script>
