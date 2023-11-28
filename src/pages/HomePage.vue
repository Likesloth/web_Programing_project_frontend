<template>
  <q-page class="flex flex-col">
    <div class="flex justify-center items-center h-[20vh] w-full bg-gray-500">
      <div class="bg-white h-[80%] w-[95%]">
        <div class="q-pa-md" style="max-width: 300px">
          <q-input filled v-model="date" mask="date" :rules="['date']">
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy
                  cover
                  transition-show="scale"
                  transition-hide="scale"
                >
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
        <q-datetime v-model="selectedDateTime" label="Select Date and Time" />
      </div>
    </div>
    <div class="h-[70vh] flex justify-around">
       <div class="h-full w-[30%] flex flex-col">
        <div class="w-full flex h-[10%] py-3 justify-center">
          <div class="text-center flex font">small</div>
        </div>

        <div class="w-full h-[90%] items-start justify-center">
          <div class="h-full w-full">
            <div class="grid grid-cols-2 gap-3 min-h-[15%] items-center w-full">
              <div
                v-for="(val, property, index) in SmRoom"
                :key="index"
                class="flex justify-center h-full flex-col items-center"
              >
                <!-- Check if the room is not available -->
                <template v-if="isRoomNotAvailable(val.RoomID)">
                  <div
                    class="non-available-room text-center bg-red-400 p-2 drop-shadow-xl border rounded-xl"
                  >
                    {{ val.RoomNumber }}
                    <div class="text-sm">Non Available</div>
                  </div>
                </template>
                <!-- If the room is available, show the button -->
                <template v-else>
                  <q-btn
                    color="primary"
                    class="w-[70%] text-2xl"
                    @click="navigateToBookRoom(val)"
                  >
                    {{ val.RoomNumber }}
                  </q-btn>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
 <div class="h-full w-[30%] flex flex-col">
        <div class="w-full flex h-[10%] py-3 justify-center">
          <div class="text-center flex font">Medium</div>
        </div>

        <div class="w-full h-[90%] items-start justify-center">
          <div class="h-full w-full">
            <div class="grid grid-cols-2 gap-3 min-h-[15%] items-center w-full">
              <div
                v-for="(val, property, index) in MdRoom"
                :key="index"
                class="flex justify-center h-full flex-col items-center"
              >
                <!-- Check if the room is not available -->
                <template v-if="isRoomNotAvailable(val.RoomID)">
                  <div
                    class="non-available-room text-center bg-red-400 p-2 drop-shadow-xl border rounded-xl"
                  >
                    {{ val.RoomNumber }}
                    <div class="text-sm">Non Available</div>
                  </div>
                </template>
                <!-- If the room is available, show the button -->
                <template v-else>
                  <q-btn
                    color="primary"
                    class="w-[70%] text-2xl"
                    @click="navigateToBookRoom(val)"
                  >
                    {{ val.RoomNumber }}
                  </q-btn>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-full w-[30%] flex flex-col">
        <div class="w-full flex h-[10%] py-3 justify-center">
          <div class="text-center flex font">Large</div>
        </div>

        <div class="w-full h-[90%] items-start justify-center">
          <div class="h-full w-full">
            <div class="grid grid-cols-2 gap-3 min-h-[15%] items-center w-full">
              <div
                v-for="(val, property, index) in LgRoom"
                :key="index"
                class="flex justify-center h-full flex-col items-center"
              >
                <!-- Check if the room is not available -->
                <template v-if="isRoomNotAvailable(val.RoomID)">
                  <div
                    class="non-available-room text-center bg-red-400 p-2 drop-shadow-xl border rounded-xl"
                  >
                    {{ val.RoomNumber }}
                    <div class="text-sm">Non Available</div>
                  </div>
                </template>
                <!-- If the room is available, show the button -->
                <template v-else>
                  <q-btn
                    color="primary"
                    class="w-[70%] text-2xl"
                    @click="navigateToBookRoom(val)"
                  >
                    {{ val.RoomNumber }}
                  </q-btn>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Edit Dialog -->
    <q-dialog v-model="form_edit" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <q-avatar icon="delete" color="primary" text-color="white" />
          <span class="q-ml-sm">Edit user ID: {{ input.id }}</span>
        </q-card-section>

        <q-card-section>
          <div>
            <q-input
              v-model="input.fullname"
              type="text"
              label="Your Fullname"
            />
          </div>
          <div>
            <q-input v-model="input.email" type="text" label="Your Email" />
          </div>
          <div>
            <q-img
              v-if="input.img"
              :src="input.img"
              :ratio="4 / 3"
              spinner-color="primary"
              spinner-size="82px"
            ></q-img>
            <!-- file size = 1MB -->
            <q-file
              outlined
              label="Your avatar"
              v-model="uploadFile"
              accept=".jpg, .jpeg, .png"
              max-file-size="1048576"
              @rejected="onRejected"
              @update:model-value="updateFile()"
            >
              <template v-slot:append>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="Cancel"
            color="primary"
            v-close-popup
            @click="onCancelEdit()"
          />
          <q-btn
            flat
            label="Edit"
            color="primary"
            v-close-popup
            @click="onEdit()"
          />
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
          <q-btn
            flat
            label="YES"
            color="primary"
            v-close-popup
            @click="onDelete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <DialogComponent
      v-model="showDialog"
      :propDialog="dialog"
    ></DialogComponent>
  </q-page>
