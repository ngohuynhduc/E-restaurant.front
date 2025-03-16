import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "indent": ["error", 2], // ✅ Dùng 2 spaces
      "eqeqeq": ["error", "always"], // ✅ Bắt buộc === thay vì ==
      "prettier/prettier": ["error"], // ✅ Bắt buộc tuân theo Prettier
      "max-len": ["error", { code: 100, ignoreComments: true }], // ✅ Giới hạn độ dài dòng code
    },
    plugins: ["prettier"],
  },
];

export default eslintConfig;
