var app = {
  categories: [],
  selectedCategories: [],
  selectedTemplate: null,
  listTemplate: null,

  renderCategories: function () {
    document.getElementById("list").innerHTML = this.listTemplate({categories: this.categories});
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
      app.renderCategories();
    });
  },

  selectionChanged: function (option) {
    if (option.checked) {
      this.selectedCategories.push(option.id);
    } else {
      this.selectedCategories.splice(this.selectedCategories.indexOf(option.id), 1);
    }
    document.getElementById('selected').innerHTML = this.selectedTemplate({selected: this.selectedCategories});
    document.getElementById('submit').disabled = this.selectedCategories.length === 0;
  },

  addCategory: function (input) {
    if (event.keyCode === 13) {
      $fh.cloud({
        path: '/api/',
        data: {
          name: input.value
        }
      }, function() {
        app.categories.push(input.value);
        app.renderCategories();
        input.value = '';
      });
    }
  },

  deleteCategory: function (name) {
    $fh.cloud({
      path: '/api/' + name,
      method: 'DELETE'
    }, function () {
      app.categories.splice(app.categories.indexOf(name), 1);
      var index = this.selectedCategories.indexOf(name);
      if (index !== -1) {
        app.selectedCategories.splice(index, 1);
      }

      app.renderCategories();
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
