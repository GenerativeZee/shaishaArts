import { prisma } from "@/lib/prisma";
import AdminReviewsTable from "./AdminReviewsTable";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { createdAt: "desc" },
  });

  const pending = reviews.filter((r) => !r.isApproved).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {reviews.length} total · {pending} pending approval
          </p>
        </div>
      </div>
      <AdminReviewsTable initialReviews={reviews} />
    </div>
  );
}
