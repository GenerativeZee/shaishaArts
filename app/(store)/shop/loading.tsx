export default function ShopLoading() {
  return (
    <div className="w-full bg-[#FFF5F8]">
      <div className="py-12 bg-white border-b border-rose-100 animate-pulse">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 w-48 bg-rose-100 rounded-xl mb-2" />
          <div className="h-4 w-32 bg-rose-50 rounded-lg" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-14 w-full bg-white rounded-2xl border border-rose-100 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-rose-100 overflow-hidden animate-pulse">
              <div className="aspect-square bg-rose-50" />
              <div className="p-4 space-y-2">
                <div className="h-3 w-20 bg-rose-50 rounded" />
                <div className="h-4 w-full bg-rose-100 rounded" />
                <div className="h-3 w-3/4 bg-rose-50 rounded" />
                <div className="h-3 w-1/2 bg-rose-50 rounded" />
                <div className="flex justify-between items-center pt-2 border-t border-rose-50">
                  <div className="h-6 w-16 bg-rose-100 rounded" />
                  <div className="h-8 w-16 bg-rose-50 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
