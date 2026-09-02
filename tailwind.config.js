/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./shibata_church.tsx"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2F5D62',     // ディープ・フォレストグリーン：信仰と成長
        secondary: '#5E8B7E',   // セージグリーン：リラックス感
        accent: '#D7A86E',      // オークウッド・ベージュ：教会の木製ベンチ、DIY
        bglight: '#FDFCF8',     // ウォームアイボリー・生成り色：紙の聖書のような温かみ
        textdark: '#2C3E50',    // 深いチャコール
      },
      fontFamily: {
        serif: ['"Noto Serif JP"', 'serif'],
        sans: ['"Noto Sans JP"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
