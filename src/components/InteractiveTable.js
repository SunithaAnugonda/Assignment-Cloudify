import { useState } from 'react';

const CustomDropdown = ({ 
  selected, 
  options, 
  onChange, 
  isMulti, 
  onAddNewItem,
  usedOptions = new Set()
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newItem, setNewItem] = useState('');

  const handleSelect = (option) => {
    if (isMulti) {
      const updatedSelection = selected.includes(option)
        ? selected.filter(item => item !== option)
        : [...selected, option];
      onChange(updatedSelection);
    } else {
      onChange(option);
      setIsOpen(false);
    }
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim()) {
      onAddNewItem(newItem.trim());
      setNewItem('');
    }
  };

  return (
    <div className="relative w-full">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 border rounded bg-white cursor-pointer min-h-[40px] flex flex-wrap gap-2 items-center"
      >
        {isMulti ? (
          <>
            {selected.length > 0 ? selected.map(item => (
              <span key={item} className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1">
                {item}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelect(item);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </span>
            )) : <span className="text-gray-400">Select Options</span>}
          </>
        ) : (
          <span>{selected || 'Select an option'}</span>
        )}
      </div>

      {isOpen && (
        <div className="absolute w-full mt-1 border rounded bg-white shadow-lg z-10">
          {isMulti ? (
            <div className="max-h-[200px] overflow-y-auto">
              {options.map(option => (
                <label 
                  key={option}
                  className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selected.includes(option)}
                    onChange={() => handleSelect(option)}
                    className="mr-2"
                  />
                  {option}
                </label>
              ))}
              <form onSubmit={handleAddItem} className="p-2 border-t">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder="Add new item"
                    className="flex-1 p-1 border rounded"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button 
                    type="submit"
                    className="px-3 py-1 bg-black text-white rounded hover:bg-gray-800"
                  >
                    Add
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="max-h-[200px] overflow-y-auto">
              {options.map(option => (
                <div
                  key={option}
                  onClick={() => !usedOptions.has(option) && handleSelect(option)}
                  className={`p-2 cursor-pointer ${
                    usedOptions.has(option) ? 'text-gray-400' : 'hover:bg-blue-500 hover:text-white'
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const InteractiveTable = () => {
  const [singleSelectOptions] = useState([
    'Option 1', 'Option 2', 'Option 3', 'Option 4'
  ]);
  
  const [multiSelectOptions, setMultiSelectOptions] = useState([
    'Option 1', 'Option 2', 'Option 3', 'Option 4'
  ]);
  
  const [rows, setRows] = useState([
    { id: 1, singleSelect: '', multiSelect: [] }
  ]);
  
  const [usedOptions, setUsedOptions] = useState(new Set());

  const handleSingleSelectChange = (rowId, value) => {
    setRows(rows.map(row => {
      if (row.id === rowId) {
        if (row.singleSelect) {
          setUsedOptions(prev => {
            const updated = new Set(prev);
            updated.delete(row.singleSelect);
            return updated;
          });
        }
        setUsedOptions(prev => new Set([...prev, value]));
        return { ...row, singleSelect: value };
      }
      return row;
    }));
  };

  const handleMultiSelectChange = (rowId, value) => {
    setRows(rows.map(row => 
      row.id === rowId ? { ...row, multiSelect: value } : row
    ));
  };

  const addRow = () => {
    setRows([...rows, {
      id: rows.length + 1,
      singleSelect: '',
      multiSelect: []
    }]);
  };

  const handleAddOption = (newOption) => {
    if (!multiSelectOptions.includes(newOption)) {
      setMultiSelectOptions([...multiSelectOptions, newOption]);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="border rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 bg-gray-50">
          <div className="p-4 font-medium border-r">Label 1</div>
          <div className="p-4 font-medium">Label 2</div>
        </div>
        {rows.map(row => (
          <div key={row.id} className="grid grid-cols-2 border-t">
            <div className="p-4 border-r">
              <CustomDropdown
                selected={row.singleSelect}
                options={singleSelectOptions}
                onChange={(value) => handleSingleSelectChange(row.id, value)}
                usedOptions={usedOptions}
              />
            </div>
            <div className="p-4">
              <CustomDropdown
                selected={row.multiSelect}
                options={multiSelectOptions}
                onChange={(value) => handleMultiSelectChange(row.id, value)}
                isMulti
                onAddNewItem={handleAddOption}
              />
            </div>
          </div>
        ))}
      </div>
      <button 
        onClick={addRow}
        className="mt-4 px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 flex items-center gap-2 ml-auto"
      >
        <span className="text-xl">+</span>
        Add New Row
      </button>
    </div>
  );
};

export default InteractiveTable;