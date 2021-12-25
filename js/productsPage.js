import {createApp} from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.23/vue.esm-browser.js";

const productsApp = {
  data() {
    return {
      api: {
        baseURL: "https://vue3-course-api.hexschool.io/v2/api", // 預設宣告 API URL
        api_path: "jimmycai", // 預設宣告 api_path 
        api_checkedLoginStatus: "/user/check", // 宣告 Check Login API
        api_getProducts: "/admin/products", // 宣告 Get Admin Products API
        api_postProduct: "/admin/product", // 宣告 Post/Put/Delete Admin Products API
      },
      products: [],
      product_id: "",
      product_Img: "",
      productDetail: {
        imageUrl: "",
        imagesUrl: [],
        title: "",
        category: "",
        unit: "",
        origin_price: 0,
        price: 0,
        description: "",
        content: "",
        is_enabled: 0
      },
      productModal: "",
      isTemplateLoading: false
    }
  },
  methods: {
    // 檢查登入驗證
    checkedLoginStatus() {
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)hasToken\s*\=\s*([^;]*).*$)|^.*$/, "$1"); // 取得名為 hasToken 的 cookie 
      axios.defaults.headers.common['Authorization'] = token; // 把 Token 加入到 Headers Authorization 裡

      // 串接 /user/check API
      axios.post(`${this.api.baseURL}${this.api.api_checkedLoginStatus}`).then(status =>{
        //console.log(status);
        if (status.data.success){
          this.isTemplateLoading = true;
          this.getProductsData();
        };
      }).catch(err =>{
        alert(`
        登入逾時！！
        ${err}
        `);
        window.location = "../templates/manager_login.html";
      });
    },
    // GET Products API 
    getProductsData() {
      axios.get(`${this.api.baseURL}/${this.api.api_path}${this.api.api_getProducts}`).then(res =>{
        if (res.data.success){
          this.products = res.data.products;
        };
      }).catch(err =>{
        alert(err);
      });
    },
    // POST/PUT Products API
    postProductsData() {
      let postObj = {
        data: {...this.productDetail}
      };
      
      if (!this.product_id){
        // POST API
        axios.post(`${this.api.baseURL}/${this.api.api_path}${this.api.api_postProduct}`, postObj).then(res =>{
          //console.log(res);
          if (res.data.success){
            this.closeModal();
            this.product_id = "";
            this.productDetail = {};
            this.getProductsData();
          };
        }).catch(err =>{
          alert(`新增失敗：${err}`);
        }); 
      }else {
        // PUT API
        axios.put(`${this.api.baseURL}/${this.api.api_path}${this.api.api_postProduct}/${this.product_id}`, postObj).then(res =>{
          //console.log(res);
          if (res.data.success){
            this.closeModal();
            this.product_id = "";
            this.productDetail = {};
            this.getProductsData();
          };
        }).catch(err =>{
          alert(`更改失敗：${err}`);
        });
      };
    },
    // DELETE Products API
    deleteProductsData(product_id) {
      axios.delete(`${this.api.baseURL}/${this.api.api_path}${this.api.api_postProduct}/${product_id}`).then(res =>{
        //console.log(res);
        if (res.data.success){
          this.closeModal();
          this.product_id = "";
          this.productDetail = {};
          this.getProductsData();
        };
      }).catch(err =>{
        alert(`刪除失敗：${err}`);
      })
    },
    // 顯示 Modal 畫面
    showModal(modal, productData) {
      if (productData === ""){
        this.product_id = "";
        this.product_Img = "";
        this.productDetail = {};
      }else {
        this.product_id = productData.id;
        this.product_Img = "";
        this.productDetail = productData;
      };
      
      this.productModal = new bootstrap.Modal(document.getElementById(modal));
      this.productModal.show();
    },
    // 關閉 Modal 畫面    
    closeModal(modal) {
      this.productModal.hide();
    },
    // 新增圖片功能
    addProductImg() {
      this.productDetail.imageUrl = this.product_Img;
      this.product_Img = "";
    },
    // 移除圖片功能
    removeProductImg() {
      this.productDetail.imageUrl = "";
    },
    // 查看功能是否啟用
    /*switchEnabled(product) {
      product.is_enabled = !product.is_enabled;
    },*/
    // 查看產品詳情
    /*showProductDetail(product) {
      this.productDetail = product;
      //console.log(this.productDetail)
    }*/
  },
  created() {
    this.checkedLoginStatus();
  }
};

createApp(productsApp).mount('#app');