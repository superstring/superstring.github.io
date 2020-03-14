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

function capital(str) {
  return str.length >= 2 ? str.substr(0, 1).toUpperCase() + str.substr(1) : str;
}

function addCard(url, cover, title, subtitle) {
  return `
    <div class="card">
    <img src="${cover}" alt="card image" />

    <div class="card-body">
      <h4 class="card-title">${title}</h4>
      <h5 class="card-subtitle">${subtitle}</h5>
      <button><a href="${url}">Read More</a></button>
    </div>
  </div>
    `;
}

function addListItem(title, url) {
  return `<li><a href="${url}">${title}</a></li>`;
}

function addTopic(topic = '') {
  return `        
  <h3 class="topic title">
    <span class="badge success"># ${topic.toUpperCase()}</span>
  </h3>`;
}

function addBlog(blog = {}) {
  const $nav = document.querySelector('.collapsible-body > ul');
  const $blog = document.querySelector('.blog');
  for (let [type, topic] of Object.entries(blog)) {
    // add nav
    $nav.innerHTML += `<li><a href="#${type}">${capital(type)}</a></li>`;

    // add blog
    let $blogTopicStr = `<div class="blog-topic" id="${type}">`;
    $blogTopicStr += addTopic(type);
    $blogTopicStr += `<div class="blog-preview">`;
    topic.card.forEach(card => {
      $blogTopicStr += addCard(card.url, card.cover, card.title, card.subtitle);
    });
    $listStr = `<div><a class="more border border-secondary shadow shadow-hover" href="#">more</a><ul>`;
    topic.list.forEach(item => {
      $listStr += `<li><a href="${item.url}">${item.title}</a></li>`;
    });
    $listStr += `</ul></div>`;
    $blogTopicStr += $listStr;
    $blogTopicStr += `</div></div>`;
    $blog.innerHTML += $blogTopicStr;
  }
  $nav.innerHTML += `<li><a href="https://github.com/superstring">Github</a></li>`;
}

window.onload = function() {
  this.simpleAjax('GET', 'index.json', null, function(blog) {
    addBlog(JSON.parse(blog));
  });
};
