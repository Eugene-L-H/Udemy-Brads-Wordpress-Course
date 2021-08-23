import $ from 'jquery'

class Search {
    // 1. describe and create/initiate our object
    constructor() {
        this.resultsDiv = $("#search-overlay__results");
        this.openButton = $(".js-search-trigger");
        this.closeButton = $(".search-overlay__close");
        this.searchOverlay = $(".search-overlay");
        this.searchField = $("#search-term");
        this.events();
        this.isOverlayOpen = false;
        this.isSpnnerVisible = false;
        this.typingTimer;
    }

    // 2. events
    events() {
        this.openButton.on("click", this.openOverlay.bind(this));
        this.closeButton.on("click", this.closeOverlay.bind(this));
        $(document).on("keydown", this.keyPressDispatcher.bind(this));
        this.searchField.on("keyup", this.typingLogic.bind(this));

    }

    // 3. methods (function, action...)s
    typingLogic() {
        if (this.searchField.val() != this.previousValue) {
            clearTimeout(this.typingTimer);

            if (this.searchField.val()) {

                if (!this.isSpnnerVisible) {
                    this.resultsDiv.html('<div class="spinner-loader"></div>');
                    this.isSpinnerVisible = true;
                }

                this.typingTimer = setTimeout(this.getResults.bind(this), 750);

            }
            else {
                this.resultsDiv.html('');
                this.isSpinnerVisible = false;
            }

        }
        this.previousValue = this.searchField.val();
    }

    getResults() {
        $.when(
            $.getJSON(universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val()),
            $.getJSON(universityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val()),
            $.getJSON(universityData.root_url + '/wp-json/wp/v2/event?search=' + this.searchField.val()),
            $.getJSON(universityData.root_url + '/wp-json/wp/v2/professor?search=' + this.searchField.val()),
            $.getJSON(universityData.root_url + '/wp-json/wp/v2/program?search=' + this.searchField.val())
        ).then((posts, pages, events, profs, programs) => {
            var combinedResults = posts[0].concat(pages[0]);
            combinedResults = combinedResults.concat(events[0]);
            combinedResults = combinedResults.concat(profs[0]);
            combinedResults = combinedResults.concat(programs[0]);
            this.resultsDiv.html(`
                <h2 class="search-overlay__section-title">General Information</h2>
                ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No results</p>'}
                ${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
                ${combinedResults.length ? '</ul>' : ''}
            `);
            this.isSpinnerVisible = false;
        }, () => {
            this.resultsDiv.html("<p>Unexpected error; Please try again.</p>");
        });

    }


    //     $.getJSON(universityData.root_url + '/wp-json/wp/v2/posts?search=' + this.searchField.val(), posts => {
    //         $.getJSON(universityData.root_url + '/wp-json/wp/v2/pages?search=' + this.searchField.val(), pages => {
    //             $.getJSON(universityData.root_url + '/wp-json/wp/v2/event?search=' + this.searchField.val(), events => {
    //                 $.getJSON(universityData.root_url + '/wp-json/wp/v2/professor?search=' + this.searchField.val(), profs => {
    //                     var combinedResults = posts.concat(pages);
    //                     // combinedResults = combinedResults.concat(events);
    //                     // combinedResults = combinedResults.concat(profs);
    //                     this.resultsDiv.html(`
    //                     <h2 class="search-overlay__section-title">General Information</h2>
    //                     ${combinedResults.length ? '<ul class="link-list min-list">' : '<p>No results</p>'}
    //                     ${combinedResults.map(item => `<li><a href="${item.link}">${item.title.rendered}</a></li>`).join('')}
    //                     ${combinedResults.length ? '</ul>' : ''}
    //                     `);
    //                     this.isSpinnerVisible = false;
    //                 });
    //             });
    //         });
    //     });
    // }

    keyPressDispatcher(e) {

        if (e.keyCode == 83 && !this.isOverlayOpen && !$("input, textarea").is(':focus')) {
            this.openOverlay();
        }

        if (e.keyCode == 27 && this.isOverlayOpen) {
            this.closeOverlay();
        }
    }

    openOverlay() {
        this.searchOverlay.addClass("search-overlay--active");
        $('body').addClass("body-no-scroll");
        this.searchField.val('');
        setTimeout(() => this.searchField.focus(), 301);
        this.isOverlayOpen = true;
    }

    closeOverlay() {
        this.searchOverlay.removeClass("search-overlay--active");
        $('body').removeClass("body-no-scroll");
        this.isOverlayOpen = false;
    }
}

export default Search;