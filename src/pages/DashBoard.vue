<template>
  <q-page class="flex flex-col">
    <!-- Header Section -->
    <div class="flex justify-center items-center h-[20vh] w-full bg-gray-500">
      <div class="bg-white h-[80%] w-[95%] border rounded-md flex">
        <div class="w-full h-full flex flex-col">
          <div class="q-pa-md w-[40%] h-full">
            <!-- Date Input with Popup -->
            <q-input filled v-model="date" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="date" @input="updateChartData()">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
          </div>
        </div>
      </div>
    </div>
    <div>
      <!-- Content Section -->
      <div class="container p-4">
        <div class="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-5">
          <!-- Today's Overview -->
          <div class="bg-white p-4 rounded shadow">
            <h2 class="text-xl font-bold mb-4">Today's Overview</h2>
            <div class="flex flex-col space-y-2">
              <!-- Total Income Today -->
              <div>
                <span class="font-bold">Total Income Today:</span>
                <span class="ml-2">{{ totalIncomeToday }}</span>
              </div>
              <!-- Total User Today -->
              <div>
                <span class="font-bold">Total User Today:</span>
                <span class="ml-2">{{ totalUserToday }}</span>
              </div>
              <!-- Total Hour Today -->
              <div>
                <span class="font-bold">Total Hour Today:</span>
                <span class="ml-2">{{ totalHourToday }}</span>
              </div>
            </div>
          </div>

          <!-- Top Spender -->
          <div class="bg-white p-4 rounded shadow mt-4 lg:mt-0">
            <h2 class="text-xl font-bold mb-4">Top Spender</h2>
            <table class="table-auto w-full">
              <thead>
                <tr>
                  <th class="px-4 py-2">Username</th>
                  <th class="px-4 py-2">Spend</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(spender, index) in topspender" :key="index" class="odd:bg-gray-100">
                  <td class="border px-4 py-2">{{ spender.Username }}</td>
                  <td class="border px-4 py-2">{{ spender.Spend }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Room Overview -->
      <div class="bg-white p-4 rounded shadow mt-4">
        <h2 class="text-xl font-bold mb-4">Room Overview</h2>
        <div>
          <canvas id="myChart" class="w-full h-48 sm:h-64"></canvas>
        </div>
      </div>
    </div>
  </q-page>
</template>



<script>

import { defineComponent, ref, watch } from 'vue';
import { Notify } from "quasar";
import { useLoginUserStore } from "src/stores/loginUserStrore";
import moment from 'moment';
import Chart from 'chart.js/auto';

export default defineComponent({
  name: 'DashBoard',
  setup() {
    const currentDate = new Date();
    const formattedDate = ref(currentDate.toISOString().split('T')[0]); // Extracts the date part
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
      totalIncomeToday: 0,
      totalUserToday: 0,
      totalHourToday: 0,
      MostBookedRoom: [],
      topspender: [],
      storeLogUser: useLoginUserStore(),
      chart: null,
    };
  },
  methods: {
    getIncome() {
      const date = moment(this.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
      const headers = {
        'x-access-token': this.storeLogUser.accessToken,
      };
      const requestBody = {
        BookingDate: date,
      };
      this.$api
        .put("booking/getTotalIncome", requestBody, { headers })
        .then((res) => {
          if (res.status == 200) {           
            console.log("get income: ", res.data)
            this.totalIncomeToday = res.data
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    getUser() {
      const date = moment(this.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
      const headers = {
        'x-access-token': this.storeLogUser.accessToken,
      };
      const requestBody = {
        BookingDate: date,
      };
      this.$api
        .put("booking/getnumberforuser", requestBody, { headers })
        .then((res) => {
          if (res.status == 200) {           
            console.log("get user", res.data)
            this.totalUserToday = res.data[0].NumberOFuser_today;
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    getTotalHour() {
      const date = moment(this.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
      const headers = {
        'x-access-token': this.storeLogUser.accessToken,
      };
      const requestBody = {
        BookingDate: date,
      };
      this.$api
        .put("booking/getTotalhour", requestBody, { headers })
        .then((res) => {
          if (res.status == 200) {          
            console.log("get hour", res.data)
            this.totalHourToday = res.data[0].TotalHour;
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    async getMostBookedRoom() {
      const headers = {
        'x-access-token': this.storeLogUser.accessToken,
      };

      const date = moment(this.date, 'YYYY-MM-DD').format('YYYY-MM-DD');
      const requestBody = {
        BookingDate: date,
      };

      try {
        const res = await this.$api.put("/booking/mostbookedroom", requestBody, { headers });

        if (res.status === 200) {
          this.MostBookedRoom = res.data.map((MostBookedRoomObj) => ({
            RoomNumber: MostBookedRoomObj.RoomNumber,
            BookingCount: MostBookedRoomObj.BookingCount,
          }));
          console.log("Most Booked Room Data:", this.MostBookedRoom);
        }
      } catch (err) {
        console.log(err);
        this.showErrDialog(err);
      }
    },
    async getTopSpender() {
      const headers = {
        'x-access-token': this.storeLogUser.accessToken,
      };
      try {
        const res = await this.$api.get("/booking/topspender", { headers });

        if (res.status === 200) {
          this.topspender = res.data.map((topspenderobj) => ({
            Username: topspenderobj.Username,
            Spend: topspenderobj.Spend,
          }));
          console.log("Top Spnder: ", this.topspender);
        }
      } catch (err) {
        console.log(err);
        this.showErrDialog(err);
      }
    },
    async updateChartData() {
      await this.getIncome();
      await this.getUser();
      await this.getTotalHour();
      await this.getMostBookedRoom();
      await this.getTopSpender();

      const labelsBooked = this.MostBookedRoom.map((room) => room.RoomNumber);
      const dataBooked = this.MostBookedRoom.map((room) => room.BookingCount);

      // Use the $nextTick method to ensure the DOM has been updated before creating the chart
      this.$nextTick(() => {
        const ctx = document.getElementById('myChart');

        // Check if the chart exists and the canvas element is present
        if (ctx && labelsBooked.length > 0) {
          if (this.chart) {
            this.chart.destroy();
          }

          // Create the new chart
          this.chart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: labelsBooked,
              datasets: [{
                label: 'Booked Hour',
                data: dataBooked,
                borderWidth: 1
              }]
            },
            options: {
              scales: {
                y: {
                  beginAtZero: true
                }
              }
            }
          });
        }
      });
    },
  },

  watch: {
    date: {
      handler: 'updateChartData',
      immediate: true,
    },
  },

  beforeUnmount() {
    // Check if the chart exists before destroying it
    if (this.chart) {
      this.chart.destroy();
    }
  },
});


</script>