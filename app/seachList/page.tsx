// SANG

import { getCourses } from "../services/course.service";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ keyword?: string }>;
}) {
  // ✅ unwrap Promise
  const params = await searchParams;

  const keyword = params.keyword || "";

  // lấy danh sách khóa học
  const courses = await getCourses();

  // filter theo tên khóa học
  const filteredCourses = courses.filter((course: any) =>
    course.tenKhoaHoc
      ?.toLowerCase()
      .includes(keyword.toLowerCase())
  );

 return (
  <div className="bg-gray-50 min-h-screen pt-24">
    <div className="max-w-7xl mx-auto px-6">

      {/* TITLE */}
      <h2 className="text-3xl font-bold text-center mb-12">
        Kết quả tìm kiếm:
        <span className="text-blue-600 ml-2">{keyword}</span>
      </h2>

      {/* EMPTY */}
      {filteredCourses.length === 0 && (
        <p className="text-center text-gray-500">
          Không tìm thấy khóa học 😢
        </p>
      )}

      {/* GRID */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCourses.map((course: any) => (
          <a
            key={course.maKhoaHoc}
            href={`/course/${course.maKhoaHoc}`}
            className="group bg-white rounded-2xl overflow-hidden
                       shadow-md hover:shadow-xl
                       transition duration-300 flex flex-col"
          >
            {/* IMAGE */}
            <div className="overflow-hidden">
              <img
                src={course.hinhAnh}
                alt={course.tenKhoaHoc}
                className="w-full h-48 object-cover
                           group-hover:scale-105 transition duration-300"
              />
            </div>

            {/* CONTENT */}
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600">
                {course.tenKhoaHoc}
              </h3>

              <p className="text-gray-500 text-sm mt-2 line-clamp-3 flex-1">
                {course.moTa}
              </p>

              <div className="mt-4 pt-4 border-t text-sm text-gray-400">
                Xem chi tiết →
              </div>
            </div>
          </a>
        ))}
      </div>

    </div>
  </div>
);
}