// handlers.ts
export interface TypeOfTopic {
  TypeID: number;
  NameOfType: string;
}

export interface User {
  UserID: number;
  UserName: string;
  AvatarURL: string;
}

export interface Topic {
  TopicID: number;
  TitleTopic: string;
  Description: string;
  TypeID: number;
  UserID: number; // Người tạo topic
}

export interface Thread {
  ThreadID: number;
  TitleThread: string;
  ThreadDescription: string;
  Likes: number;
  Comments: number;
  DateCreated: string; // Định dạng 'YYYY-MM-DDTHH:mm:ssZ' (ISO 8601)
  TopicID: number;
  UserID: number; // Người tạo thread
}

export interface Comment {
  CommentID: number; // Giả định để phục vụ tính toán
  ThreadID: number;
  UserID: number; // Người tạo comment
  DateCreated: string;
  Content: string;
}

export const mockUsers: User[] = [
  {
    UserID: 1,
    UserName: "Moudeus",
    AvatarURL: "https://t4.ftcdn.net/jpg/07/71/17/11/360_F_771171175_4hD5F0gFznDfudqIolxHo7If0qa1D6Za.jpg",
  },
  {
    UserID: 2,
    UserName: "DuyKhang",
    AvatarURL: "https://t4.ftcdn.net/jpg/07/22/55/05/360_F_722550509_HcSl2uXlToZd88q8OKGCtoO1LW5d8x8B.jpg",
  },
];

export const mockTypes: TypeOfTopic[] = [
  { TypeID: 1, NameOfType: "General" },
  { TypeID: 2, NameOfType: "Entertainment" },
  { TypeID: 3, NameOfType: "Commission" },
  { TypeID: 4, NameOfType: "Report" },
];

export const mockTopics: Topic[] = [
  {
    TopicID: 1,
    TitleTopic: "ArtHub",
    Description: "Hello World, This Group provide a lot of think",
    TypeID: 1,
    UserID: 1,
  },
  { TopicID: 2, TitleTopic: "Event", Description: "Hello World", TypeID: 1, UserID: 1 },
  { TopicID: 3, TitleTopic: "News", Description: "Hello World", TypeID: 1, UserID: 2 },
  { TopicID: 4, TitleTopic: "Give Away", Description: "Hello World", TypeID: 1, UserID: 2 },
  { TopicID: 5, TitleTopic: "Topic 5", Description: "Hello World", TypeID: 2, UserID: 1 },
  { TopicID: 6, TitleTopic: "Topic 6", Description: "Hello World", TypeID: 2, UserID: 2 },
  { TopicID: 7, TitleTopic: "Topic 7", Description: "Hello World", TypeID: 2, UserID: 1 },
  { TopicID: 8, TitleTopic: "Topic 8", Description: "Hello World", TypeID: 2, UserID: 2 },
  { TopicID: 9, TitleTopic: "Topic 9", Description: "Hello World", TypeID: 3, UserID: 1 },
  { TopicID: 10, TitleTopic: "Topic 10", Description: "Hello World", TypeID: 3, UserID: 2 },
  { TopicID: 11, TitleTopic: "Topic 11", Description: "Hello World", TypeID: 3, UserID: 1 },
  { TopicID: 12, TitleTopic: "Topic 12", Description: "Hello World", TypeID: 3, UserID: 2 },
  { TopicID: 13, TitleTopic: "Topic 13", Description: "Hello World", TypeID: 4, UserID: 1 },
  { TopicID: 14, TitleTopic: "Topic 14", Description: "Hello World", TypeID: 4, UserID: 2 },
  { TopicID: 15, TitleTopic: "Topic 15", Description: "Hello World", TypeID: 4, UserID: 1 },
  { TopicID: 16, TitleTopic: "Topic 16", Description: "Hello World", TypeID: 4, UserID: 2 },
];

