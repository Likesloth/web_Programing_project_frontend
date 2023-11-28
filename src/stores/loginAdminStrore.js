import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";

export const useloginAdminStrore = defineStore("loginadmin", {
  state: () => ({
    adminid: useStorage("adminid", ""),
    username: useStorage("fullname", ""),
    accessToken: useStorage("accessToken", ""),
  }),
  
  getters: {
    getusername: (state) => state.username,
    getAdminid: (state) => state.adminid,
    getAccessToken: (state) => state.accessToken,
  },

  // Include clearStorage within the store definition
  clearadminStorage() {
    this.adminid = ""; 
    this.username = "";
    this.accessToken = "";
  }
});
