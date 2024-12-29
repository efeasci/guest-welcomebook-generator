export const addCustomStyles = () => {
  const style = document.createElement('style');
  style.textContent = `
    .pac-container {
      z-index: 1000;
      border-radius: 0.375rem;
      border: 1px solid #e2e8f0;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .pac-item {
      padding: 8px 12px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .pac-item:hover {
      background-color: #e5edff;
    }
    .pac-item-selected {
      background-color: #e5edff;
    }
  `;
  document.head.appendChild(style);
  return () => {
    document.head.removeChild(style);
  };
};