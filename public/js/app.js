var app = {
  categories: [],
  selectedTemplate: null,
  initialize: function () {
    var source = document.getElementById('category-template').innerText;
    var template = Handlebars.compile(source);
    this.selectedTemplate = Handlebars.compile(document.getElementById('selected-template').innerText);
    $fh.cloud({
      path: '/api/',
      method: 'GET'
    }, function (res) {
      var html = template({categories: res.data});
      document.getElementById("list").innerHTML = html;
    });
  },

  selectionChanged: function(option) {
    if (option.checked) {
      this.categories.push(option.id);
    } else {
      this.categories.splice(this.categories.indexOf(option.id), 1);
    }
    var html = this.selectedTemplate({selected: this.categories});
    document.getElementById('selected').innerHTML = html;
    document.getElementById('submit').disabled = this.categories.length === 0;
  },

  send: function (message) {
    $fh.cloud({
      path: '/api/send',
      data: {
        alert: message,
        categories: this.categories
      }
    }, function (res) {
      console.log('send', res);
    });
  }
};
