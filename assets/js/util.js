function simpleAjax(method, url, data, callback) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      // try-catch is necessary when you use timeout
      try {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
          callback(xhr.responseText);
        }
      } catch (e) {}
    }
  };

  xhr.open(method, url, true);
  xhr.ontimeout = function() {
    // do something here
  };
  // if method is get, you should set data null
  xhr.send(data);
}

function parseQueryParams(params, qs) {
  params = params || {};
  qs = qs || '';
  qs = qs || (location.search.length > 0 ? location.search.substring(1) : '');
  const items = qs.length ? qs.split('&') : [];

  let name = null,
    value = null;
  items.forEach(item => {
    const itemPair = item.split('=');
    name = decodeURIComponent(itemPair[0]);
    value = decodeURIComponent(itemPair[1]);

    if (name) {
      params[name] = value;
    }
  });

  return params;
}

function capital(str) {
  return str.length >= 2 ? str.substr(0, 1).toUpperCase() + str.substr(1) : str;
}
