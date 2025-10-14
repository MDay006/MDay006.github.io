const Item = require('../models/item');
const User = require('../models/user');

const searchItems = (req, res) => {
  try {
    const { 
      q: query, 
      owner, 
      minQuantity, 
      maxQuantity, 
      sortBy = 'name', 
      sortOrder = 'asc',
      page = 1,
      limit = 20
    } = req.query;

    let items = req.user.role === 'admin' ? Item.findAll() : Item.findByUserId(req.user.id);
    
    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchTerm) ||
        item.username.toLowerCase().includes(searchTerm)
      );
    }

    // Owner filter (admin only)
    if (owner && req.user.role === 'admin') {
      items = items.filter(item => 
        item.username.toLowerCase().includes(owner.toLowerCase())
      );
    }

    // Quantity range filter
    if (minQuantity !== undefined) {
      items = items.filter(item => item.quantity >= parseInt(minQuantity));
    }
    if (maxQuantity !== undefined) {
      items = items.filter(item => item.quantity <= parseInt(maxQuantity));
    }

    // Sorting
    items.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'quantity') {
        aVal = parseInt(aVal);
        bVal = parseInt(bVal);
      } else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (sortOrder === 'desc') {
        return aVal < bVal ? 1 : -1;
      }
      return aVal > bVal ? 1 : -1;
    });

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedItems = items.slice(startIndex, endIndex);

    res.json({
      items: paginatedItems,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: items.length,
        totalPages: Math.ceil(items.length / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchItems };