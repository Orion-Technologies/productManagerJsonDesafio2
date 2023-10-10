const fs = require('fs')
const { title } = require('process')

class ProductManager {
  #path;
  #format;
  #products;
  #nextId;

  constructor(path) {
    this.#path = path;
    this.#format = "utf-8";
    this.#products = [];
    this.#nextId = 1;
  }

  autoId = () => {
    if (this.#products.length === 0) {
      return 1; // Si no hay productos, el primer ID es 1
    } else {
      // Encontrar el máximo ID existente y agregar 1
      const maxId = Math.max(...this.#products.map((product) => product.id));
      return maxId + 1;
    }
  };

  addProduct = async (title, description, price, thumbnail, code, stock) => {
    const id = this.autoId();
    const product = { id, title, description, price, thumbnail, code, stock };
    const codeValidate = (productCode) => productCode.code === code;
    if (this.#products.some(codeValidate)) {
      console.log("El producto ya existe");
    } else {
      this.#products.push(product);
      await fs.promises.writeFile(
        this.#path,
        JSON.stringify(this.#products, null, "\t")
      );
      return product;
    }
  };

  getProducts = async () => {
    try {
      return JSON.parse(await fs.promises.readFile(this.#path, this.#format));
    } catch (e) {
      console.log("Error al leer el archivo");
      return [];
    }
  };

  getProductsById = async (id) => {
    const findById = this.#products.find((product) => product.id === id);
    return findById || "Not found";
  };

  updateProduct = async (id, update) => {
    const indice = this.#products.findIndex((product) => product.id === id);
    if (indice !== -1) {
      const product = this.#products[indice];
      Object.assign(product, update);
      await fs.promises.writeFile(
        this.#path,
        JSON.stringify(this.#products, null, "\t")
      );
      console.log("Product updated", product);
      return product;
    }
    return console.log("Error to update product. Product not found");
  };

  deleteProduct = async (id) => {
    try {
      const product = this.#products.find((product2) => product2.id === id);
      if (!product) {
        return `Product with ID ${id} not Found`;
      }
      const deleteProductId = this.#products.filter(
        (product) => product.id !== id
      );
      if (this.#products.length !== deleteProductId.length) {
        await fs.promises.writeFile(
          this.#path,
          JSON.stringify(deleteProductId, null, "\t")
        );
        return `${product.title}: Product deleted`;
      }
    } catch (err) {
      console.log(err);
    }
  };
}

const productManager = new ProductManager('./db.json')

productManager.addProduct(
  "Electronico-1",
  "Aparato electronico",
  1500,
  "path-image",
  "01",
  50
);

productManager.addProduct(
  "Electronico-2",
  "Aparato electronico Linea Blanca",
  5000,
  "path-image",
  "02",
  100
);

productManager.addProduct(
  "producto prueba",
  "Este es un producto prueba",
  200,
  "Sin Imagen",
  "abc123",
  25
);

console.log(productManager.getProductsById(1))
console.log(productManager.getProductsById(2));
console.log(productManager.getProductsById(3));
console.log(productManager.getProductsById(4));
