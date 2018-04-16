<template>
  <div class="warp">
      <input type="file" value='' @change="getFile">
      <p class="tip">请选择要上传的文件...</p>
      <button @click="onUpload">上传</button>
  </div>
</template>
<script>
import axios from "axios";
export default {
  name: "HeadPortrait",
  data() {
    return {
        files:'',
        id:''
    };
  },
  created(){
      axios.get("http://localhost:3000/main/log").then(
            response => {
                if (JSON.stringify(response.data.userInfo) == "{}"||String(response.data.userInfo)=="undefined") {
                    this.showLogin = true;
                }
                else{
                    this.id = response.data.userInfo._id;
                }
            },
            response => {
                console.log("error:" + response);
            }
        );
  },
  methods: {
    getFile(e) {
      this.files = e.target.files[0];
    },
    onUpload() {
      if (this.files) {
        var imgreg = /.+((\.jpg$)|(\.png$))/gi;
        if (imgreg.test(this.files.name)) {
            var formData=new FormData();
            
            formData.append('image',this.files)
            console.log(formData)
          axios.post("http://localhost:3000/api/user/edit", formData,{
                headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
            }).then(response => {
              console.log("正在上传");
            },
            response=>{
                console.log("error:"+response)
            });
        }
      }
    }
  }
};
</script>
<style scoped>

</style>
