<template>
  <q-page class="flex flex-col">
    <div class="flex justify-center items-center h-[20vh] w-full bg-gray-500">
      <div class="bg-white h-[80%] w-[95%] border  rounded-md flex">
        <div class="w-full h-full flex">
          <div class="q-pa-md w-[40%] h-full">
            <q-input filled v-model="date" mask="date" :rules="['date']">
              <template v-slot:append>
                <q-icon name="event" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-date v-model="date" @input="onDateInput">
                      <div class="row items-center justify-end">
                        <q-btn v-close-popup label="Close" color="primary" flat />
                      </div>
                    </q-date>
                  </q-popup-proxy>
                </q-icon>
              </template>
            </q-input>
            <div>{{ date }}</div>
          </div>
          <div class=" my-[25px]"><q-btn push color="primary" label="Push" @click="onclickgetall()" /></div>
        </div>
        <!-- <q-datetime v-model="selectedDateTime" label="Select Date and Time" /> -->
      </div>
    </div>
    <div class="container mx-auto p-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-bold mb-4">Today's Overview</h2>
          <div class="flex justify-between mb-2">
            <div>Total Income Today: {{ totalIncomeToday }}</div>
          </div>
          <div class="flex justify-between mb-2">
            <div>Total User Today: {{ totalUserToday }}</div>
          </div>
          <div class="flex justify-between mb-2">
            <div>Total Hour Today: {{ totalHourToday }}</div>
          </div>
          <!-- Other sections for total users and total hours -->
        </div>

        <div class="bg-white p-4 rounded shadow">
          <h2 class="text-xl font-bold mb-4">Weekly Overview</h2>
          <div>
            <canvas id="myChart" style="width: 100%; height: 300px;"></canvas>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { defineComponent, ref } from 'vue';
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
      storeLogUser: useLoginUserStore(),
      chart: null,
    };
  },
  methods: {
    getIncome() {
      const date = moment(this.date).format('YYYY-MM-DD');
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
            Notify.create({
              type: "positive",
              message: "get data  ",
            });
            console.log(res.data)
            this.totalIncomeToday = res.data
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    getUser() {
      const date = moment(this.date).format('YYYY-MM-DD');
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
            Notify.create({
              type: "positive",
              message: "get data  ",
            });
            console.log(res.data)
            this.totalUserToday = res.data[0].NumberOFuser_today;
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    getTotalHour() {
      const date = moment(this.date).format('YYYY-MM-DD');
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
            Notify.create({
              type: "positive",
              message: "get data  ",
            });
            console.log(res.data)
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

      const date = moment(this.date).format('YYYY-MM-DD'); // Format the date
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

    async onclickgetall() {
      await this.getIncome();
      await this.getUser();
      await this.getTotalHour();
      await this.getMostBookedRoom();
      // Extract labelsBooked and data from MostBookedRoom
      const labelsBooked = this.MostBookedRoom.map((room) => room.RoomNumber);
      const dataBooked = this.MostBookedRoom.map((room) => room.BookingCount);

      this.updateChart(labelsBooked, dataBooked);// Corrected method name
    },
    async updateChartData() {
      await this.getIncome();
      await this.getUser();
      await this.getTotalHour();
      await this.getMostBookedRoom();
      // Extract labelsBooked and data from MostBookedRoom
      const labelsBooked = this.MostBookedRoom.map((room) => room.RoomNumber);
      const dataBooked = this.MostBookedRoom.map((room) => room.BookingCount);

      this.updateChart(labelsBooked, dataBooked);
    },
    updateChart(labelsBooked, dataBooked) {
      const ctx = document.getElementById('myChart');

      if (this.chart) {
        this.chart.destroy();
      }

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labelsBooked,
          datasets: [{
            label: 'Booking Count',
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
    },
  },

  async mounted() {
    await this.updateChartData();
  },
});

</script>