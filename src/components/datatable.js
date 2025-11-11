// Simple enhanced table component for Observable Framework
export function createDataTable(data, containerId, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) {
    throw new Error(`Container with id '${containerId}' not found`);
  }

  // Clear existing content
  container.innerHTML = '';
  // Create global search input
  const globalSearchDiv = document.createElement('div');
  globalSearchDiv.className = 'table-controls';
  
  const globalSearchInput = document.createElement('input');
  globalSearchInput.type = 'search';
  globalSearchInput.placeholder = 'Global search across all columns...';
  globalSearchInput.className = 'table-search';
  
  const exportDiv = document.createElement('div');
  exportDiv.className = 'export-buttons';
  
  const csvButton = document.createElement('button');
  csvButton.textContent = 'Export CSV';
  csvButton.className = 'export-btn';
  csvButton.onclick = () => exportToCSV(data, 'matches_1to1.csv');
  
  globalSearchDiv.appendChild(globalSearchInput);
  exportDiv.appendChild(csvButton);
  
  const controlsContainer = document.createElement('div');
  controlsContainer.className = 'controls-container';
  controlsContainer.appendChild(globalSearchDiv);
  controlsContainer.appendChild(exportDiv);
    container.appendChild(controlsContainer);

  // Create table wrapper for scrolling
  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'table-wrapper';
  
  // Create table element
  const table = document.createElement('table');
  table.className = 'enhanced-table';
  
  // Create header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  
  const columns = options.columns || Object.keys(data[0] || {});
  const headers = options.headers || {};
  
  // Column filters container
  const columnFiltersRow = document.createElement('tr');
  const columnFilters = {};
  columns.forEach(col => {
    const th = document.createElement('th');
    th.textContent = headers[col] || col;
    th.style.cursor = 'pointer';
    th.onclick = () => sortTable(table, columns.indexOf(col));
    headerRow.appendChild(th);
    
    // Create column filter
    const filterTh = document.createElement('th');
    const filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.placeholder = `Filter ${headers[col] || col}...`;
    filterInput.style.width = '100%';
    filterInput.style.fontSize = '12px';
    filterInput.style.padding = '4px';
    filterInput.style.border = '1px solid #ddd';
    filterInput.style.borderRadius = '3px';
    
    columnFilters[col] = filterInput;
    filterTh.appendChild(filterInput);
    columnFiltersRow.appendChild(filterTh);
  });
  
  thead.appendChild(headerRow);
  thead.appendChild(columnFiltersRow);
  table.appendChild(thead);
    // Create body
  const tbody = document.createElement('tbody');
  
  function applyFilters() {
    const globalTerm = globalSearchInput.value.toLowerCase();
    
    // Get column filter values
    const columnFiltersValues = {};
    Object.keys(columnFilters).forEach(col => {
      columnFiltersValues[col] = columnFilters[col].value.toLowerCase();
    });
    
    const filteredData = data.filter(row => {
      // Global search filter
      const globalMatch = !globalTerm || columns.some(col => {
        const value = String(row[col]).toLowerCase();
        return value.includes(globalTerm);
      });
      
      // Column-specific filters
      const columnMatch = columns.every(col => {
        const filterValue = columnFiltersValues[col];
        if (!filterValue) return true;
        
        const cellValue = String(row[col]).toLowerCase();
        return cellValue.includes(filterValue);
      });
      
      return globalMatch && columnMatch;
    });
    
    renderRows(filteredData);
  }
  
  function renderRows(dataToRender) {
    tbody.innerHTML = '';
    dataToRender.forEach((row, index) => {
      const tr = document.createElement('tr');
      columns.forEach(col => {
        const td = document.createElement('td');
        let value = row[col];
        
        // Apply custom formatting if provided
        if (options.formatters && options.formatters[col]) {
          value = options.formatters[col](value, row, index);
        }
        
        td.innerHTML = value;
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
  }
  
  // Initial render
  renderRows(data);
  
  // Global search functionality
  globalSearchInput.addEventListener('input', applyFilters);
  
  // Column filter functionality
  Object.keys(columnFilters).forEach(col => {
    columnFilters[col].addEventListener('input', applyFilters);
  });
    table.appendChild(tbody);
  tableWrapper.appendChild(table);
  container.appendChild(tableWrapper);
  
  return { table, data };
}

// Sort functionality
function sortTable(table, columnIndex) {
  const tbody = table.querySelector('tbody');
  const rows = Array.from(tbody.querySelectorAll('tr'));
  
  const sorted = rows.sort((a, b) => {
    const aVal = a.cells[columnIndex].textContent.trim();
    const bVal = b.cells[columnIndex].textContent.trim();
    
    // Try to parse as numbers
    const aNum = parseFloat(aVal.replace(/[$,]/g, ''));
    const bNum = parseFloat(bVal.replace(/[$,]/g, ''));
    
    if (!isNaN(aNum) && !isNaN(bNum)) {
      return aNum - bNum;
    }
    
    // Try to parse as dates
    const aDate = new Date(aVal);
    const bDate = new Date(bVal);
    
    if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
      return aDate - bDate;
    }
    
    // String comparison
    return aVal.localeCompare(bVal);
  });
  
  tbody.innerHTML = '';
  sorted.forEach(row => tbody.appendChild(row));
}

// Export to CSV functionality
function exportToCSV(data, filename) {
  const csvContent = [
    Object.keys(data[0]).join(','),
    ...data.map(row => Object.values(row).map(val => `"${val}"`).join(','))
  ].join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
