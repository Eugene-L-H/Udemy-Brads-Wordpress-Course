import $ from 'jquery';

class Like {
  constructor() {
    this.events();
  }

  events() {
    $('.like-box').on('click', this.ourClickDispatcher.bind(this));
  }

  // methods
  ourClickDispatcher(e) {
    var likeBox = document.getElementsByClassName('like-box');

    var likes = document.getElementsByClassName('like-count');
    var likes = likes[0].getAttribute('data-likes');

    if (likeBox[0].getAttribute('data-exists') == 'yes') {
      this.deleteLike(likeBox, likes);
    } else {
      this.createLike(likeBox, likes);
    }
  }

  createLike(likeBox, likes) {
    // var likes = document.getElementsByClassName('like-count');
    // var likes = likes[0].getAttribute('data-likes');

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'POST',
      data: { 'professorId': likeBox[0].getAttribute('data-professor') },
      success: (response) => {
        likes++;
        likeBox[0].setAttribute('data-exists', 'yes');
        likeBox[0].getElementsByClassName('like-count')[0].innerHTML = likes;
        console.log(response);
      },
      error: (response) => {
        console.log(response);
      },
    });
  }

  deleteLike(likeBox, likes) {
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'DELETE',
      success: (response) => {
        // likes--;
        likeBox[0].setAttribute('data-exists', 'no');
        likeBox[0].getElementsByClassName('like-count')[0].innerHTML = likes;
        console.log('Likes = ' + likes);
        console.log(response);
      },
      error: (response) => {
        console.log(response);
      },
    });
  }
}

export default Like;
