import React from "react";

export const Pagination = ({ page, totalPages, setpage }) => {
     
  return (

    <div className="flex gap-3 mt-10 justify-center items-center">

      <button
        disabled={page === 1}
        onClick={() => setpage(page - 1)}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-lg font-semibold border border-white bg-[#ea580c] text-xl text-white font-bold px-5 py-[6px]">
        {page}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => setpage(page + 1)}
        className="px-4 py-2 border rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};
