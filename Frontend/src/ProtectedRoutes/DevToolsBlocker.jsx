import { useEffect } from "react";

const DevToolsBlocker = () => {
  useEffect(() => {
    // Chặn các phím tắt mở DevTools
    const handleKeyDown = (event) => {
      // Chặn F12
      if (event.keyCode === 123) {
        event.preventDefault();
        return false;
      }
      // Chặn Ctrl+Shift+I
      if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
        event.preventDefault();
        return false;
      }
      // Chặn Ctrl+Shift+J (Console)
      if (event.ctrlKey && event.shiftKey && event.keyCode === 74) {
        event.preventDefault();
        return false;
      }
      // Chặn Ctrl+Shift+E (Network)
      if (event.ctrlKey && event.shiftKey && event.keyCode === 69) {
        event.preventDefault();
        return false;
      }
      // Chặn Ctrl+U (View Source)
      if (event.ctrlKey && event.keyCode === 85) {
        event.preventDefault();
        return false;
      }
    };

    // Chặn chuột phải
    const handleContextMenu = (event) => {
      event.preventDefault();
    };

    // Phát hiện DevTools bằng nhiều cách
    const detectDevTools = () => {
      // Kiểm tra kích thước cửa sổ
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;

      // Kiểm tra thời gian thực thi (DevTools làm chậm console.log)
      let start = performance.now();
      console.log("Checking DevTools...");
      let timeTaken = performance.now() - start;
      const isDevToolsOpen = timeTaken > 10; // Ngưỡng thời gian (ms)

      if (widthThreshold || heightThreshold || isDevToolsOpen) {
        document.body.innerHTML = "<h1>Đóng DevTools để tiếp tục!</h1>";
        document.body.style.backgroundColor = "#000";
        document.body.style.color = "#fff";
        throw new Error("DevTools detected!"); // Dừng thực thi JS
      }
    };

    // Chặn tải lại trang khi DevTools mở
    const preventReload = (event) => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        event.preventDefault();
        event.returnValue = "Đóng DevTools trước khi tải lại!";
        return "Đóng DevTools trước khi tải lại!";
      }
    };

    // Gắn sự kiện
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("beforeunload", preventReload);
    const interval = setInterval(detectDevTools, 500); // Giảm thời gian kiểm tra xuống 500ms

    // Chặn người dùng tắt JS bằng cách làm mờ nội dung nếu không có JS
    document.documentElement.setAttribute("data-js-check", "enabled");
    const style = document.createElement("style");
    style.innerHTML = `
      html:not([data-js-check="enabled"]) body {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    // Dọn dẹp
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("beforeunload", preventReload);
      clearInterval(interval);
      document.head.removeChild(style);
    };
  }, []);

  return null;
};

export default DevToolsBlocker;
