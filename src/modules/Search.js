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
        $.getJSON(universityData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.val(), (results) => {
            this.resultsDiv.html(`
                <div class="row">
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">General Information</h2>
                        ${results.generalInfo.length ? '<ul class="link-list min-list">' : `<p>No results. view all<a href="${universityData.root_url}/blog">view all posts</a></p>`}
                        ${results.generalInfo.map(item => `<li><p><a href="${item.permalink}">${item.title}</a> ${item.postType == 'post' ? `by ${item.authorName}` : ''}</p></li>`).join('')}
                        ${results.generalInfo.length ? '</ul>' : ''}
                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Programs</h2>
                        ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No programs match that search. <a href="${universityData.root_url}/programs">view all programs</a></p>`}
                        ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
                        ${results.programs.length ? '</ul>' : ''}

                        <h2 class="search-overlay__section-title">Professors</h2>
                        ${results.professors.length ? '<ul class="link-list min-list">' : `<p>No professors match that search. <a href="${universityData.root_url}/professors">view all professors</a></p>`}
                        ${results.professors.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
                        ${results.professors.length ? '</ul>' : ''}

                    </div>
                    <div class="one-third">
                        <h2 class="search-overlay__section-title">Events</h2>
                        ${results.events.length ? '<ul class="link-list min-list">' : `<p>No events match that search. <a href="${universityData.root_url}/events">view all events</a></p>`}
                        ${results.events.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
                        ${results.events.length ? '</ul>' : ''}
                        
                    </div>
                </div>
            `);
            this.isSpinnerVisible = false;
        });

    }


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