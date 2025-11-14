# eMotoCare (Mobile)

Một ứng dụng di động (React Native + Expo) cho dự án eMotoCare.

## Mục lục
- **Giới thiệu**: Tổng quan ngắn về project
- **Yêu cầu**: Phần mềm/SDK cần cài
- **Cài đặt & chạy**: Hướng dẫn thiết lập môi trường dev
- **Firebase & bí mật**: Cách lưu trữ tệp cấu hình riêng tư
- **Vấn đề phổ biến & cách khắc phục**: AsyncStorage, babel-preset-expo, RN Firebase modular
- **Đóng góp**: Hướng dẫn ngắn
- **Bản quyền**

## Giới thiệu
eMotoCare là ứng dụng di động front-end (React Native + Expo) cho hệ thống quản lý/chăm sóc xe (ví dụ). Mục đích của file này là hướng dẫn nhanh cách thiết lập môi trường dev, chạy ứng dụng và xử lý các vấn đề native phổ biến.

## Yêu cầu
- Node.js (v16+ khuyến nghị)
- npm hoặc yarn
- Expo CLI (`npm install -g expo-cli`) — hoặc sử dụng `npx expo` cho lệnh tại chỗ
- Android Studio (để chạy trên emulator Android) hoặc thiết bị thật
- (Tùy chọn) EAS CLI nếu dùng dev-client / builds: `npm install -g eas-cli` hoặc `npx eas`.

## Cài đặt & chạy (phát triển)
1. Cài dependencies:

```powershell
npm install
```

2. Chạy bundler (Metro):

```powershell
npx expo start
# Hoặc để xóa cache
npx expo start -c
```

3. Nếu bạn dùng Expo Go: mở ứng dụng Expo Go trên thiết bị và quét QR.

4. Nếu bạn sử dụng native modules không có trong Expo Go (ví dụ `@react-native-async-storage/async-storage`, `react-native-webview`, `expo-firebase-recaptcha`), hãy dùng dev-client hoặc prebuild:

Prebuild + chạy Android (local):

```powershell
npx expo prebuild
npx expo run:android
```

Hoặc dùng EAS dev client (khuyến nghị khi cần native modules):

```powershell
eas build --profile development --platform android
# cài apk lên thiết bị/emulator, sau đó
npx expo start --dev-client
```

## Firebase & tệp bí mật
- Tệp `emotocare-...-firebase-adminsdk-...json` (service account) và `google-services.json` chứa khóa/credentials — KHÔNG đưa lên Git.
- Repository đã thêm mẫu `.gitignore` để bỏ qua `google-services.json` và file service-account. Nếu bạn đã push các file chứa secrets lên remote, hãy **revoke/rotate** key ngay lập tức trong GCP và cân nhắc xóa khỏi lịch sử git (BFG hoặc `git filter-repo`).

Ví dụ lệnh xóa khỏi index (không xóa tệp local):

```powershell
git rm --cached emotocare-d41b2-firebase-adminsdk-fbsvc-cb1dfcd456.json
git rm --cached google-services.json
git add .gitignore
git commit -m "chore: ignore firebase credential files"
```

## Vấn đề phổ biến & cách khắc phục
- Native module AsyncStorage null (đỏ màn hình):
	- Nguyên nhân: native module chưa được biên dịch vào binary (thường do dùng Expo Go hoặc quên rebuild sau khi cài package).
	- Khắc phục: nếu dùng Expo Go -> build custom dev client (EAS) hoặc prebuild; nếu bare RN -> `npx react-native run-android` hoặc `pod install` + `npx react-native run-ios`. Luôn xóa cache Metro: `npx expo start -c`.

- Lỗi thiếu `babel-preset-expo` khi bundling:
	- Cài: `npm install --save-dev babel-preset-expo` và chạy lại bundler với cache sạch.

- Cảnh báo deprecation React Native Firebase (namespaced API):
	- Lưu ý: version v23+ khuyến nghị dùng API modular (named exports) như `requestPermission()` / `getToken()` thay vì `messaging().getToken()`; mình đã chuyển một số file sang API modular trong codebase.

## Cấu trúc thư mục chính (tóm tắt)
- `App.tsx` — entry
- `src/` — mã nguồn ứng dụng (screens, components, navigators, utils)
- `assets/` — hình ảnh, fonts
- `android/` `ios/` — (nếu đã prebuild)

## Đóng góp
- Tạo branch feature/topic (ví dụ `feature/login`), commit gọn, mở PR vào `main`.
- Trước khi PR, đảm bảo lint/pass basic tests và mô tả rõ các bước để chạy tính năng.

## Liên hệ
- Nếu cần hỗ trợ nhanh, mở issue trong repo hoặc gửi tin nhắn cho tác giả (ở phần thông tin contributor).

## Bản quyền
© 2025 eMotoCare — bản quyền thuộc nhóm phát triển.

---

Nếu bạn muốn tôi bổ sung: hướng dẫn CI, scripts dev, hoặc một phần README riêng cho release/EAS profiles, nói tôi sẽ thêm.