export const mockThreads: Thread[] = [
  {
    ThreadID: 1,
    TitleThread: "Cách tạo một ứng dụng React",
    ThreadDescription: "Chào mọi người, hôm nay mình sẽ hướng dẫn các bạn cách tạo một ứng dụng React đơn giản.",
    Likes: 10,
    Comments: 5,
    DateCreated: "2025-03-03T21:21:00Z", // 1 phút trước (21:22 - 21:21 = 1 phút)
    TopicID: 1,
    UserID: 1,
  },
  {
    ThreadID: 2,
    TitleThread: "Thread 2",
    ThreadDescription: "Description 2",
    Likes: 15,
    Comments: 8,
    DateCreated: "2025-03-03T21:10:00Z", // 12 phút trước (21:22 - 21:10 = 12 phút)
    TopicID: 1,
    UserID: 2,
  },
  {
    ThreadID: 3,
    TitleThread: "Thread 3",
    ThreadDescription: "Description 3",
    Likes: 20,
    Comments: 12,
    DateCreated: "2025-03-03T20:22:00Z", // 1 giờ trước (21:22 - 20:22 = 1 giờ)
    TopicID: 2,
    UserID: 1,
  },
  {
    ThreadID: 4,
    TitleThread: "Thread 4",
    ThreadDescription: "Description 4",
    Likes: 5,
    Comments: 3,
    DateCreated: "2025-03-03T18:22:00Z", // 3 giờ trước (21:22 - 18:22 = 3 giờ)
    TopicID: 2,
    UserID: 2,
  },
  {
    ThreadID: 5,
    TitleThread: "Thread 5",
    ThreadDescription: "Description 5",
    Likes: 25,
    Comments: 15,
    DateCreated: "2025-03-02T21:22:00Z", // 1 ngày trước (3/3 - 2/3 = 1 ngày)
    TopicID: 3,
    UserID: 1,
  },
  {
    ThreadID: 6,
    TitleThread: "Thread 6",
    ThreadDescription: "Description 6",
    Likes: 30,
    Comments: 18,
    DateCreated: "2025-03-01T21:22:00Z", // 2 ngày trước (3/3 - 1/3 = 2 ngày)
    TopicID: 3,
    UserID: 2,
  },
  {
    ThreadID: 7,
    TitleThread: "Thread 7",
    ThreadDescription: "Description 7",
    Likes: 10,
    Comments: 5,
    DateCreated: "2025-02-28T21:22:00Z", // 3 ngày trước (3/3 - 28/2 = 3 ngày)
    TopicID: 4,
    UserID: 1,
  },
  {
    ThreadID: 8,
    TitleThread: "Thread 8",
    ThreadDescription: "Description 8",
    Likes: 15,
    Comments: 8,
    DateCreated: "2025-03-02T15:20:00Z", // 1 ngày 6 giờ trước
    TopicID: 5,
    UserID: 2,
  },
  {
    ThreadID: 9,
    TitleThread: "Thread 9",
    ThreadDescription: "Description 9",
    Likes: 20,
    Comments: 12,
    DateCreated: "2025-03-03T17:45:00Z", // 3 giờ 37 phút trước
    TopicID: 6,
    UserID: 1,
  },
  {
    ThreadID: 10,
    TitleThread: "Thread 10",
    ThreadDescription: "Description 10",
    Likes: 5,
    Comments: 3,
    DateCreated: "2025-03-04T12:30:00Z", // Ngày mai, sẽ hiển thị "- hours ago" nếu không xử lý
    TopicID: 7,
    UserID: 2,
  },
  {
    ThreadID: 11,
    TitleThread: "Thread 11",
    ThreadDescription: "Description 11",
    Likes: 25,
    Comments: 15,
    DateCreated: "2025-03-03T20:10:00Z", // 1 giờ 12 phút trước
    TopicID: 8,
    UserID: 1,
  },
  {
    ThreadID: 12,
    TitleThread: "Thread 12",
    ThreadDescription: "Description 12",
    Likes: 30,
    Comments: 18,
    DateCreated: "2025-03-03T21:00:00Z", // 22 phút trước
    TopicID: 9,
    UserID: 2,
  },
  {
    ThreadID: 13,
    TitleThread: "Thread 13",
    ThreadDescription: "Description 13",
    Likes: 10,
    Comments: 5,
    DateCreated: "2025-03-03T21:15:00Z", // 7 phút trước
    TopicID: 10,
    UserID: 1,
  },
  {
    ThreadID: 14,
    TitleThread: "Thread 14",
    ThreadDescription: "Description 14",
    Likes: 15,
    Comments: 8,
    DateCreated: "2025-03-03T21:20:00Z", // 2 phút trước
    TopicID: 11,
    UserID: 2,
  },
  {
    ThreadID: 15,
    TitleThread: "Thread 15",
    ThreadDescription: "Description 15",
    Likes: 20,
    Comments: 12,
    DateCreated: "2025-03-03T18:30:00Z", // 2 giờ 52 phút trước
    TopicID: 12,
    UserID: 1,
  },
  {
    ThreadID: 16,
    TitleThread: "Thread 16",
    ThreadDescription: "Description 16",
    Likes: 5,
    Comments: 3,
    DateCreated: "2025-03-04T13:20:00Z", // Ngày mai, sẽ hiển thị "- hours ago" nếu không xử lý
    TopicID: 13,
    UserID: 2,
  },
  {
    ThreadID: 17,
    TitleThread: "Thread 17",
    ThreadDescription: "Description 17",
    Likes: 25,
    Comments: 15,
    DateCreated: "2025-03-02T21:22:00Z", // 1 ngày trước
    TopicID: 14,
    UserID: 1,
  },
  {
    ThreadID: 18,
    TitleThread: "Thread 18",
    ThreadDescription: "Description 18",
    Likes: 30,
    Comments: 18,
    DateCreated: "2025-03-01T21:22:00Z", // 2 ngày trước
    TopicID: 15,
    UserID: 2,
  },
  {
    ThreadID: 19,
    TitleThread: "Thread 19",
    ThreadDescription: "Description 19",
    Likes: 10,
    Comments: 5,
    DateCreated: "2025-02-28T21:22:00Z", // 3 ngày trước
    TopicID: 16,
    UserID: 1,
  },
];

