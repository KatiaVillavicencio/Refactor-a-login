import { Router } from 'express';
const routerP = Router()

import ProductManager from '../dao/managers/productManagerMongo.js';
const pm = new ProductManager()

//ENDPOINTS

//http://localhost:8080/api/products/?limit=1
//http://localhost:8080/api/products/?sort=1
//http://localhost:8080/api/products/?page=1
//http://localhost:8080/api/products/?category=hogar

routerP.get('/', async (req, res) => {
  try {
      let { limit, page, sort, category } = req.query
      console.log(req.originalUrl);
      console.log(req.originalUrl.includes('page'));

      const options = {
          page: Number(page) || 1,
          limit: Number(limit) || 10,
          sort: { price: Number(sort) }

      };

  //desc --> -1 / asc --> 1

      if (!(options.sort.price === -1 || options.sort.price === 1)) {
           options.sort = {}
      }


      const links = (products) => {
          let prevLink;
          let nextLink;
          if (req.originalUrl.includes('page')) {
                // Si la URL original contiene el parámetro 'page', entonces:

              prevLink = products.hasPrevPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.prevPage}`) : null;
              nextLink = products.hasNextPage ? req.originalUrl.replace(`page=${products.page}`, `page=${products.nextPage}`) : null;
              return { prevLink, nextLink };
          }
      
          return { prevLink, nextLink };

      }

      // Devuelve un array con las categorias disponibles y compara con la query "category"
      const categories = await pm.categories()

      const result = categories.some(categ => categ === category)
      if (result) {

          const products = await pm.getProducts({ category }, options);
          const { prevLink, nextLink } = links(products);
          const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
          return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
      }

      const products = await pm.getProducts({}, options);
      // console.log(products, 'Product');
      const { totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, docs } = products
      const { prevLink, nextLink } = links(products);
      return res.status(200).send({ status: 'success', payload: docs, totalPages, prevPage, nextPage, hasNextPage, hasPrevPage, prevLink, nextLink });
  } catch (err) {
      console.log(err);
  }


})

  routerP.get("/:pid", async (req, res) => {
    const {pid}=req.params
    const productfind = await pm.getProductById(pid);
    res.json({ status: "success", productfind });
  });

  routerP.post("/", async (req, res) => {
    const obj=req.body
    const newproduct = await pm.addProduct(obj);
     res.json({ status: "success", newproduct });
  });

  routerP.put("/:pid", async (req, res) => {
    const {pid}=req.params
    const obj=req.body
    const updatedproduct = await pm.updateProduct(pid,obj);
    console.log(updatedproduct)
     res.json({ status: "success", updatedproduct });
  });
 
  
  routerP.delete("/:pid", async (req, res) => {
    const id=req.params.pid
    const deleteproduct = await pm.deleteProduct(id);
     res.json({ status: "success",deleteproduct });
  });

  
export default routerP