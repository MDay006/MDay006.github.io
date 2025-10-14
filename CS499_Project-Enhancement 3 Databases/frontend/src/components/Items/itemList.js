import ApiService from '/services/api.js';
import { getUser, isAdmin } from '/services/auth.js';

class ItemListComponent {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.options = { showUserInfo: false, allowDelete: false, ...options };
    this.items = [];
    this.filteredItems = [];
    this.searchQuery = '';
    this.init();
  }

  async init() {
    this.render();
    this.bindEvents();
    await this.loadItems();
  }

  render() {
    this.container.innerHTML = `
      <div style="margin-top: 2rem;">
        <h2>My Items</h2>
        <div class="controls">
          <input type="text" id="itemSearch" placeholder="Search items...">
          <button id="clearSearch" class="btn-small">Clear</button>
          <span id="itemCount" style="margin-left: auto;">0 items</span>
        </div>
        <div id="itemList">Loading items...</div>
      </div>
    `;
  }

  bindEvents() {
    const searchInput = document.getElementById('itemSearch');
    const clearBtn = document.getElementById('clearSearch');

    searchInput.addEventListener('input', this.handleSearch.bind(this));
    clearBtn.addEventListener('click', this.clearSearch.bind(this));
  }

  async loadItems() {
    try {
      const items = this.options.adminMode 
        ? await ApiService.getAdminItems() 
        : await ApiService.getItems();
      
      this.items = items;
      this.filteredItems = [...items];
      this.renderItems();
    } catch (error) {
      this.renderError(error.message);
    }
  }

  handleSearch(e) {
    this.searchQuery = e.target.value.toLowerCase();
    this.filteredItems = this.items.filter(item =>
      item.name.toLowerCase().includes(this.searchQuery) ||
      (this.options.showUserInfo && item.username.toLowerCase().includes(this.searchQuery))
    );
    this.renderItems();
  }

  clearSearch() {
    document.getElementById('itemSearch').value = '';
    this.searchQuery = '';
    this.filteredItems = [...this.items];
    this.renderItems();
  }

  renderItems() {
    const listContainer = document.getElementById('itemList');
    const itemCount = document.getElementById('itemCount');
    
    itemCount.textContent = `${this.filteredItems.length} item${this.filteredItems.length !== 1 ? 's' : ''}`;

    if (this.filteredItems.length === 0) {
      listContainer.innerHTML = `
        <div class="empty-state">
          <h3>No items found</h3>
          <p>${this.searchQuery ? 'Try adjusting your search' : 'Add your first item above'}</p>
        </div>
      `;
      return;
    }

    const itemsHTML = this.filteredItems.map(item => this.renderItem(item)).join('');
    listContainer.innerHTML = `<ul class="item-list">${itemsHTML}</ul>`;
    
    // Bind item-specific events
    this.bindItemEvents();
  }

  renderItem(item) {
    const currentUser = getUser();
    const canEdit = isAdmin() || (currentUser && item.userId === currentUser.id);
    const canDelete = this.options.allowDelete && (isAdmin() || (currentUser && item.userId === currentUser.id));

    return `
      <li class="item">
        <div class="item-header">${this.escapeHtml(item.name)}</div>
        <div class="item-details">
          <strong>Quantity:</strong> ${item.quantity}
        </div>
        ${this.options.showUserInfo ? `
          <div class="item-details">
            <strong>Owner:</strong> ${this.escapeHtml(item.username)}<br>
            <strong>Created:</strong> ${new Date(item.createdAt).toLocaleDateString()}
          </div>
        ` : ''}
        <div class="item-actions">
          ${canEdit ? `<button class="btn-small edit-item" data-item-id="${item._id}">Edit</button>` : ''}
          ${canDelete ? `<button class="btn-danger btn-small delete-item" data-item-id="${item._id}">Delete</button>` : ''}
        </div>
      </li>
    `;
  }

  bindItemEvents() {
    const editButtons = document.querySelectorAll('.edit-item');
    const deleteButtons = document.querySelectorAll('.delete-item');

    editButtons.forEach(btn => {
      btn.addEventListener('click', this.handleEditItem.bind(this));
    });

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', this.handleDeleteItem.bind(this));
    });
  }

  handleEditItem(e) {
    const itemId = e.target.dataset.itemId;
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      this.showEditModal(item);
    }
  }

  async handleDeleteItem(e) {
    const itemId = e.target.dataset.itemId;
    const item = this.items.find(i => i.id === itemId);
    
    if (!item || !confirm(`Are you sure you want to delete "${item.name}"?`)) {
      return;
    }

    try {
      if (this.options.adminMode) {
        await ApiService.deleteItemAsAdmin(itemId);
      } else {
        await ApiService.deleteItem(itemId);
      }
      
      this.items = this.items.filter(i => i.id !== itemId);
      this.filteredItems = this.filteredItems.filter(i => i.id !== itemId);
      this.renderItems();
    } catch (error) {
      alert('Error deleting item: ' + error.message);
    }
  }

  showEditModal(item) {
    // Create modal for editing
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h3>Edit Item</h3>
          <button class="modal-close">&times;</button>
        </div>
        <form id="editItemForm">
          <div class="form-group">
            <label for="editName">Name</label>
            <input type="text" id="editName" name="name" value="${this.escapeHtml(item.name)}" required>
          </div>
          <div class="form-group">
            <label for="editQuantity">Quantity</label>
            <input type="number" id="editQuantity" name="quantity" value="${item.quantity}" min="0" required>
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="button" class="cancel-edit">Cancel</button>
            <button type="submit" class="btn-success">Update Item</button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Bind modal events
    const closeModal = () => modal.remove();
    modal.querySelector('.modal-close').addEventListener('click', closeModal);
    modal.querySelector('.cancel-edit').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    modal.querySelector('#editItemForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      
      try {
        const updatedItem = await ApiService.updateItem(item.id, {
          name: formData.get('name'),
          quantity: parseInt(formData.get('quantity'))
        });

        // Update local data
        const index = this.items.findIndex(i => i.id === item.id);
        if (index !== -1) {
          this.items[index] = { ...this.items[index], ...updatedItem };
          this.filteredItems = this.items.filter(i =>
            i.name.toLowerCase().includes(this.searchQuery) ||
            (this.options.showUserInfo && i.username.toLowerCase().includes(this.searchQuery))
          );
          this.renderItems();
        }

        closeModal();
      } catch (error) {
        alert('Error updating item: ' + error.message);
      }
    });
  }

  renderError(message) {
    document.getElementById('itemList').innerHTML = `
      <div class="error">
        Error loading items: ${message}
      </div>
    `;
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Public method to refresh items
  async refresh() {
    await this.loadItems();
  }
}

export default ItemListComponent;