</template>

<script>
import { defineComponent } from "vue";
import { useLoginUserStore } from "../stores/loginUserStrore";
import { Notify } from "quasar";
import { ref } from "vue";
import DialogComponent from "src/components/DialogComponent.vue";
export default defineComponent({
  name: "ListUserPage",
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
      theroomFull: [],
      rooms: [],
      SmRoom: [],
      MdRoom: [],
      LgRoom: [],
      timeID: [],
      freeroom: [],
      columns: [
        {
          name: "id",
          label: "id",
          field: "id",
          align: "center",
          sortable: true,
        },
        {
          name: "fullname",
          label: "fullname",
          field: "fullname",
          align: "left",
          sortable: true,
        },

        { name: "action", label: "Actions", field: "action", align: "center" },
      ],
      paginations: { rowsPerPage: 7 },
      storeLogUser: useLoginUserStore(),
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
    };
  },
  methods: {
    isRoomNotAvailable(roomnumber) {
      console.log("Checking for room " + roomnumber);

      // Check if this.theroomFull is an array and has at least one element
      if (Array.isArray(this.theroomFull) && this.theroomFull.length > 0) {
        // Use the some function to check if roomnumber matches any RoomID
        return this.theroomFull.some((room) => room.RoomID === roomnumber);
      }

      // If this.theroomFull is not an array or is empty, return false
      return false;
    },

    async getHRoom(dateinput) {
      try {
        const data = {
          BookingDate: dateinput,
        };

        const headers = {
          "x-access-token": this.storeLogUser.accessToken,
        };

        const response = await this.$api.put("/booking/gettimefull", data, {
          headers,
        });

        if (response.status === 200) {
          const roomFullData = response.data;

          // Check if there is data
          if (roomFullData.length > 0) {
            this.theroomFull = roomFullData.map((temp) => ({
              SUM_TOTalHour: temp.SUM_TOTalHour,
              RoomID: temp.RoomID,
            }));
            console.log(this.theroomFull);
          } else {
            // Handle the case when there is no data
            console.log("No room availability data for the given date");
          }
        } else {
          // Handle the case when the API request is not successful
          console.log("Error fetching room availability data");
        }
      } catch (error) {
        // Handle other errors
        console.error("Error in getHRoom:", error);
        Notify.create({
          type: "negative",
          message: "Error fetching room availability data",
        });
      }
    },
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
            this.rows = res.data.map((user) => {
              return {
                id: user.UserID,
                fullname: user.Name,
                // Add other properties as needed
              };
            });
            console.log("rows is " + this.rows);
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
    getfreeroom() {
      const currentDate = new Date();
      const formattedDate = ref(currentDate.toISOString()); // or currentDate.toDateString() or any other format

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
            this.rooms = res.data.map((room) => {
              return {
                RoomID: room.RoomID,
                RoomNumber: room.RoomNumber,
                SizeID: room.SizeID,
                status: room.status,

                // Add other properties as needed
              };
            });
            res.data.map((room) => {
              if (room.SizeID === 1 && room.status === "N") {
                this.SmRoom.push({
                  RoomID: room.RoomID,
                  RoomNumber: room.RoomNumber,
                  SizeID: room.SizeID,
                  status: room.status,
                });
                return {};
              }
              if (room.SizeID === 2 && room.status === "N") {
                this.MdRoom.push({
                  RoomID: room.RoomID,
                  RoomNumber: room.RoomNumber,
                  SizeID: room.SizeID,
                  status: room.status,
                });
                return {};
              }
              if (room.SizeID === 3 && room.status === "N") {
                this.LgRoom.push({
                  RoomID: room.RoomID,
                  RoomNumber: room.RoomNumber,
                  SizeID: room.SizeID,
                  status: room.status,
                });
                return {};
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
          // this.storeLogUser.clearStorage();
          // this.$router.push("/");
        });
    },
    editRecord(record) {
      this.input = record;
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
    onEdit() {
      // console.log("this is onEdit method");
      if (this.uploadFile == "") this.uploadFile = null;
      if (this.uploadFile) {
        // upload new image
        const headers = {
          "Content-Type": "multipart/form-data",
        };
        const formData = new FormData();
        formData.append("singlefile", this.uploadFile);
        this.$api
          .post("/file/upload", formData, { headers })
          .then((response) => {
            if (response.status == 200) {
              // call user edit API
              this.submitEditData(response.data.uploadFileName);
              this.updateFile = null;
            }
          })
          .catch((err) => {
            console.log(err);
            this.showErrDialog(err);
          });
      } else {
        // NOT upload any images
        this.submitEditData();
      }
      this.getAllUsers;
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
      const encodedeate = encodeURIComponent(JSON.stringify(this.date));

      this.$router.push({
        name: "bookroom",
        params: { val: encodedVal, date: encodedeate },
      });
    },
    submitEditData(filename) {
      let img = "";
      if (filename == null) {
        if (this.input.img == null) img = null;
        else img = this.getFileName(this.input.img);
      } else img = filename;
      const data = {
        fullname: this.input.fullname,
        email: this.input.email,
        img: img,
      };
      const headers = {
        "x-accss-token": this.storeLogUser.acctToken,
      };
      this.$api
        .put("/auth/" + this.input.id, data, { headers })
        .then((res) => {
          if (res.status == 200) {
            Notify.create({
              type: "positive",
              message: "Updated user ID: " + res.data.id,
            });
            if (this.storeLogUser.userid == res.data.id) {
              this.storeLogUser.fullname = res.data.fullname;
              if (res.data.img != null && this.updateFile == null) {
                this.storeLogUser.avatar =
                  this.$RESTAPI + "/file/" + res.data.img;
              } else {
                this.storeLogUser.avatar = "default-avatar.png";
              }
            }
          }
        })
        .catch((err) => {
          console.log(err);
          this.showErrDialog(err);
        });
    },
    clearAllData() {
      this.rooms = [];
      this.SmRoom = [];
      this.MdRoom = [];
      this.LgRoom = [];
      this.theroomFull = [];
    },
  },
  async mounted() {
    await this.getAllUsers();
    await this.getAllRoom();
    await this.getAlltime();
    await this.getfreeroom();
    await this.getCurrentTimeAndDate();
    await this.getHRoom(this.date);
    console.log("token@mount:" + this.storeLogUser.accessToken);
    this.dataReady = true;
  },
  components: { DialogComponent },
  watch: {
    date(newDate, oldDate) {
      // This function will be called whenever the 'date' property changes
      // You can call your functions here to re-run them
       this.clearAllData();
      this.getHRoom(newDate);
      this.getAllUsers();
      this.getfreeroom();
      this.getAlltime();
      this.getAllRoom();
      this.getCurrentTimeAndDate();
    },
  },
});
</script>
