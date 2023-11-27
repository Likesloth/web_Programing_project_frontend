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
          <canvas ref="chart"></canvas>
        </div>
      </div>
    </div>
  </q-page>
</template>

<script>

import { defineComponent, ref } from 'vue'
import { Notify } from "quasar";
import { useLoginUserStore } from "src/stores/loginUserStrore";
import moment from 'moment';



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
      storeLogUser: useLoginUserStore(),

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
        .put("booking/getTotalIncome", requestBody , { headers })
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
    onclickgetall() {
      this.getIncome(),
        this.getUser(),
        this.getTotalHour()
    },
  },

  async mounted() {
    await this.getIncome();
    await this.getUser();
    await this.onclickgetall();
  },
});

</script>