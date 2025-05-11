"use client";

export default function Contact() {
  return (
    <div className="relative h-96 overflow-hidden">
      <div
        className="absolute top-0 left-0 w-full h-[140%] bg-cover bg-center -z-10"
        style={{
          backgroundImage: "url('/images/nha-hang.jpg')",
          backgroundAttachment: "fixed",
        }}
      />

      <div className="absolute inset-0 bg-black opacity-[0.3] z-10" />

      <div className="relative flex flex-col md:flex-row items-center justify-center h-full z-20 text-center text-white px-4 md:px-6">
        <h1 className="text-3xl md:text-4xl font-bold uppercase tracking-wider md:mr-6 mb-6 md:mb-0 text-shadow">
          LIÊN HỆ ĐẶT BÀN!
        </h1>
        <a
          href="/restaurants"
          className="inline-block py-3 px-6 bg-[#FF5722] text-white font-bold uppercase tracking-wide rounded-full transition-all duration-300 hover:bg-[#E64A19] hover:-translate-y-0.5 hover:shadow-lg"
        >
          Đặt bàn ngay
        </a>
      </div>

      <style jsx>{`
        .text-shadow {
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
