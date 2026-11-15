package com.stockease.stockease.service;

import com.stockease.stockease.model.Product;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ProductService {

    private final List<Product> products = new ArrayList<>();
    private int nextId = 1;

    public ProductService() {
        products.add(new Product(nextId++, "Laptop", "Electronics", 55000, 10, 5));
        products.add(new Product(nextId++, "Mouse", "Accessories", 500, 4, 5));
        products.add(new Product(nextId++, "Keyboard", "Accessories", 1200, 20, 5));
        products.add(new Product(nextId++, "Monitor", "Electronics", 12000, 3, 5));
    }

    public List<Product> getAllProducts() {
        return products;
    }

    public Product addProduct(Product product) {
        product.setId(nextId++);
        products.add(product);
        return product;
    }

    public Product updateProduct(int id, Product updatedProduct) {
        for (Product product : products) {
            if (product.getId() == id) {
                product.setName(updatedProduct.getName());
                product.setCategory(updatedProduct.getCategory());
                product.setPrice(updatedProduct.getPrice());
                product.setQuantity(updatedProduct.getQuantity());
                product.setMinStockLevel(updatedProduct.getMinStockLevel());
                return product;
            }
        }
        return null;
    }

    public boolean deleteProduct(int id) {
        return products.removeIf(product -> product.getId() == id);
    }

    public List<Product> getLowStockProducts() {
        List<Product> lowStock = new ArrayList<>();

        for (Product product : products) {
            if (product.getQuantity() <= product.getMinStockLevel()) {
                lowStock.add(product);
            }
        }

        return lowStock;
    }
}