import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Package,
  AlertTriangle,
  Search,
  Plus,
  Pencil,
  Trash2,
  Boxes,
  DollarSign,
  Menu,
  X,
  RefreshCw,
} from "lucide-react";

import "./App.css";

const API = "http://localhost:8080/api/products";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    name: "",
    category: "",
    price: "",
    quantity: "",
    minStockLevel: 5,
  };

  const [form, setForm] = useState(emptyForm);

  // Fetch products from Spring Boot backend
  const loadProducts = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Unable to fetch products");
      }

      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Backend connection error:", error);
      alert("Backend connection failed. Please check Spring Boot.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Dashboard calculations
  const lowStock = products.filter(
    (p) => p.quantity <= p.minStockLevel
  );

  const totalUnits = products.reduce(
    (sum, p) => sum + p.quantity,
    0
  );

  const inventoryValue = products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  // Search products
  const filteredProducts = products.filter((p) =>
    `${p.name} ${p.category}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const displayedProducts =
    activePage === "Low Stock"
      ? filteredProducts.filter(
          (p) => p.quantity <= p.minStockLevel
        )
      : filteredProducts;

  // Open add product form
  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  // Open edit product form
  const openEditForm = (product) => {
    setEditingId(product.id);

    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      minStockLevel: product.minStockLevel,
    });

    setShowForm(true);
  };

  // Add or update product
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      minStockLevel: Number(form.minStockLevel),
    };

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server error (${response.status}): ${errorText}`
        );
      }

      setShowForm(false);
      setForm({ ...emptyForm });
      setEditingId(null);

      await loadProducts();

      alert(
        editingId
          ? "Product updated successfully!"
          : "Product added successfully!"
      );
    } catch (error) {
      console.error("Product save error:", error);
      alert(error.message);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete product");
      }

      await loadProducts();
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Sidebar navigation
  const navigation = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Products", icon: Package },
    { name: "Low Stock", icon: AlertTriangle },
  ];

  return (
    <div className="app-shell">

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "sidebar-open" : ""
        }`}
      >
        <div className="brand">
          <div className="brand-icon">
            <Boxes size={25} />
          </div>

          <div>
            <h2>StockEase</h2>
            <span>Inventory Management</span>
          </div>

          <button
            className="mobile-close"
            onClick={() => setSidebarOpen(false)}
          >
            <X />
          </button>
        </div>

        <p className="nav-label">MAIN MENU</p>

        {navigation.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.name}
              className={`nav-item ${
                activePage === item.name ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.name);
                setSidebarOpen(false);
              }}
            >
              <Icon size={19} />

              <span>{item.name}</span>

              {item.name === "Low Stock" &&
                lowStock.length > 0 && (
                  <b className="nav-count">
                    {lowStock.length}
                  </b>
                )}
            </button>
          );
        })}

        <div className="sidebar-bottom">
          <div className="profile-avatar">S</div>

          <div>
            <strong>StockEase Admin</strong>
            <span>Administrator</span>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">

        {/* TOP NAVIGATION */}

        <header className="topbar">
          <button
            className="menu-button"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <div>
            <span className="breadcrumb">
              Workspace / {activePage}
            </span>

            <h2>{activePage}</h2>
          </div>

          <button
            className="refresh-button"
            onClick={loadProducts}
          >
            <RefreshCw size={17} />
            Refresh
          </button>
        </header>

        <section className="page-content">

          {/* PAGE HEADING */}

          <div className="welcome-row">
            <div>
              <h1>Inventory Overview</h1>

              <p>
                Monitor your stock, products and inventory
                performance.
              </p>
            </div>

            <button
              className="primary-button"
              onClick={openAddForm}
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>

          {/* STATISTICS */}

          <div className="stats-grid">

            <div className="stat-card">
              <div className="stat-top">
                <span>Total Products</span>

                <div className="stat-icon purple">
                  <Package />
                </div>
              </div>

              <h2>{products.length}</h2>

              <small>Products in inventory</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Inventory Value</span>

                <div className="stat-icon green">
                  <DollarSign />
                </div>
              </div>

              <h2>
                ₹
                {inventoryValue.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </h2>

              <small>Total stock valuation</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Total Units</span>

                <div className="stat-icon blue">
                  <Boxes />
                </div>
              </div>

              <h2>{totalUnits}</h2>

              <small>Units currently available</small>
            </div>

            <div className="stat-card">
              <div className="stat-top">
                <span>Low Stock Items</span>

                <div className="stat-icon orange">
                  <AlertTriangle />
                </div>
              </div>

              <h2>{lowStock.length}</h2>

              <small>Products need restocking</small>
            </div>

          </div>

          {/* LOW STOCK ALERT */}

          {lowStock.length > 0 && (
            <div className="alert-banner">
              <AlertTriangle size={21} />

              <div>
                <strong>Low stock alert</strong>

                <p>
                  {lowStock.length} product(s) have reached
                  their minimum stock level.
                </p>
              </div>

              <button
                onClick={() => setActivePage("Low Stock")}
              >
                View items →
              </button>
            </div>
          )}

          {/* PRODUCT TABLE */}

          <section className="table-card">

            <div className="table-heading">
              <div>
                <h3>
                  {activePage === "Low Stock"
                    ? "Low Stock Products"
                    : "Product Inventory"}
                </h3>

                <p>
                  Manage and monitor your inventory items.
                </p>
              </div>

              <div className="search-box">
                <Search size={18} />

                <input
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>PRODUCT</th>
                    <th>CATEGORY</th>
                    <th>PRICE</th>
                    <th>QUANTITY</th>
                    <th>MIN. STOCK</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        Loading products...
                      </td>
                    </tr>
                  ) : (
                    <>
                      {displayedProducts.map((product) => {
                        const isLow =
                          product.quantity <= product.minStockLevel;

                        return (
                          <tr key={product.id}>
                            <td>
                              <div className="product-name">
                                <div className="product-icon">
                                  <Package size={18} />
                                </div>

                                <strong>{product.name}</strong>
                              </div>
                            </td>

                            <td>{product.category}</td>

                            <td>
                              ₹
                              {Number(product.price).toLocaleString(
                                "en-IN"
                              )}
                            </td>

                            <td>
                              <strong>{product.quantity}</strong>
                            </td>

                            <td>{product.minStockLevel}</td>

                            <td>
                              <span
                                className={`status ${
                                  isLow ? "low" : "in-stock"
                                }`}
                              >
                                {isLow ? "Low Stock" : "In Stock"}
                              </span>
                            </td>

                            <td>
                              <div className="action-buttons">
                                <button
                                  title="Edit"
                                  onClick={() =>
                                    openEditForm(product)
                                  }
                                >
                                  <Pencil size={16} />
                                </button>

                                <button
                                  title="Delete"
                                  className="delete-action"
                                  onClick={() =>
                                    deleteProduct(product.id)
                                  }
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}

                      {displayedProducts.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="empty-state"
                          >
                            No products found.
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>

            <div className="table-footer">
              Showing {displayedProducts.length} of{" "}
              {products.length} products
            </div>

          </section>
        </section>
      </main>

      {/* ADD / EDIT PRODUCT MODAL */}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowForm(false)}
        >
          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h3>
                  {editingId
                    ? "Edit Product"
                    : "Add New Product"}
                </h3>

                <p>Enter the product details below.</p>
              </div>

              <button
                onClick={() => setShowForm(false)}
              >
                <X />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <label>
                Product Name

                <input
                  required
                  placeholder="e.g. Laptop"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                />
              </label>

              <label>
                Category

                <input
                  required
                  placeholder="e.g. Electronics"
                  value={form.category}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      category: e.target.value,
                    })
                  }
                />
              </label>

              <div className="form-row">
                <label>
                  Price (₹)

                  <input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        price: e.target.value,
                      })
                    }
                  />
                </label>

                <label>
                  Quantity

                  <input
                    required
                    type="number"
                    min="0"
                    value={form.quantity}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        quantity: e.target.value,
                      })
                    }
                  />
                </label>
              </div>

              <label>
                Minimum Stock Level

                <input
                  required
                  type="number"
                  min="0"
                  value={form.minStockLevel}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      minStockLevel: e.target.value,
                    })
                  }
                />
              </label>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  {editingId
                    ? "Save Changes"
                    : "Add Product"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;