<template>
  <q-page class="flex flex-col">
    <div class="flex justify-center items-center h-[20vh] w-full bg-gray-500">
      <div class="bg-white h-[80%] w-[95%]">
        <div class="q-pa-md" style="max-width: 300px">
          <q-input filled v-model="date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <q-btn push color="primary" label="Push" @click="gotodashboard()" />
        <q-datetime v-model="selectedDateTime" label="Select Date and Time" />
      </div>
    </div>

    <div v-if="dataReady">
      <!-- Data completed -->
      <q-table title="List of users" :columns="columns" :rows="rows" row-key="RoomID" :pagination="paginations">
        <template #body="props">
          <q-tr :props="props">
            <q-td key="RoomID" :props="props"> {{ props.row.RoomID }}</q-td>
            <q-td key="RoomNumber" :props="props">
              {{ props.row.RoomNumber }}</q-td>
            <q-td key="SizeID" :props="props"> {{ props.row.SizeID }}</q-td>
            <q-td key="Status" :props="props"> {{ props.row.Status }}</q-td>
            <q-td key="action">
              <q-btn color="primary" flat round icon="edit" @click="editRecord(props.row)" />
              <!-- <q-btn color="primary" flat round icon="delete" @click="deleteRecord(props.row)" /> -->
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
    <div v-else>
      <!-- Loading data -->
      <q-circular-progress indeterminate rounded size="50px" color="lime" class="q-ma-md" />
    </div>
    <!-- Edit Dialog -->
    <q-dialog v-model="form_edit" persistent>
      <q-card>
        <q-card-section class="row items-center gap-4 border border-black">
          <div class="text-2xl">{{ input.RoomNumber }}</div>

          <span class="text-lg">Edit Room </span>
        </q-card-section>

        <q-card-section class="flex flex-col gap-4">
          <div>
            <q-input v-model="input.RoomNumber" type="text" label="Edit Number of the room " />
          </div>
          <div>
            <q-select v-model="input.SizeID" :options="[1, 2, 3]" label="Edit size of the room" outlined />
          </div>
          <div>
            <q-input v-model="input.Status" type="text" label="Edit status of the room " />
          </div>
          <div class="flex gap-7">
            <div class="text-gray-500 text-sm">
              Size Id Note : <br />
              1 = small size <br />
              2 = medium <br />
              3 = large
            </div>
            <div class="text-gray-500 text-sm">
              Stetus Id Note : <br />
              N = Normal <br />
              D = Deleted <br />
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup @click="onCancelEdit()" />
          <q-btn flat label="Edit" color="primary" v-close-popup @click="submitEditData()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Delete Dialog -->
    <q-dialog v-model="form_delete" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">Delete user ID: {{ input.id }}</span>
        </q-card-section>

        <q-card-section>
          <span class="q-ml-sm">Fullname: {{ input.fullname }}</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="NO" color="primary" v-close-popup />
          <q-btn flat label="YES" color="primary" v-close-popup @click="onDelete()" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <DialogComponent v-model="showDialog" :propDialog="dialog"></DialogComponent>
<div>
  <q-input v-model="newRoom.RoomNumber" label="Room Number" outlined />
</div>
<div>
  <q-select v-model="newRoom.SizeID" :options="[1, 2, 3]" label="Size of the Room" outlined />
</div>
<div>
  <q-Input v-model="newRoom.Status" label="status" outlined />
</div>

