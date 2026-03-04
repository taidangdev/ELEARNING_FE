export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8">

        {/* Logo */}
        <div>
          <h2 className="text-xl font-bold">EduCenter</h2>
          <p className="text-gray-400 mt-3">
            Nền tảng học online giúp bạn phát triển kỹ năng thực tế.
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="font-semibold mb-3">Khóa học</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Frontend</li>
            <li>Backend</li>
            <li>UI/UX</li>
            <li>Marketing</li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-semibold mb-3">Hỗ trợ</h3>
          <ul className="space-y-2 text-gray-400">
            <li>Liên hệ</li>
            <li>Chính sách</li>
            <li>Điều khoản</li>
            <li>FAQ</li>
          </ul>
        </div>

        {/* Contact + Google Maps */}
        <div>
          <h3 className="font-semibold mb-3">Liên hệ</h3>

          <p className="text-gray-400">📍 TP.HCM, Việt Nam</p>
          <p className="text-gray-400">📧 support@educenter.vn</p>
          <p className="text-gray-400 mb-3">📞 0900 000 000</p>

          {/* Google Maps */}
          <div className="rounded-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps?q=Ho%20Chi%20Minh%20City&output=embed"
              width="100%"
              height="150"
              style={{ border: 0 }}
              loading="lazy"
            ></iframe>
          </div>
        </div>

      </div>

      <div className="border-t border-gray-700 text-center py-4 text-gray-400 text-sm">
        © 2026 EduCenter. All rights reserved.
      </div>
    </footer>
  );
}