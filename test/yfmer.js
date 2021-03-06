const assert = require('assert');
const yfmer = require('../src/yfmer');

const sample = {ID:37,site_ID:114719957,author:{ID:96215311,login:"smartzoukos",email:!1,name:"smartzoukos",first_name:"",last_name:"",nice_name:"smartzoukos",URL:"http://humboldtforumapi.wordpress.com",avatar_URL:"https://1.gravatar.com/avatar/15834108d692df9924dd0c4b1fdb62d2?s=96&d=identicon&r=G",profile_URL:"http://en.gravatar.com/smartzoukos",site_ID:114719957},date:"2016-07-29T15:22:36+00:00",modified:"2016-07-29T15:22:36+00:00",title:"This is supposed to be markdown",URL:"https://humboldtforumapi.wordpress.com/2016/07/29/this-is-supposed-to-be-markdown/",short_URL:"http://wp.me/p7LlTT-B",content:"<p>So this is a paragraph and this is a list of items:</p>\n<ul>\n<li>List item 1</li>\n<li>List item 2</li>\n<li>List item 3</li>\n</ul>\n",excerpt:"<p>So this is a paragraph and this is a list of items: List item 1 List item 2 List item 3</p>\n",slug:"this-is-supposed-to-be-markdown",guid:"https://humboldtforumapi.wordpress.com/?p=37",status:"publish",sticky:!1,password:"",parent:!1,type:"post",discussion:{comments_open:!0,comment_status:"open",pings_open:!0,ping_status:"open",comment_count:0},likes_enabled:!0,sharing_enabled:!0,like_count:0,i_like:!1,is_reblogged:!1,is_following:!1,global_ID:"b6a8ff63e480746f79193ad7072db567",featured_image:"",post_thumbnail:null,format:"standard",geo:!1,menu_order:0,page_template:"",publicize_URLs:[],terms:{category:{Uncategorized:{ID:1,name:"Uncategorized",slug:"uncategorized",description:"",post_count:5,parent:0,meta:{links:{self:"https://public-api.wordpress.com/rest/v1.1/sites/114719957/categories/slug:uncategorized",help:"https://public-api.wordpress.com/rest/v1.1/sites/114719957/categories/slug:uncategorized/help",site:"https://public-api.wordpress.com/rest/v1.1/sites/114719957"}}}},post_tag:{},post_format:{},mentions:{}},tags:{},categories:{Uncategorized:{ID:1,name:"Uncategorized",slug:"uncategorized",description:"",post_count:5,parent:0,meta:{links:{self:"https://public-api.wordpress.com/rest/v1.1/sites/114719957/categories/slug:uncategorized",help:"https://public-api.wordpress.com/rest/v1.1/sites/114719957/categories/slug:uncategorized/help",site:"https://public-api.wordpress.com/rest/v1.1/sites/114719957"}}}},attachments:{},attachment_count:0,metadata:!1,meta:{links:{self:"https://public-api.wordpress.com/rest/v1.1/sites/114719957/posts/37",help:"https://public-api.wordpress.com/rest/v1.1/sites/114719957/posts/37/help",site:"https://public-api.wordpress.com/rest/v1.1/sites/114719957",replies:"https://public-api.wordpress.com/rest/v1.1/sites/114719957/posts/37/replies/",likes:"https://public-api.wordpress.com/rest/v1.1/sites/114719957/posts/37/likes/"}},capabilities:{publish_post:!1,delete_post:!1,edit_post:!1},other_URLs:{}};

describe('The yfmer module', () => {
  it('should return an empty front matter if no data given', () => {
    const actual = yfmer();
    const expect = '---\n---\n';
    assert.equal(actual, expect);
  });

  it('should return an empty front matter if no spec given', () => {
    const actual = yfmer(sample);
    const expect = '---\n---\n';
    assert.equal(actual, expect);
  });

  it('should apply static values directly', () => {
    const actual = yfmer(sample, {
      layout: 'post'
    });
    const expect = '---\nlayout: post\n---\n';
    assert.equal(actual, expect);
  });

  it('should look up for falsey values', () => {
    let actual, expect;

    actual = yfmer(sample, {
      title: undefined
    });
    expect = '---\ntitle: This is supposed to be markdown\n---\n';
    assert.equal(actual, expect);

    actual = yfmer(sample, {
      title: null
    });
    expect = '---\ntitle: This is supposed to be markdown\n---\n';
    assert.equal(actual, expect);

    actual = yfmer(sample, {
      title: false
    });
    expect = '---\ntitle: This is supposed to be markdown\n---\n';
    assert.equal(actual, expect);
  });

  it('should lookup for nested falsey values', () => {
    const actual = yfmer(sample, {
      'author.ID': undefined
    });
    const expect = '---\nauthor.ID: 96215311\n---\n';
    assert.equal(actual, expect);
  });

  it('should return empty value in case not found', () => {
    const actual = yfmer(sample, {
      foobar: undefined
    });
    const expect = '---\nfoobar: \n---\n';
    assert.equal(actual, expect);
  });

  it('should return callback value when function given', () => {
    let actual, expect;

    actual = yfmer(sample, {
      author: () => 'foobar'
    });
    expect = '---\nauthor: foobar\n---\n';
    assert.equal(actual, expect);

    actual = yfmer(sample, {
      author: (data) => data.author.login
    });
    expect = '---\nauthor: smartzoukos\n---\n';
    assert.equal(actual, expect);
  });
});
