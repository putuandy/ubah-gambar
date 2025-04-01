export const LoadingSpinner = () => {
    return (
      <div className="flex items-center justify-center py-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-blue-500 font-medium">Converting files, please wait...</span>
      </div>
    );
  };

  export const LoadingOverlay = () => {
    return (
        <div className="absolute inset-0 bg-black opacity-60 flex items-center justify-center z-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
        <span className="ml-4 text-white font-medium">Processing files, please wait...</span>
      </div>
    );
  };