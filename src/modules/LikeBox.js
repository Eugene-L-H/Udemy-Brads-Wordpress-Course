// import axios from "axios";

class LikeBox {
  constructor() {
    if (document.querySelector('.like-box')) {
      this.likeBox = document.querySelector(".like-box");
      this.events();
    }
  }    

  // Events

  events() {
    this.likeBox.addEventListener("click", () => this.likeButton());
    console.log(this.likeBox);
  }

  // Methods

  likeButton() {
    alert("Hello!");
  }
}

export default LikeBox;