'use strict'

function makeSKU(length = 10) {
    var sku = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        sku += possible.charAt(getRandomInt(0, possible.length))
    }

    return sku
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min)
    const maxFloored = Math.floor(max)
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)
}

function capitalizeFirstLetter(str) {
    if (str.length === 0) return str
    return str.charAt(0).toUpperCase() + str.slice(1)
}

function generateLoremIpsum(wordCount) {

    const loremIpsumText = "Lorem ipsum odor amet, consectetuer adipiscing elit. Dis torquent eros proin scelerisque eu bibendum donec. Est sit est taciti pulvinar euismod, sollicitudin tempus. Ex lobortis blandit mus rutrum dictumst maximus euismod. Maximus ad lobortis elit blandit justo per dolor velit non. Habitasse ornare placerat odio suspendisse dis aliquet ac. Conubia dolor nam mus suspendisse egestas ornare. Ridiculus enim nam leo sapien rhoncus ante. Phasellus gravida ultricies iaculis, efficitur vivamus convallis. Sociosqu posuere imperdiet malesuada pretium tempus. Finibus curabitur netus natoque auctor odio finibus. Vivamus libero ligula porttitor vulputate parturient, montes venenatis est. Eget elementum aptent etiam nullam pellentesque elit duis taciti. Egestas conubia ligula eleifend sollicitudin velit imperdiet. Turpis feugiat penatibus arcu enim tellus id imperdiet class tincidunt? Accumsan quisque cursus volutpat augue accumsan a. Integer sagittis cubilia turpis posuere eros ad nulla hac. Aliquam montes ultrices viverra interdum magna. Eget enim venenatis sociosqu luctus fringilla pharetra cursus ipsum. Molestie platea sit dis volutpat tempus consequat dictumst. Mus praesent at quis consequat ultricies nisi metus. Ad non pretium nunc leo dis penatibus suscipit. Tempus proin in nunc sed morbi magna suscipit elementum. Platea ipsum praesent aliquet convallis aliquet interdum curae cras cubilia. Eros elit velit est consectetur tempus rhoncus. Pretium pretium purus porta cubilia justo. Eros suscipit phasellus natoque mollis tempus fermentum phasellus. Nisl ornare rutrum sem duis vitae mi lobortis. Nunc eget libero lobortis nam semper. Torquent consectetur habitant nisi sem iaculis. Orci potenti ridiculus platea; consectetur phasellus imperdiet. Iaculis faucibus habitant hendrerit nascetur luctus. Ullamcorper ante sodales tincidunt aliquet sed donec. Fermentum vitae ligula aliquet libero bibendum suscipit egestas quisque adipiscing.";

    const wordsArray = loremIpsumText.split(' ');
    const selectedWords = wordsArray.slice(0, wordCount);

    return selectedWords.join(' ') + (selectedWords.length === wordCount ? '' : '...');
}

function hideElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.add('hidden');
    });
}

function showElements(selector) {
    const elements = document.querySelectorAll(selector);
    elements.forEach(el => {
        el.classList.remove('hidden');
    });
}
