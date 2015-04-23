var app = (function () {
  var categories = [],
    selectedCategories = [],
    selectedTemplate = null,
    listTemplate = null,
    notificationTemplate = null;

  function renderCategories() {
    document.getElementById("list").innerHTML = listTemplate({categories: categories});
  }

  function fadeOutMessage(message) {
    var notifyElement = document.getElementById('notify');
    notifyElement.innerHTML = notificationTemplate({message: message});
    window.setTimeout(function () {
      notifyElement.innerHTML = '';
    }, 3000);
  }

  function renderTo() {
    document.getElementById('selected').innerHTML = selectedTemplate({selected: selectedCategories});
    document.getElementById('submit').disabled = selectedCategories.length === 0;
  }

  return {
    initialize: function () {
      listTemplate = Handlebars.compile(document.getElementById('category-template').innerText);
      selectedTemplate = Handlebars.compile(document.getElementById('selected-template').innerText);
      notificationTemplate = Handlebars.compile(document.getElementById('notification-template').innerText);
      $fh.cloud({
        path: '/category/',
        method: 'GET'
      }, function (res) {
        categories = res.data;
        renderCategories();
      });
    },

    selectionChanged: function (option) {
      if (option.checked) {
        selectedCategories.push(option.id);
      } else {
        selectedCategories.splice(selectedCategories.indexOf(option.id), 1);
      }
      renderTo();
    },

    addCategory: function (input) {
      if (event.keyCode === 13) {
        $fh.cloud({
          path: '/category/',
          data: {
            name: input.value
          }
        }, function () {
          categories.push(input.value);
          renderCategories();
          input.value = '';
        });
      }
    },

    selectAll: function (source) {
      selectedCategories = [];
      var checkboxes = document.getElementsByName('category');
      for (var i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = source.checked;
        if (source.checked) {
          selectedCategories.push(checkboxes[i].id);
        }
      }
      renderTo();
    },

    deleteCategory: function (name) {
      $fh.cloud({
        path: '/category/' + name,
        method: 'DELETE',
        contentType: 'text/plain'
      }, function () {
        categories.splice(categories.indexOf(name), 1);
        var index = selectedCategories.indexOf(name);
        if (index !== -1) {
          selectedCategories.splice(index, 1);
        }

        renderCategories();
      });
    },

    send: function () {
      var message = document.getElementById('pushmessage').value;
      $fh.cloud({
        path: '/category/send',
        data: {
          alert: message,
          criteria: {
             categories: selectedCategories
          }
        }
      }, function () {
        fadeOutMessage('Message sent!');
      });
    }
  }
}());
