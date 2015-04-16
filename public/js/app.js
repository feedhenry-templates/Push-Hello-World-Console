var app = {
  categories: [],
  selectedCategories: [],
  selectedTemplate: null,
  listTemplate: null,
  notificationTemplate: null,

  renderCategories: function () {
    document.getElementById("list").innerHTML = this.listTemplate({categories: this.categories});
  },

  fadeOutMessage: function(message) {
    var notifyElement = document.getElementById('notify');
    notifyElement.innerHTML = app.notificationTemplate({message: message});
    window.setTimeout(function() {
      notifyElement.innerHTML = '';
    }, 3000);
  },

  initialize: function () {
    this.listTemplate = Handlebars.compile(document.getElementById('category-template').innerText);
    this.selectedTemplate = Handlebars.compile(document.getElementById('selected-template').innerText);
    this.notificationTemplate = Handlebars.compile(document.getElementById('notification-template').innerText);
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

  send: function () {
    var message = document.getElementById('pushmessage').value;
    $fh.cloud({
      path: '/api/send',
      data: {
        alert: message,
        categories: this.selectedCategories
      }
    }, function () {
      app.fadeOutMessage('Message sent!');
    });
  }
};