export const mockComments: Comment[] = [
  { CommentID: 1, ThreadID: 1, UserID: 1, DateCreated: "2025-03-01T12:00:00Z", Content: "This is a comment" },
  { CommentID: 2, ThreadID: 1, UserID: 2, DateCreated: "2025-03-02T13:00:00Z", Content: "Another comment" },
  { CommentID: 3, ThreadID: 2, UserID: 1, DateCreated: "2025-03-03T14:00:00Z", Content: "Yet another comment" },
  { CommentID: 4, ThreadID: 3, UserID: 2, DateCreated: "2025-03-04T15:00:00Z", Content: "More comments" },
  // Thêm các comment khác nếu cần...
];

// Hàm mock API
export const fetchTypes = (page: number, size: number): Promise<{ types: TypeOfTopic[]; hasMore: boolean }> => {
  const start = (page - 1) * size;
  const end = start + size;
  const paginatedTypes = mockTypes.slice(start, end);
  const hasMore = end < mockTypes.length;
  return Promise.resolve({ types: paginatedTypes, hasMore });
};

export const fetchTopics = (typeID: number, limit: number): Promise<Topic[]> => {
  const topics = mockTopics.filter((topic) => topic.TypeID === typeID).slice(0, limit);
  return Promise.resolve(topics);
};

// Tính ThreadCount, LatestPoster, và DateCreated của thread gần nhất cho mỗi topic
export const getTopicDetails = (
  topicId: number
): { ThreadCount: number; LatestPoster: User | null; DateCreated: string } => {
  const threads = mockThreads.filter((thread) => thread.TopicID === topicId);
  const threadCount = threads.length;

  // Kiểm tra nếu threads rỗng
  if (threads.length === 0) {
    return { ThreadCount: 0, LatestPoster: null, DateCreated: "1970-01-01T00:00:00Z" };
  }

  // Tìm thread có DateCreated gần nhất, kiểm tra tính hợp lệ
  const latestThread = threads.reduce((latest, current) => {
    const latestDate = new Date(latest.DateCreated);
    const currentDate = new Date(current.DateCreated);
    if (isNaN(latestDate.getTime())) {
      console.warn(`Invalid Date for latest thread: ${latest.DateCreated}`);
      return current;
    }
    if (isNaN(currentDate.getTime())) {
      console.warn(`Invalid Date for current thread: ${current.DateCreated}`);
      return latest;
    }
    return latestDate > currentDate ? latest : current;
  }, threads[0]);

  // Tìm user từ UserID của thread gần nhất
  const latestPoster = mockUsers.find((user) => user.UserID === latestThread?.UserID) || null;

  // Trả về DateCreated của thread gần nhất
  return { ThreadCount: threadCount, LatestPoster: latestPoster, DateCreated: latestThread.DateCreated };
};
