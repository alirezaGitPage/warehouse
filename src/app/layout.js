import vazirFont from "@/ui/fonts";
import "@styles/globals.css";

export const metadata = {
  title: "انبارداری شخصی من",
  description: "پروژه آزمایشی انبارداری شخصی",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirFont.variable} font-sans`}>
        {children}
      </body>
    </html>
  );
}
