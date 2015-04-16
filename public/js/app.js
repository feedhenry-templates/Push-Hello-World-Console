var app = {
  categories: [],
  selectedCategories: [],
  selectedTemplate: null,
  listTemplate: null,

  renderCategories: function (template) {
    document.getElementById("list").innerHTML = template({categories: this.categories});
  },

  initialize: function () {
    var source = document.getElementById('category-template').innerText;
    this.listTemplate = Handlebars.compile(source);
    this.selectedTemplate = Handlebars.compile(document.getElementById('selected-template').innerText);
    $fh.cloud({
      path: '/api/',
      method: 'GET'
    }, function (res) {
      app.categories = res.data;
      app.renderCategories(template);
    });
  },

  selectionChanged: function(option) {
    if (option.checked) {
      this.selectedCategories.push(option.id);
    } else {
      this.selectedCategories.splice(this.selectedCategories.indexOf(option.id), 1);
    }
    document.getElementById('selected').innerHTML = this.selectedTemplate({selected: this.selectedCategories});
    document.getElementById('submit').disabled = this.selectedCategories.length === 0;
  },

  deleteCategory: function(name) {
    $fh.cloud({
      path: '/api/' + name,
      method: 'DELETE'
    }, function() {
      this.categories.splice(this.categories.indexOf(name), 1);
      var index = this.selectedCategories.indexOf(name);
      if (index !== -1) {
        this.selectedCategories.splice(index, 1);
      }

      this.renderCategories(this.listTemplate);
    });
  },

  send: function (message) {
    $fh.cloud({
      path: '/api/send',
      data: {
        alert: message,
        categories: this.selectedCategories
      }
    }, function (res) {
      console.log('send', res);
    });
  }
};
