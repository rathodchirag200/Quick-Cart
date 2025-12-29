import React from "react";

export const Confirmdelete = ({ onConfirm, onCancel }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-[#0303037d] bg-opacity-50 z-50"
      tabIndex={-1}
    >
      <div className="bg-white rounded-lg shadow-lg p-6 w-80 relative">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-900 p-1 rounded-full"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            />
          </svg>
        </button>

        <svg
          className="w-12 h-12 text-gray-400 mx-auto mb-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
          />
        </svg>

        <p className="text-center text-gray-700 mb-6">
          Are you sure you want to delete this item?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="py-2 px-4 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
};
