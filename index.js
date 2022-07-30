const http = require("http");
const fs = require("fs");
const url = require("url");


// overview page function
const replaceTemplate = (temp, product) => {

    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%PRICE%}/g, product.price);
    output = output.replace(/{%FROM%}/g, product.from);
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
    output = output.replace(/{%QUANTITY%}/g, product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, product.description);
    output = output.replace(/{%ID%}/g, product.id);

    if (!product.organic){
         output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }

    return output;
}


// HTML pages
const tempOverview = fs.readFileSync(`${__dirname}/template/template-overview.html`,'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/template/template-card.html`,'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/template/template-product.html`,'utf-8');

// DATA
const data = fs.readFileSync(`${__dirname}/data.json`,'utf-8');
const dataobj = JSON.parse(data);

const server = http.createServer((req, res) => {

    const { query, pathname } =  url.parse(req.url, true);

    // overview
    if (pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {
            'content-type': 'text/html'
        });

        const cardhtml = dataobj.map( (el) => replaceTemplate(tempCard, el)).join('');
        const overviewTemplate = tempOverview.replace('{%PRODUCT_CARDS%}', cardhtml);

        res.end(overviewTemplate);
    }

    // products
    else if ( pathname === '/product'){
        res.writeHead(200, {
            'content-type': 'text/html'
        });
        const product = dataobj[query.id];
        const productTemplate = replaceTemplate(tempProduct, product);
        res.end(productTemplate);
    }

    // api
    else if ( pathname === '/api'){
        res.writeHead(200, {
            'content-type': 'application/json'
        });
        res.end(data);
    }

    // error
    else{
        res.writeHead(404,{
            'content-type': 'text/html'
        });
        res.end("<h1>Page not found!</h1>");
    }
});

server.listen(3000, '127.0.0.1', ()=>{
    console.log("listening on port 3000");
});