import { defineStore } from "pinia";
import { useStorage } from "@vueuse/core";
export const useLoginUserStore = defineStore("loginuser", {
    state:()=>({
        userid: useStorage("userid", ""),
        fullname: useStorage("fullname", ""),
        accessToken: useStorage("accessToken", ""),
 
    }),
    getters:{
        getFullname:(state)=>{ return state.fullname },
        getUserid:(state)=>{ return state.userid },
        getAccessToken:(state)=>{return state.accessToken},

    },
    actions:{
        clearStorage(){
            this.userid = "";
            this.fullname = "";
            this.accessToken = "";
     
        }
    }
});