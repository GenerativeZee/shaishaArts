export default function ProductLoading() {
  return (
    <div className="w-full bg-[#FFF5F8] animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="aspect-square bg-white rounded-2xl border border-rose-100" />
          <div className="space-y-4 py-4">
            <div className="h-3 w-24 bg-rose-100 rounded" />
            <div className="h-8 w-3/4 bg-rose-100 rounded-xl" />
            <div className="h-8 w-24 bg-rose-200 rounded-xl" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-rose-50 rounded" />
              <div className="h-3 w-full bg-rose-50 rounded" />
              <div className="h-3 w-2/3 bg-rose-50 rounded" />
            </div>
            <div className="h-12 w-full bg-rose-100 rounded-full mt-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