<q-btn push color="primary" label="Add Room" @click="addRoom" />
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useloginAdminStrore } from "../stores/loginAdminStrore";
import { Notify } from "quasar";
import { ref } from "vue";
import DialogComponent from "src/components/DialogComponent.vue";
export default defineComponent({
  name: "AdminHomepage",
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
      dataReady: false,

      rows: [],
      rooms: [],
      SmRoom: [],
      MdRoom: [],
      LgRoom: [],
      timeID: [],
      freeroom: [],
      columns: [
        {
          name: "RoomID",
          label: "RoomID",
          field: "RoomID",
          align: "center",
          sortable: true,
        },
        {
          name: "RoomNumber",
          label: "RoomNumber",
          field: "RoomNumber",
          align: "center",
          sortable: true,
        },
        {
          name: "SizeID",
          label: "SizeID",
          field: "SizeID",
          align: "center",
          sortable: true,
        },
        {
          name: "Status",
          label: "Status",
          field: "Status",
          align: "center",
          sortable: true,
        },

        { name: "action", label: "Actions", field: "action", align: "center" },
      ],
      paginations: { rowsPerPage: 7 },
      storeLogUser: useloginAdminStrore(),
      input: [],
      form_edit: false,
      form_delete: false,
      currentTime: "",
      showDialog: false,
      selectedDateTime: null,
      dialog: {
        icon: "",
        msg: "",
        btnType: "",
        iconColor: "primary",
      },
      uploadFile: null,
      newRoom: {
        RoomNumber: null,
        SizeID: null,
        Status: null,
      },

    };
  },
  methods: {
    getAllUsers() {
      console.log("token:" + this.storeLogUser.accessToken);
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      console.log("headers:" + JSON.stringify(headers));
      this.$api
        .get("/auth/", { headers })
        .then((res) => {
          if (res.status == 200) {
            // this.rows = res.data.map((user) => {
            //   return {
            //     id: user.UserID,
            //     fullname: user.Name,
            //     // Add other properties as needed
            //   };
            // });
            // console.log("rows is " + this.rows);
          }
        })
        .catch((err) => {
          console.log(err);
          Notify.create({
            type: "negative",
            message: "cannot get user ",
          });
        });
    },
    gotodashboard() {
      this.$router.push("/DashBoard");
    },
    getfreeroom() {
      // const currentDate = new Date();
      // const formattedDate = ref(currentDate.toISOString()); // or currentDate.toDateString() or any other format

      const data = {
        CurrentDate: this.date,
      };
      console.log("token:" + this.storeLogUser.accessToken);
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      console.log("headers:" + JSON.stringify(headers));
      this.$api
        .get("/auth/", { headers }, data)
        .then((res) => {
          if (res.status == 200) {
            this.freeroom = res.data.map((user) => {
              return {
                RoomNumber: user.RoomNumber,
              };
            });
            console.log("free room is " + this.freeroom);
          }
        })
        .catch((err) => {
          console.log(err);
          Notify.create({
            type: "negative",
            message: "cannot get the data from server",
          });
          // this.storeLogUser.clearStorage();
          // this.$router.push("/");
        });
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
          // this.storeLogUser.clearStorage();
          // this.$router.push("/");
        });
    },
    getAllRoom() {
      console.log("token:" + this.storeLogUser.accessToken);
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      console.log("headers:" + JSON.stringify(headers));
      this.$api
        .get("/admin/auth/allroom", { headers })
        .then((res) => {
          if (res.status == 200) {
            this.rows = res.data.map((rooms) => {
              return {
                RoomID: rooms.RoomID,
                RoomNumber: rooms.RoomNumber,
                SizeID: rooms.SizeID,
                Status: rooms.status,
              };
            });
            console.log("now is all rows  ->>>" + this.rows);
          }
        })
        .catch((err) => {
          console.log(err);
          Notify.create({
            type: "negative",
            message: "cant get the room ",
          });
          // this.storeLogUser.clearStorage();
          // this.$router.push("/");
        });
    },
    editRecord(record) {
      // Preserve existing values of SizeID and Status
      this.input = {
        ...this.input,
        ...record,
      };
      this.form_edit = true;
    },
    deleteRecord(record) {
      this.input = record;
      this.form_delete = true;
    },

    onDelete() {
      // console.log("This is onDelete method");
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      this.$api
        .delete("/auth/" + this.input.id, { headers })
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Deleted user ID: " + res.data.id,
            });
            if (this.storeLogUser.userid == res.data.id) {
              this.storeLogUser.clearStorage();
              this.$router.push("/");
            } else {
              this.getAllUsers();
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    showErrDialog(err) {
      this.showDialog = true;
      this.dialog.icon = "error";
      this.dialog.iconColor = "negative";
      this.dialog.msg = err;
      this.dialog.btnType = "Error";
    },
    onRejected(rejectedEntries) {
      let msg;
      if (rejectedEntries[0].failedPropValidation == "accept")
        msg = "Only images (jpg, jpeg, png) are allowed";
      else if (rejectedEntries[0].failedPropValidation == "max-file-size")
        msg = "File size cannot be larger than 1MB";
      Notify.create({
        type: "negative",
        message: msg,
      });
    },
    updateFile() {
      this.input.img = URL.createObjectURL(this.uploadFile);
    },
    onCancelEdit() {
      this.getAllUsers();
    },

    getFileName() {
      return filepath.substr(filepath.lastIndexOf("/") + 1);
    },
    getCurrentTimeAndDate() {
      const now = new Date();
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false, // Use 24-hour format
      };

      const formattedTime = now.toLocaleString("en-US", options);

      this.currentTime = formattedTime;

      console.log(" current time ->>   " + this.currentTime);
    },
    navigateToBookRoom(val) {
      console.log("this is date : " + this.date);
      const encodedVal = encodeURIComponent(JSON.stringify(val));

      this.$router.push({ name: "bookroom", params: { val: encodedVal } });
    },
    submitEditData() {
      const data = {
        roomnumber: this.input.RoomNumber,
        sizeid: this.input.SizeID,
        status: this.input.Status
      };
      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };
      this.$api
        .put("/admin/auth/uproom/" + this.input.RoomID, data, { headers })
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Updated room ",
            });
            if (this.storeLogUser.userid == res.data.id) {
              this.storeLogUser.fullname = res.data.fullname;
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    addRoom() {
      const data = {
        roomnumber: this.newRoom.RoomNumber,
        sizeid: this.newRoom.SizeID,
        status: this.newRoom.Status,
      };

      const headers = {
        "x-access-token": this.storeLogUser.accessToken,
      };

      this.$api
        .post("/admin/auth/addroom", data, { headers })
        .then((res) => {
          if (res.status === 200) {
            Notify.create({
              type: "positive",
              message: "Room added successfully!",
            });
            // Optionally, you can refresh the room list or perform other actions after adding the room.
          }
        })
        .catch((err) => {
          console.error(err);
          Notify.create({
            type: "negative",
            message: "Error adding room. Please try again.",
          });
        });
    },
    logout() {
      // Access the Pinia store and call the clearAdminStorage method
      const storeLogUser = useLoginAdminStore();
      storeLogUser.clearAdminStorage();

      // Redirect to the login page
      this.$router.push("/");
    },
  },
  async mounted() {
    await this.getAllUsers();
    await this.getAllRoom();
    await this.getAlltime();
    await this.getfreeroom();
    await this.getCurrentTimeAndDate();

    console.log("token@mount:" + this.storeLogUser.accessToken);
    this.dataReady = true;
  },
  components: { DialogComponent },
  computed: {
    isRoomNotAvailable() {
      return (roomNumber) =>
        this.freeroom.some((croom) => croom.RoomNumber === roomNumber);
    },
  },
});
</script>
