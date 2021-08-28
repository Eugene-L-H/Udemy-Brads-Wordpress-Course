import $ from 'jquery';

class MyNotes {
  constructor() {
    this.events();
  }

  events() {
    $('.delete-note').on("click", this.deleteNote);
  }

  // Methods will go here

  deleteNote() {
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce);
      },
      url: universityData.root_url + '/wp-json/wp/v2/note/141',
      type: 'DELETE',
      success: (Response) => {
        console.log("congrats");
        console.log(Response);
      }, 
      error: (Response) => {
        console.log("whoops");
        console.log(Response);
      }
    });
  }
}

export default MyNotes; 