const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');

var category = 'https://www.arezzo.com.br/c/sapatos';
var base_url = 'https://www.arezzo.com.br';
var page = 0;

request(category, function(err, res, body){
  if(err) console.log("Erro " + err);
  var $ = cheerio.load(body);

  next = $('.pagination li').find('.arz-pagination-control a[rel="next"]').attr('href');
  url_split = next.split('=');
  total_pages = url_split[url_split.length -1];

  while(page <= total_pages)
  {
    request('https://www.arezzo.com.br/c/sapatos?q=%3Acreation-time&page='+page, function(err, res, body){
      if(err) console.log("Houve um erro. Tente novamente mais tarde." + err);

      var $ = cheerio.load(body);

      $('.arz-storefront-products li').each(function(){
        
        url_product = $(this).find('div.arz-product-wrapper--bordered a').attr('href').trim();
        link = base_url+url_product;
        
        fs.appendFile('arezzo.txt', link + '\n', function(err){
          if (err) console.log(err);
          console.log('registro gerado');
        });
      });
    });
    page++;
  }
});