// src/components/ArtHubAI.tsx
import React, { useState, useRef, useEffect, useMemo } from "react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import { AIConversationGetAPI } from "../../API/AIConversationAPI/GET.tsx";
import { AIConversationPostAPI } from "../../API/AIConversationAPI/POST.tsx";
import { UserGetAPI } from "../../API/UserAPI/GET.tsx";
import "../../css/ArtHubAI.css";
import { useAuth } from "../../secure/AuthContext.tsx";
import { useApiService } from "../../service/api.tsx";

// Icons fallback
const Send = (props: any) => <span {...props}>Send</span>;
const Loader2 = (props: any) => (
  <div {...props} className={`${props.className || ""} arthub-loading-dots`}>
    <div className="dot"></div>
    <div className="dot"></div>
    <div className="dot"></div>
  </div>
);

const ImageIcon = (props: any) => (
  <img src="/icons/ai.png" alt="AI" className={props.className} style={{ width: "24px", height: "24px" }} />
);

type ConversationLocal = {
  id: string;
  prompt: string;
  imageUrl: string;
  createdAt: string;
};

export default function ArtHubAI() {
  const [conversations, setConversations] = useState<ConversationLocal[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [showInsufficientFunds, setShowInsufficientFunds] = useState(false);
  const [userCoins, setUserCoins] = useState<number>(0);

  const navigate = useNavigate();
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const getApiRef = useRef<ReturnType<typeof AIConversationGetAPI> | null>(null);
  const postApiRef = useRef<ReturnType<typeof AIConversationPostAPI> | null>(null);
  const userApiRef = useRef<ReturnType<typeof UserGetAPI> | null>(null);

  if (!getApiRef.current) {
    getApiRef.current = AIConversationGetAPI();
  }
  if (!postApiRef.current) {
    postApiRef.current = AIConversationPostAPI();
  }
  if (!userApiRef.current) {
    userApiRef.current = UserGetAPI();
  }

  const { getConversations } = getApiRef.current;
  const { createConversation } = postApiRef.current;
  const { getUserByIdUrl } = userApiRef.current;

  // TẢI COINS CỦA USER
  useEffect(() => {
    const fetchUserCoins = async () => {
      try {
        if (user?._id && getUserByIdUrl) {
          const response: any = await getUserByIdUrl(user._id);
          const coins = response?.data?.coins || 0;
          setUserCoins(typeof coins === "string" ? parseFloat(coins) : Number(coins));
        }
      } catch (error) {
        setUserCoins(0);
      }
    };

    fetchUserCoins();
  }, [user?._id, getUserByIdUrl]);

  // Function để load conversations
  const loadConversations = async () => {
    if (!getConversations) return;

    try {
      const res: any = await getConversations();
      const dataArr = Array.isArray(res) ? res : res?.data || [];

      const formatted = dataArr.map((c: any) => ({
        id: c._id || c.conversationId || "",
        prompt: c.Prompt || "",
        imageUrl: c.ImageUrl || "",
        createdAt: c.CreatedAt || "",
      }));

      // Sort: mới nhất trước (cho sidebar - hiển thị mới nhất trên cùng)
      const sorted = formatted.sort(
        (a: ConversationLocal, b: ConversationLocal) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setConversations(sorted);
      setHasStarted(sorted.length > 0);
      return sorted;
    } catch (error) {
      return [];
    }
  };

  // TẢI LỊCH SỬ
  useEffect(() => {
    const loadHistory = async () => {
      const conversations = await loadConversations();
      setIsLoadingHistory(false);

      // Kiểm tra ID conversation đã lưu trong localStorage
      const savedId = localStorage.getItem("lastConversationId");
      if (savedId) {
        setSelectedId(savedId);
        localStorage.removeItem("lastConversationId"); // Xóa sau khi đã sử dụng
      } else if (conversations && conversations.length > 0) {
        // Nếu không có ID đã lưu, chọn conversation mới nhất
        const latestConversation = conversations[0];
        setSelectedId(latestConversation.id);
      }
    };

    loadHistory();
  }, [getConversations]);

  // Scroll
  useEffect(() => {
    if (hasStarted && !isLoadingHistory) {
      chatContainerRef.current?.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [conversations, hasStarted, isLoadingHistory]);

  const sendPrompt = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !createConversation) return;

    // Kiểm tra coins trước khi gọi API
    const requiredCoins = 0.5;
    const currentCoins = typeof userCoins === "string" ? parseFloat(userCoins) : Number(userCoins);

    if (isNaN(currentCoins) || currentCoins < requiredCoins) {
      // Không đủ coins, hiển thị dialog và redirect
      setShowInsufficientFunds(true);
      setTimeout(() => {
        setShowInsufficientFunds(false);
        navigate("/characters/depositecoin");
      }, 3000);
      return;
    }

    const userPrompt = input.trim();
    setInput("");
    setHasStarted(true);
    setIsLoading(true);

    const tempId = Date.now().toString();
    const newConv: ConversationLocal = {
      id: tempId,
      prompt: userPrompt,
      imageUrl: "",
      createdAt: new Date().toISOString(),
    };

    setConversations((prev) => [...prev, newConv]);

    try {
      // Backend expect "prompt" (lowercase) not "Prompt"
      const res: any = await createConversation({ prompt: userPrompt });

      // apiService.post trả về: { status: boolean, data: <backend response>, ... }
      // POST.tsx return response.data = backend response object
      // Backend response: { status: "success", message: "...", data: { conversationId, UserId, ImageUrl, CreatedAt }, timestamp }

      // Nếu res là null hoặc undefined, thử lấy từ response khác
      let backendResponse = res;

      // Nếu res có structure { status: boolean, data: {...} } thì lấy res.data
      if (res && typeof res === "object" && "data" in res && "status" in res && typeof res.status === "boolean") {
        backendResponse = res.data;
      }

      // Backend response có structure: { status: "success", message: "...", data: { conversationId, UserId, ImageUrl, CreatedAt }, timestamp }
      // Vậy payload = backendResponse.data
      const payload = backendResponse?.data || backendResponse || {};

      const imageUrl = payload.ImageUrl || payload.imageUrl || "";
      const CreatedAt = payload.CreatedAt || payload.createdAt || new Date().toISOString();
      const conversationId = payload.conversationId || payload._id || tempId;

      if (!imageUrl) {
        // Thử poll server để lấy ảnh trong vài giây
        let attempts = 0;
        const maxAttempts = 20; // Tăng số lần thử lên 20
        const pollInterval = setInterval(async () => {
          try {
            attempts++;
            if (attempts > maxAttempts) {
              clearInterval(pollInterval);
              setConversations((prev) =>
                prev.map((c) =>
                  c.id === tempId
                    ? {
                        ...c,
                        imageUrl: "",
                        prompt: `${c.prompt}\n[Đang tải ảnh... Vui lòng đợi]`,
                      }
                    : c
                )
              );
              // Tự động reload sau khi hết số lần thử
              setTimeout(() => {
                window.location.reload();
              }, 2000);
              return;
            }

            const response: any = await getConversations();
            const dataArr = Array.isArray(response) ? response : response?.data || [];
            const latestConversation = dataArr.find(
              (c: any) => c._id === conversationId || c.conversationId === conversationId
            );

            if (latestConversation && (latestConversation.ImageUrl || latestConversation.imageUrl)) {
              // Tăng thời gian chờ thêm 2 giây sau khi tìm thấy ảnh
              await new Promise((resolve) => setTimeout(resolve, 2000));
              clearInterval(pollInterval);
              const newImageUrl = latestConversation.ImageUrl || latestConversation.imageUrl;

              setConversations((prev) => prev.map((c) => (c.id === tempId ? { ...c, imageUrl: newImageUrl } : c)));

              // Lưu ID và reload sau khi có ảnh
              localStorage.setItem("lastConversationId", conversationId);
              window.location.reload();
            }
          } catch (error) {}
        }, 3000);

        return;
      }

      // Nếu có imageUrl ngay lập tức
      localStorage.setItem("lastConversationId", conversationId);
      window.location.reload();

      // Cập nhật lại coins sau khi generate thành công
      if (user?._id && getUserByIdUrl) {
        try {
          const response: any = await getUserByIdUrl(user._id);
          const coins = response?.data?.coins || 0;
          setUserCoins(typeof coins === "string" ? parseFloat(coins) : Number(coins));
        } catch (error) {}
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "";
      const isInsufficientFunds =
        errorMessage.toLowerCase().includes("not enough coins") ||
        errorMessage.toLowerCase().includes("insufficient") ||
        errorMessage.toLowerCase().includes("not enough");

      if (isInsufficientFunds) {
        // Remove the temporary conversation
        setConversations((prev) => prev.filter((c) => c.id !== tempId));
        // Show insufficient funds dialog
        setShowInsufficientFunds(true);
        // Redirect after 3 seconds
        setTimeout(() => {
          setShowInsufficientFunds(false);
          navigate("/characters/depositecoin");
        }, 3000);
      } else {
        const msg = errorMessage || "Lỗi tạo ảnh";
        setConversations((prev) =>
          prev.map((c) => (c.id === tempId ? { ...c, imageUrl: "", prompt: `${c.prompt}\n[Error: ${msg}]` } : c))
        );
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const selectConversation = (id: string) => {
    setSelectedId(id);

    // Scroll tới conversation được chọn
    setTimeout(() => {
      const element = document.getElementById(`conversation-${id}`);
      if (element && chatContainerRef.current) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <>
      <div className="arthub-container">
        {/* Sidebar - Lịch sử */}
        {hasStarted && (
          <div className="arthub-sidebar">
            <div className="arthub-sidebar-header">
              <h2 className="arthub-sidebar-title">Lịch sử tạo ảnh</h2>
            </div>
            <div className="arthub-sidebar-content">
              {isLoadingHistory ? (
                <div className="arthub-sidebar-loading">
                  <Loader2 className="arthub-icon-large" />
                </div>
              ) : conversations.length === 0 ? (
                <p className="arthub-sidebar-empty">Chưa có ảnh nào</p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`arthub-conversation-item ${selectedId === conv.id ? "active" : "inactive"}`}>
                    <p className="arthub-conversation-prompt">{conv.prompt}</p>
                    <p className="arthub-conversation-time">{format(new Date(conv.createdAt), "HH:mm dd/MM")}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Main Area */}
        <div className="arthub-main">
          {/* Trang chủ: Căn giữa */}
          {!hasStarted && !isLoadingHistory ? (
            <div className="arthub-home">
              <div className="arthub-home-content">
                <div className="arthub-home-header">
                  <h1 className="arthub-home-title">AI Image Generator</h1>
                  <p className="arthub-home-subtitle">Nhập mô tả để tạo ảnh ngay lập tức</p>
                </div>
                <form onSubmit={sendPrompt} className="arthub-home-form">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ví dụ: Một chú mèo đeo kính râm trên bãi biển..."
                    className="arthub-home-input"
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={isLoading || !input.trim()} className="arthub-home-button">
                    {isLoading ? (
                      <div className="button-content">
                        <Loader2 className="arthub-icon" />
                        <span>Đang tạo...</span>
                      </div>
                    ) : (
                      <div className="button-content">
                        <ImageIcon className="arthub-icon" />
                        <span>Generate</span>
                      </div>
                    )}
                  </button>
                </form>
              </div>
            </div>
          ) : (
            <>
              {/* Chat Area */}
              <div ref={chatContainerRef} className="arthub-chat-container">
                {conversations.length === 0 ? (
                  <div className="arthub-chat-empty">Nhập mô tả và nhấn Generate để bắt đầu</div>
                ) : (
                  // Đảo ngược thứ tự để mới nhất ở dưới cùng
                  [...conversations]
                    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                    .map((conv) => (
                      <div
                        key={conv.id}
                        id={`conversation-${conv.id}`}
                        className={`arthub-conversation-row ${selectedId === conv.id ? "selected" : "unselected"}`}>
                        {/* Ảnh bên trái */}
                        <div className="arthub-image-container">
                          {conv.imageUrl ? (
                            <div className="arthub-image-wrapper">
                              <img
                                src={conv.imageUrl}
                                alt="Generated"
                                className="arthub-generated-image"
                                loading="lazy"
                              />
                              <p className="arthub-image-time">
                                {format(new Date(conv.createdAt), "HH:mm:ss - dd/MM/yyyy")}
                              </p>
                            </div>
                          ) : (
                            <div className="arthub-image-loading">
                              <div className="arthub-skeleton-loader">
                                <div className="arthub-skeleton-shimmer"></div>
                                <div className="arthub-loading-text">Đang tạo ảnh...</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Prompt bên phải */}
                        <div className="arthub-prompt-container">
                          <div className="arthub-prompt-bubble">
                            <p className="arthub-prompt-text">{conv.prompt}</p>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>

              {/* Input ở dưới */}
              <div className="arthub-input-area">
                <form onSubmit={sendPrompt} className="arthub-input-form">
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Nhập mô tả mới để tạo ảnh..."
                    className="arthub-input-field"
                    disabled={isLoading}
                  />
                  <button type="submit" disabled={isLoading || !input.trim()} className="arthub-send-button">
                    {isLoading ? (
                      <Loader2 className="arthub-icon loading-animation" />
                    ) : (
                      <Send className="arthub-icon" />
                    )}
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Insufficient Funds Dialog */}
      <Dialog open={showInsufficientFunds} aria-labelledby="insufficient-funds-dialog" className="dialog-custom">
        <div className="arthub-insufficient-dialog">
          <h2>Insufficient Funds</h2>
          <p>You will be redirected to deposit page...</p>
        </div>
      </Dialog>
    </>
  );
}
